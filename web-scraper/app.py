# web-scraper/app.py – General Web Search API
import sys
import asyncio
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from fastapi import FastAPI, HTTPException, BackgroundTasks, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Dict, List, Optional, Any
import uuid
from datetime import datetime
import tempfile
import pandas as pd
import uvicorn
import os
import logging
import base64

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from scraper import general_web_search, CaptchaType

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

captcha_ws: Optional[WebSocket] = None
pending_captchas: Dict[str, Dict] = {}

app = FastAPI(title="General Web Search API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    max_results: int = 30

active_tasks: Dict[str, Dict] = {}
task_results: Dict[str, List[Dict]] = {}
stop_flags: Dict[str, Dict[str, bool]] = {}

@app.websocket("/ws/captcha")
async def captcha_websocket(websocket: WebSocket):
    global captcha_ws
    await websocket.accept()
    logger.info("✅ WebSocket client connected for CAPTCHA")
    captcha_ws = websocket
    try:
        while True:
            data = await websocket.receive_json()
            challenge_id = data.get("challenge_id")
            if challenge_id and challenge_id in pending_captchas:
                pending_captchas[challenge_id]["solution"] = data
                pending_captchas[challenge_id]["event"].set()
                logger.info(f"✅ Received solution for challenge {challenge_id}")
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
        captcha_ws = None

async def request_captcha_solution(screenshot_bytes: bytes, captcha_type: str) -> Dict[str, Any]:
    """Called by scraper to ask user for CAPTCHA solution."""
    global captcha_ws
    # Wait up to 5 seconds for a WebSocket client to connect
    for _ in range(50):
        if captcha_ws:
            break
        await asyncio.sleep(0.1)

    if not captcha_ws:
        logger.error("No WebSocket client connected for CAPTCHA")
        raise HTTPException(status_code=503, detail="No CAPTCHA solver connected")
    challenge_id = str(uuid.uuid4())
    event = asyncio.Event()
    pending_captchas[challenge_id] = {
        "event": event,
        "solution": None,
        "screenshot": screenshot_bytes,
        "type": captcha_type
    }
    # Send challenge to frontend
    await captcha_ws.send_json({
        "challenge_id": challenge_id,
        "type": captcha_type,
        "image": base64.b64encode(screenshot_bytes).decode()
    })
    logger.info(f"📸 CAPTCHA challenge sent, waiting for solution (type={captcha_type}, id={challenge_id})")
    try:
        await asyncio.wait_for(event.wait(), timeout=60.0)
        solution = pending_captchas[challenge_id].get("solution")
        logger.info(f"✅ CAPTCHA solved: {solution}")
        return solution or {"type": "timeout"}
    except asyncio.TimeoutError:
        logger.warning("⏰ CAPTCHA timeout")
        return {"type": "timeout"}
    finally:
        pending_captchas.pop(challenge_id, None)

async def run_searcher(task_id: str, query: str, max_results: int):
    async def captcha_handler(screenshot: bytes, captcha_type: CaptchaType) -> Dict[str, Any]:
        return await request_captcha_solution(screenshot, captcha_type.value)
    
    try:
        active_tasks[task_id] = {
            "status": "processing",
            "progress": 0,
            "results_count": 0,
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "error": None
        }
        results = []
        stop_flags[task_id] = {"stop": False}

        async for result in general_web_search(
            query=query,
            max_results=max_results,
            stop_flag=stop_flags[task_id],
            on_captcha=captcha_handler
        ):
            if stop_flags[task_id].get("stop"):
                active_tasks[task_id]["status"] = "stopped"
                break
            results.append(result)
            active_tasks[task_id]["results_count"] = len(results)
            active_tasks[task_id]["progress"] = min(95, int((len(results) / max_results) * 95))
            active_tasks[task_id]["updated_at"] = datetime.now()

        active_tasks[task_id].update({
            "status": "completed",
            "progress": 100,
            "results_count": len(results),
            "updated_at": datetime.now()
        })
        task_results[task_id] = results
        logger.info(f"Task {task_id} completed with {len(results)} results")
    except Exception as e:
        logger.error(f"Task {task_id} failed: {e}", exc_info=True)
        active_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "updated_at": datetime.now()
        })
    finally:
        if task_id in stop_flags:
            del stop_flags[task_id]

@app.get("/")
async def health_check():
    return {"status": "healthy", "service": "web-search", "timestamp": datetime.now()}

@app.post("/api/search")
async def start_search(request: SearchRequest, background_tasks: BackgroundTasks):
    if not request.query:
        raise HTTPException(status_code=400, detail="Query parameter is required")
    task_id = str(uuid.uuid4())
    background_tasks.add_task(run_searcher, task_id, request.query, request.max_results)
    return {"task_id": task_id, "status": "started", "message": f"Searching for: {request.query}"}

@app.post("/api/search/stop/{task_id}")
async def stop_search(task_id: str):
    if task_id in stop_flags:
        stop_flags[task_id]["stop"] = True
        if task_id in active_tasks:
            active_tasks[task_id]["status"] = "stopping"
        return {"status": "success"}
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/task/{task_id}")
async def get_task_status(task_id: str):
    if task_id in active_tasks:
        return active_tasks[task_id]
    if task_id in task_results:
        return {"status": "completed", "results_count": len(task_results[task_id]), "updated_at": datetime.now()}
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/task/{task_id}/results")
async def get_task_results(task_id: str):
    if task_id in task_results:
        return {"task_id": task_id, "results": task_results[task_id], "count": len(task_results[task_id])}
    if task_id in active_tasks and active_tasks[task_id]["status"] in ("processing", "stopping"):
        raise HTTPException(status_code=425, detail="Task still in progress")
    raise HTTPException(status_code=404, detail="Results not found")

@app.post("/api/export/csv")
async def export_csv(task_id: str = Form(...)):
    if task_id not in task_results:
        raise HTTPException(status_code=404, detail="No results for this task")
    df = pd.DataFrame(task_results[task_id])
    temp = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False, encoding='utf-8')
    df.to_csv(temp.name, index=False)
    temp.close()
    filename = f"web_search_{task_id[:8]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    return FileResponse(path=temp.name, filename=filename, media_type='text/csv', background=BackgroundTasks([lambda: os.unlink(temp.name)]))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=False, workers=1)