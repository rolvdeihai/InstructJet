# app.py
import sys
import asyncio
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
from fastapi import FastAPI, HTTPException, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, List, Optional
import uuid
from datetime import datetime
import tempfile
import pandas as pd
import uvicorn
import os
import traceback
import logging

logging.basicConfig(
    level=logging.DEBUG,  # 👈 THIS IS THE KEY
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scraper import scrape_lead_by_industry
from parser import parse_data

app = FastAPI(title="LeadGen AI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ScrapeRequest(BaseModel):
    industry: str
    location: str
    source: str = "google"
    max_results: int = 50

# In-memory storage for tasks
active_tasks: Dict[str, Dict] = {}
task_results: Dict[str, List[Dict]] = {}
stop_flags: Dict[str, Dict[str, bool]] = {}

# In app.py, update the run_scraper function around line 75
async def run_scraper(task_id: str, industry: str, location: str, source: str, max_results: int = 50):
    """Run the scraper in the background"""
    try:
        print(f"Starting scraper task {task_id} for {industry} in {location} from {source}")
        
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
        
        # Initialize progress tracking
        async def update_progress(count: int):
            active_tasks[task_id]["results_count"] = count
            active_tasks[task_id]["updated_at"] = datetime.now()
            progress = min(95, int((count / max_results) * 95)) if max_results > 0 else 0
            active_tasks[task_id]["progress"] = progress
        
        # Run the scraper
        scraped_count = 0
        async for lead in scrape_lead_by_industry(
            industry=industry,
            location=location,
            max_results=max_results,
            stop_flag=stop_flags[task_id],
            source=source
        ):
            if stop_flags[task_id].get("stop"):
                active_tasks[task_id]["status"] = "stopped"
                break
                
            if lead:
                results.append(lead)
                scraped_count += 1
                
                # Update progress every 5 leads
                if scraped_count % 5 == 0:
                    await update_progress(scraped_count)
                
                # Stop if we've reached max_results
                if max_results and scraped_count >= max_results:
                    print(f"Reached max results ({max_results}), stopping...")
                    stop_flags[task_id]["stop"] = True
                    break
        
        # Final progress update
        await update_progress(scraped_count)
        
        # Parse the results
        if results:
            print(f"Parsing {len(results)} results for task {task_id}")
            df = pd.DataFrame(results)
            fieldnames = ['Company', 'Industry', 'Address', 'Business_phone', 'Website']
            parsed_df = parse_data(df, fieldnames, location)
            parsed_results = parsed_df.to_dict('records')
        else:
            parsed_results = []
        
        # Update final status
        active_tasks[task_id].update({
            "status": "completed",
            "progress": 100,
            "results_count": len(parsed_results),
            "updated_at": datetime.now()
        })
        
        # Store results
        task_results[task_id] = parsed_results
        print(f"Task {task_id} completed with {len(parsed_results)} results")
        
    except Exception as e:
        print(f"Error during scraping in task {task_id}: {e}")
        traceback.print_exc()
        
        active_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "updated_at": datetime.now()
        })
        
    finally:
        # Clean up stop flag
        if task_id in stop_flags:
            del stop_flags[task_id]
                    
@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "leadgen-api",
        "timestamp": datetime.now(),
        "version": "1.0.0"
    }

@app.post("/api/scrape")
async def start_scraping(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """Start a new scraping task"""
    task_id = str(uuid.uuid4())
    
    # Validate input
    if not request.industry or not request.location:
        raise HTTPException(
            status_code=400,
            detail="Industry and location are required"
        )
    
    # Start background task
    background_tasks.add_task(
        run_scraper,
        task_id,
        request.industry,
        request.location,
        request.source,
        request.max_results
    )
    
    return {
        "task_id": task_id,
        "status": "started",
        "message": f"Scraping {request.industry} in {request.location} from {request.source}",
        "max_results": request.max_results
    }

@app.post("/api/scrape/stop/{task_id}")
async def stop_scraping(task_id: str):
    """Stop a running scraping task"""
    if task_id in stop_flags:
        stop_flags[task_id]["stop"] = True
        
        if task_id in active_tasks:
            active_tasks[task_id].update({
                "status": "stopping",
                "updated_at": datetime.now()
            })
        
        return {"status": "success", "message": f"Task {task_id} stopping"}
    
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/task/{task_id}")
async def get_task_status(task_id: str):
    """Get the status of a scraping task"""
    if task_id in active_tasks:
        return active_tasks[task_id]
    elif task_id in task_results:
        return {
            "task_id": task_id,
            "status": "completed",
            "results_count": len(task_results[task_id]),
            "updated_at": datetime.now()
        }
    
    raise HTTPException(status_code=404, detail="Task not found")

@app.get("/api/task/{task_id}/results")
async def get_task_results(task_id: str):
    """Get the results of a completed task"""
    if task_id in task_results:
        return {
            "task_id": task_id,
            "results": task_results[task_id],
            "count": len(task_results[task_id])
        }
    
    if task_id in active_tasks:
        status = active_tasks[task_id]["status"]
        if status in ["processing", "starting", "stopping"]:
            raise HTTPException(
                status_code=425,
                detail=f"Task is still {status}. Please wait."
            )
    
    raise HTTPException(status_code=404, detail="Task or results not found")

@app.post("/api/export/csv")
async def export_csv(task_id: str = Form(...)):
    """Export task results as CSV"""
    if task_id not in task_results:
        raise HTTPException(status_code=404, detail="Task results not found")
    
    results = task_results[task_id]
    if not results:
        raise HTTPException(status_code=400, detail="No results to export")
    
    # Create DataFrame
    df = pd.DataFrame(results)
    
    # Create temporary CSV file
    temp_file = tempfile.NamedTemporaryFile(
        mode='w', 
        suffix='.csv', 
        delete=False,
        encoding='utf-8'
    )
    df.to_csv(temp_file.name, index=False)
    temp_file.close()
    
    # Generate filename
    filename = f"leads_{task_id[:8]}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return FileResponse(
        path=temp_file.name,
        filename=filename,
        media_type='text/csv',
        background=BackgroundTasks([lambda: os.unlink(temp_file.name)])
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        workers=1,
        loop="asyncio"
    )