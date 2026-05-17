# app.py – Fixed: pure Mermaid output & context expansion
import os
import logging
import asyncio
import time
import traceback
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
from contextlib import asynccontextmanager
from huggingface_hub import hf_hub_download

from mermaid_compress_expand import compress_text_to_mermaid, expand_mermaid_to_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- CPU optimizations ----------
def optimize_for_cpu():
    os.environ['OMP_NUM_THREADS'] = str(os.cpu_count())
    os.environ['KMP_BLOCKTIME'] = '1'
    os.environ['KMP_AFFINITY'] = 'granularity=fine,compact,1,0'
    try:
        import psutil
        p = psutil.Process()
        p.nice(-5)
        logger.debug("Set process to higher priority")
    except:
        pass
optimize_for_cpu()

# ---------- Queue management ----------
class QueueStatus:
    def __init__(self, max_concurrent: int = 1):
        self.max_concurrent = max_concurrent
        self.active_tasks = 0
        self.pending_queue = []
        self._lock = asyncio.Lock()
    async def acquire(self):
        async with self._lock:
            if self.active_tasks < self.max_concurrent:
                self.active_tasks += 1
                return True, 0
            else:
                position = len(self.pending_queue) + 1
                future = asyncio.Future()
                self.pending_queue.append(future)
                return False, position
    async def release(self):
        async with self._lock:
            self.active_tasks -= 1
            if self.pending_queue:
                future = self.pending_queue.pop(0)
                future.set_result(True)
                self.active_tasks += 1
    def get_status(self):
        return {"active": self.active_tasks, "queued": len(self.pending_queue), "max_concurrent": self.max_concurrent}

queue_status = QueueStatus(max_concurrent=1)

def should_compress(text: str, threshold_words: int = 50) -> bool:
    return len(text.split()) > threshold_words

# ---------- Model class ----------
class MixtralFreeModel:
    def __init__(self, model_path: str = None):
        self.model_name = "ministral-3.3b"
        self.max_tokens = 512
        self.temperature = 0.7

        if model_path is None:
            model_path = os.environ.get("GGUF_MODEL_PATH", None)

        if model_path and os.path.exists(model_path):
            gguf_file = model_path
            logger.info(f"Using provided model path: {gguf_file}")
        else:
            local_path = "/app/models/Ministral-3-3B-Instruct-2512-Q4_K_M.gguf"
            if os.path.exists(local_path):
                gguf_file = local_path
                logger.info(f"Using local model file: {local_path}")
            else:
                logger.info("Downloading Ministral-3.3B model from Hugging Face Hub...")
                gguf_file = hf_hub_download(
                    repo_id="mistralai/Ministral-3-3B-Instruct-2512-GGUF",
                    filename="Ministral-3-3B-Instruct-2512-Q4_K_M.gguf"
                )
                logger.info(f"Downloaded model to: {gguf_file}")

        logger.info(f"Loading GGUF model from {gguf_file}...")
        start_time = time.time()
        try:
            self.llm = Llama(
                model_path=gguf_file,
                n_ctx=8192,          # increased context
                n_batch=512,
                n_gpu_layers=0,
                n_threads=os.cpu_count(),
                n_threads_batch=os.cpu_count(),
                use_mlock=True,
                use_mmap=True,
                low_vram=False,
                verbose=False,
                seed=42,
            )
            load_time = time.time() - start_time
            logger.info(f"GGUF model loaded successfully in {load_time:.2f}s")
        except Exception as e:
            logger.error(f"Failed to load GGUF model: {e}")
            raise

    async def warm_up(self) -> None:
        logger.info("Warming up model with test inference...")
        try:
            await self._generate_completion("Hello", max_tokens=10, temperature=0.1)
            logger.info("Model warm-up completed")
        except Exception as e:
            logger.warning(f"Model warm-up failed: {e}")

    async def _generate_completion(self, prompt: str, max_tokens: int = None, temperature: float = None) -> str:
        if max_tokens is None:
            max_tokens = self.max_tokens
        if temperature is None:
            temperature = 0.3
        def _blocking():
            response = self.llm.create_completion(
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=0.95,
                stop=["</s>", "[INST]", "[/INST]"],  # stop early to avoid continuation
                echo=False,
                stream=False
            )
            return response['choices'][0]['text'].strip()
        return await asyncio.to_thread(_blocking)

    # ---------- Mermaid pipeline core ----------
    async def process_with_mermaid(self, input_text: str, instruction: str) -> str:
        logger.info("process_with_mermaid: compressing input to Mermaid")
        compressed_mermaid = compress_text_to_mermaid(input_text)
        logger.info(f"Compressed to {len(compressed_mermaid.splitlines())} edges")

        system_prompt = f"""You are an expert at editing Mermaid flowcharts.
Given the Mermaid diagram below, perform the following instruction: {instruction}
Output ONLY a valid Mermaid diagram in exactly the same edge format as the input.
Use lines like: "Subject -- verb:relation --> Object"
Do not add any extra text, explanations, or markdown.
Input Mermaid:
{compressed_mermaid}

Now produce the modified Mermaid:"""
        prompt = f"<s>[INST] {system_prompt} [/INST]"
        model_mermaid = await self._generate_completion(prompt, max_tokens=1024, temperature=0.2)
        # Strip any text outside Mermaid code block
        model_mermaid = self._extract_mermaid(model_mermaid)
        expanded_text = expand_mermaid_to_text(model_mermaid)
        return expanded_text

    def _extract_mermaid(self, text: str) -> str:
        """Extract pure Mermaid diagram from LLM output, discarding explanations."""
        # Look for ```mermaid ... ``` block
        m = re.search(r'```mermaid\n(.*?)\n```', text, re.DOTALL)
        if m:
            return m.group(1).strip()
        # If no fences, try to find lines that look like edges or flowchart
        lines = text.split('\n')
        mermaid_lines = []
        for line in lines:
            if '-->' in line or '--' in line or 'flowchart' in line or 'graph' in line:
                mermaid_lines.append(line)
        if mermaid_lines:
            return '\n'.join(mermaid_lines)
        return text.strip()

    # ---------- Chat ----------
    async def generate_response(self, question: str, context: str = "") -> str:
        is_guide_request = any(phrase in question.lower() for phrase in 
                            ["guide", "create a guide", "make a guide", "step by step", "tutorial"])

        if is_guide_request:
            system_prompt = f"""You are an assistant that creates structured guides.
Based on the conversation below, output ONLY a valid JSON object with "action" and "summary".
The summary must be a detailed, specific description of the user's task, including all key deliverables, target audience, and required assets.

Do not add any extra text, explanations, or markdown.

Format:
{{"action": "generate_guide", "summary": "Detailed task description..."}}

Conversation:
{context}

User's latest request: {question}

Now output the JSON:"""
            prompt = f"<s>[INST] {system_prompt}\n\nNow handle this user request: {question} [/INST]"
            response_text = await self._generate_completion(prompt, max_tokens=512)
            match = re.search(r'\{[^{}]*"action"\s*:\s*"generate_guide"[^{}]*\}', response_text, re.DOTALL)
            if match:
                return match.group(0)
            else:
                return json.dumps({"action": "generate_guide", "summary": "Create a guide based on the conversation."})

        total_input = question + " " + context
        if should_compress(total_input):
            logger.info(f"Using Mermaid compression (input length: {len(total_input.split())} words)")
            instruction = f"Answer the following question based on the provided context. Output a Mermaid diagram that conveys the answer. Question: {question}"
            return await self.process_with_mermaid(total_input, instruction)
        else:
            system_prompt = f"You are a helpful assistant. Context: {context}\nQuestion: {question}\nAnswer concisely."
            prompt = f"<s>[INST] {system_prompt} [/INST]"
            return await self._generate_completion(prompt, max_tokens=1024)

    # ---------- Guide section generation with context expansion ----------
    async def expand_mermaid_to_description(self, mermaid_str: str) -> str:
        """Use LLM to turn a compressed Mermaid diagram back into a detailed text description."""
        prompt = f"""<s>[INST] The following Mermaid diagram represents a user's task. Convert it back into a clear, detailed, natural language description of the task. Include all key points, deliverables, and requirements. Output only the description, no extra text.

Mermaid diagram:
{mermaid_str}

Description: [/INST]"""
        description = await self._generate_completion(prompt, max_tokens=1024, temperature=0.4)
        return description

    async def generate_guide_section(self, section_type: str, context: str) -> str:
        logger.info(f"Generating section '{section_type}' with Mermaid pipeline")
        
        # If context looks like Mermaid (contains '-->' or 'flowchart'), expand it to text first
        if '-->' in context or 'flowchart' in context or 'graph' in context:
            logger.info("Context appears to be Mermaid – expanding to description")
            context = await self.expand_mermaid_to_description(context)
        
        # Strict prompt that forbids extra text
        if section_type.lower() == "flow":
            instruction = f"""Create a detailed Mermaid flowchart (using 'flowchart TD' syntax) for the '{section_type}' section of the guide.
The flowchart must represent the exact steps, decisions, and loops described in the user's task.
Use descriptive labels inside nodes (e.g., 'Review Instagram page', 'Check engagement metrics', 'Create 3 post concepts').
Output ONLY the Mermaid diagram inside ```mermaid``` blocks. No extra words before or after."""
        else:
            instruction = f"""Write the content for the '{section_type}' section of the guide.
The content must be **specific to the user's task** (see context). Use bullet points or short paragraphs.
Convert this content into a Mermaid diagram where each node represents a key point, and edges show relationships (e.g., 'causes', 'then', 'acts_on').
Use descriptive multi‑word labels (e.g., 'Instagram post layout' instead of just 'post').
Output ONLY the Mermaid diagram (no extra text) using lines like: "Subject -- verb:relation --> Object"
Example: "Instagram page -- review:acts_on --> engagement metrics"
Do not include any introductory sentences, explanations, or concluding remarks."""

        prompt = f"""<s>[INST] {instruction}

User's task:
{context}

Now produce ONLY the Mermaid diagram: [/INST]"""
        
        model_output = await self._generate_completion(prompt, max_tokens=2048, temperature=0.2)
        # Extract pure Mermaid
        mermaid_diagram = self._extract_mermaid(model_output)
        if not mermaid_diagram:
            logger.warning("No Mermaid extracted, using fallback")
            mermaid_diagram = "graph TD\nA[Start] --> B[Follow task instructions]"
        
        # Expand Mermaid back to natural language (rule‑based)
        expanded = expand_mermaid_to_text(mermaid_diagram)
        return expanded

    # ---------- Flow diagram (unchanged but uses extraction) ----------
    async def generate_flow_diagram(self, context: str) -> str:
        prompt = f"""[INST] You are an expert at creating Mermaid flowcharts for task guides.

STRICT RULES:
- Output ONLY a Mermaid diagram
- MUST be inside a markdown code block with ```mermaid
- Use "flowchart TD"
- No explanations, no extra text

Context:
{context}

Now generate the diagram. [/INST]"""
        response = await self._generate_completion(prompt, max_tokens=1024, temperature=0.2)
        response = response.strip()
        # Extract if there's extra text
        m = re.search(r'```mermaid\n(.*?)\n```', response, re.DOTALL)
        if m:
            return f"```mermaid\n{m.group(1)}\n```"
        if "flowchart" in response or "graph" in response:
            return f"```mermaid\n{response}\n```"
        return """```mermaid
flowchart TD
A[Start] --> B[Follow the steps above]
B --> C[Complete task]
C --> D[End]```"""

    async def compress_query(self, prompt: str) -> str:
        return compress_text_to_mermaid(prompt)

    def clean_question(self, question: str) -> str:
        prefixes = ['!bot', '!ai', '@bot', 'bot,', '!ai_search']
        if not question or not question.strip():
            return question
        question_lower = question.lower().strip()
        original_question = question.strip()
        for prefix in prefixes:
            if question_lower.startswith(prefix.lower()):
                cleaned = original_question[len(prefix):].lstrip(' ,!:@')
                return cleaned
        return original_question

# ---------- Global model and lifespan ----------
model = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        logger.info("Starting lifespan startup...")
        try:
            import spacy
            spacy.load("en_core_web_sm")
        except OSError:
            logger.info("Downloading spaCy model en_core_web_sm...")
            import spacy.cli
            spacy.cli.download("en_core_web_sm")
        start_total = time.time()
        model = MixtralFreeModel()
        await model.warm_up()
        total_time = time.time() - start_total
        logger.info(f"Model initialized and warmed up in {total_time:.2f}s")
    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        model = None
    yield
    model = None
    logger.info("Shutdown complete.")

# ---------- FastAPI app ----------
app = FastAPI(title="Mermaid-Powered AI API", version="3.1", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class ChatRequest(BaseModel):
    question: str
    context: str = ""

class ChatResponse(BaseModel):
    response: str

class GenerateSectionRequest(BaseModel):
    section_type: str
    compressed_context: str = None
    compress_input: bool = True

class GenerateSectionResponse(BaseModel):
    content: str

class CompressQueryRequest(BaseModel):
    prompt: str

class CompressQueryResponse(BaseModel):
    compressed: str

@app.get("/")
async def root():
    return {"message": "Mermaid-Powered AI API"}

@app.get("/queue-status")
async def get_queue_status():
    return queue_status.get_status()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    can_process, queue_position = await queue_status.acquire()
    if not can_process:
        raise HTTPException(status_code=429, detail=f"Queued, position {queue_position}")
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")
        cleaned_q = model.clean_question(request.question)
        response = await model.generate_response(cleaned_q, request.context)
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await queue_status.release()

@app.post("/generate-section", response_model=GenerateSectionResponse)
async def generate_section_endpoint(request: GenerateSectionRequest):
    can_process, queue_position = await queue_status.acquire()
    if not can_process:
        raise HTTPException(status_code=429, detail=f"Queued, position {queue_position}")
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")

        if request.section_type.lower() == "flow":
            context = request.compressed_context or ""
            diagram = await model.generate_flow_diagram(context)
            return GenerateSectionResponse(content=diagram)

        context = request.compressed_context or ""
        if not context:
            context = "No context provided."
        content = await model.generate_guide_section(request.section_type, context)
        return GenerateSectionResponse(content=content)
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await queue_status.release()

@app.post("/compress-query", response_model=CompressQueryResponse)
async def compress_query_endpoint(request: CompressQueryRequest):
    can_process, queue_position = await queue_status.acquire()
    if not can_process:
        raise HTTPException(status_code=429, detail=f"Queued, position {queue_position}")
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")
        compressed = await model.compress_query(request.prompt)
        return CompressQueryResponse(compressed=compressed)
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await queue_status.release()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")