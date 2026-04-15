import os
import logging
import asyncio
import time
import traceback
import json                     # <-- add this
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware   # <-- add this
from pydantic import BaseModel
from llama_cpp import Llama
from contextlib import asynccontextmanager
from huggingface_hub import hf_hub_download

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------- CPU optimizations ----------
def optimize_for_cpu():
    """Apply CPU-specific optimizations (optional)."""
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
                return True, 0  # No queue position
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
        return {
            "active": self.active_tasks,
            "queued": len(self.pending_queue),
            "max_concurrent": self.max_concurrent
        }

queue_status = QueueStatus(max_concurrent=1)

# ---------- The model class with local GGUF model ----------
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
                n_ctx=4096,
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
        """Perform a short test inference to warm up the model."""
        logger.info("Warming up model with test inference...")
        start_time = time.time()
        try:
            await self._generate_completion("Hello", max_tokens=10, temperature=0.1)
            warm_up_time = time.time() - start_time
            logger.info(f"Model warm-up completed in {warm_up_time:.2f}s")
        except Exception as e:
            logger.warning(f"Model warm-up failed: {e}")

    async def _generate_completion(self, prompt: str, max_tokens: int = None, temperature: float = None) -> str:
        """Helper to run a blocking completion in a thread."""
        if max_tokens is None:
            max_tokens = self.max_tokens
        if temperature is None:
            temperature = 0.3

        def _blocking():
            start = time.time()
            response = self.llm.create_completion(
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                top_p=0.95,
                stop=[],
                echo=False,
                stream=False
            )
            elapsed = time.time() - start
            logger.debug(f"Blocking completion took {elapsed:.2f}s")
            return response['choices'][0]['text'].strip()

        return await asyncio.to_thread(_blocking)

    async def generate_response(self, question: str, context: str = "") -> str:
        """
        Generate a response using the local GGUF model.
        For guide creation requests, enforces a strict JSON output format.
        """
        # Check if the user is asking to create a guide
        is_guide_request = any(phrase in question.lower() for phrase in 
                            ["guide", "create a guide", "make a guide", "step by step", "tutorial"])

        if is_guide_request:
            system_prompt = f"""You are an assistant that creates structured guides.
        When asked to create a guide, you MUST respond with ONLY a valid JSON object.
        Do not include any additional text, explanations, markdown, or code fences.
        The JSON object must contain the keys "action" and "summary".

        Format:
        {{"action": "generate_guide", "summary": "Brief summary of the task"}}

        Conversation context:
        {context}

        Now produce the JSON object for the user's request:"""
        else:
            # Normal assistant prompt
            system_prompt = f"""You are a helpful, accurate, and context-aware assistant. Use the conversation history below to provide a relevant and useful answer to the question.

    IMPORTANT:
    - Answer in the same language as the question
    - Be concise but comprehensive
    - Use the conversation context when relevant
    - If the context doesn't contain relevant information, use your general knowledge

    Conversation history:
    {context}

    Provide a helpful response"""

        prompt = f"<s>[INST] {system_prompt}\n\nNow handle this user request: {question} [/INST]"

        try:
            response_text = await self._generate_completion(prompt, max_tokens=512)

            # For guide requests, extract and return only the JSON object
            if is_guide_request:
                import re
                # Match a JSON object containing "action": "generate_guide"
                match = re.search(r'\{[^{}]*"action"\s*:\s*"generate_guide"[^{}]*\}', response_text, re.DOTALL)
                if match:
                    return match.group(0)
                else:
                    # Fallback: return a default JSON (so frontend still works)
                    logger.warning("Model did not return valid JSON for guide request. Using fallback.")
                    return json.dumps({
                        "action": "generate_guide",
                        "summary": "Create a guide based on the conversation.",
                        "sections": ["Overview", "Prerequisites", "Step-by-Step Instructions", "Tools & Assets", "Flow"]
                    })
            return response_text

        except Exception as e:
            logger.error(f"Error in generation: {str(e)}")
            return "I apologize, but I'm having trouble responding right now."

    def clean_question(self, question: str) -> str:
        """Remove command prefixes from the question."""
        start = time.time()
        prefixes = ['!bot', '!ai', '@bot', 'bot,', '!ai_search']
        if not question or not question.strip():
            return question
        question_lower = question.lower().strip()
        original_question = question.strip()
        for prefix in prefixes:
            if question_lower.startswith(prefix.lower()):
                cleaned = original_question[len(prefix):].lstrip(' ,!:@')
                elapsed = time.time() - start
                logger.debug(f"Cleaned question in {elapsed:.4f}s: '{cleaned}'")
                return cleaned
        elapsed = time.time() - start
        logger.debug(f"No prefix to clean, took {elapsed:.4f}s")
        return original_question

    async def compress_input(self, text: str, max_tokens: int = 500) -> str:
        """Compress long input into a concise summary."""
        if len(text.split()) < max_tokens:
            logger.debug("Input already under token limit, skipping compression")
            return text
        logger.info(f"Compressing input of {len(text.split())} words...")
        start = time.time()
        prompt = f"<s>[INST] Summarize the following text into a concise, structured form (bullet points or key-value pairs) keeping all essential details. Use at most {max_tokens} tokens.\n\nText:\n{text}\n\nSummary: [/INST]"
        summary = await self._generate_completion(prompt, max_tokens=max_tokens, temperature=0.5)
        elapsed = time.time() - start
        logger.info(f"Compression completed in {elapsed:.2f}s")
        return summary

    async def generate_efficient_section(self, section_type: str, context: str, max_tokens: int = 300) -> str:
        """Generate a compressed, efficient language representation of a section."""
        logger.info(f"Generating efficient representation for section '{section_type}'...")
        start = time.time()
        system = f"You are an expert task guide writer. Generate content for the section \"{section_type}\" in an efficient language format.\nUse a structured format like:\n- Key point 1: details\n- Key point 2: details\nOr use JSON if appropriate. Keep it concise and use at most {max_tokens} tokens."
        prompt = f"<s>[INST] {system}\n\nContext: {context}\nGenerate the efficient language for {section_type} section. [/INST]"
        efficient = await self._generate_completion(prompt, max_tokens=max_tokens)
        elapsed = time.time() - start
        logger.info(f"Efficient section generation took {elapsed:.2f}s")
        return efficient

    async def expand_efficient_to_natural(self, efficient_text: str, section_type: str, max_tokens: int = 300) -> str:
        """Expand efficient language into detailed natural language."""
        logger.info(f"Expanding efficient language to natural text for section '{section_type}'...")
        start = time.time()
        system = f"""You are an expert task guide writer. 
        Expand the efficient language into a **short but helpful** section titled "{section_type}".

        STRICT RULES:
        - Maximum 120 words total.
        - Use markdown subheadings (###) and bullet points.
        - No long paragraphs – break into 3-5 bullet points or short phrases.
        - Skip introductions, conclusions, and fluff.
        - Keep the tone professional and clear.

        Efficient language:
        {efficient_text}

        Write the {section_type} section now:"""
        prompt = f"<s>[INST] {system}\n\nEfficient language:\n{efficient_text}\n\nWrite the full {section_type} section now. [/INST]"
        expanded = await self._generate_completion(prompt, max_tokens=max_tokens)
        elapsed = time.time() - start
        logger.info(f"Expansion took {elapsed:.2f}s")
        return expanded
    
    async def generate_flow_diagram(self, context: str) -> str:
        """Generate a Mermaid flowchart for the Flow section."""

        prompt = f"""[INST] You are an expert at creating Mermaid flowcharts for task guides.

        STRICT RULES:
        - Output ONLY a Mermaid diagram
        - MUST be inside a markdown code block with ```mermaid
        - Use "flowchart TD"
        - No explanations, no extra text

        Context:
        {context}

        Example format:
        ```mermaid
        flowchart TD
        A[Start] --> B[Step 1]
        B --> C{{Decision}}
        C -->|Yes| D[Step 2]
        C -->|No| E[Step 3]
        D --> F[End]
        E --> F

        Now generate the diagram. [/INST]"""

        try:
            response = await self._generate_completion(
                prompt,
                max_tokens=512,
                temperature=0.2
            )

            response = response.strip()

            # ✅ Case 1: Model already returns proper block
            if response.startswith("```mermaid") and response.endswith("```"):
                return response

            # ✅ Case 2: Model returns raw flowchart without code block
            if "flowchart" in response or "graph" in response:
                return f"```mermaid\n{response}\n```"

            # ❌ Case 3: Model output is garbage → fallback
            logger.warning("Invalid Mermaid output, using fallback diagram.")

            return """```mermaid

        flowchart TD
        A[Start] --> B[Follow the steps above]
        B --> C[Complete task]
        C --> D[End]"""


        except Exception as e:
            logger.error(f"Flow diagram generation failed: {e}")

            # ❌ Hard fallback (error case)
            return """```mermaid
            flowchart TD
            A[Start] --> B[Error generating diagram]
            B --> C[Try again]
            C --> D[End]
            ```"""

    async def generate_section(self, section_type: str, context: str, compress_input: bool = True) -> str:
        """Generate a detailed section using compress -> efficient -> expand pipeline."""
        total_start = time.time()
        # Special handling for Flow section
        if section_type.lower() == "flow":
            return await self.generate_flow_diagram(context)
        logger.info(f"Starting section generation for '{section_type}' (compress_input={compress_input})")
        # Step 1: compress input if needed
        if compress_input and len(context.split()) > 1500:
            logger.info("Input context large, compressing...")
            context = await self.compress_input(context, max_tokens=1000)
        else:
            logger.info(f"Input context size OK: {len(context.split())} words")
        
        # Step 2: generate efficient language
        efficient = await self.generate_efficient_section(section_type, context)
        
        # Step 3: expand to natural language
        expanded = await self.expand_efficient_to_natural(efficient, section_type)
        
        total_time = time.time() - total_start
        logger.info(f"Total section generation time: {total_time:.2f}s")
        return expanded

# ---------- Global model variable ----------
model = None

# ---------- Lifespan context manager ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        logger.info("Starting lifespan startup...")
        start_total = time.time()
        model = MixtralFreeModel()
        await model.warm_up()
        total_time = time.time() - start_total
        logger.info(f"Model initialized and warmed up successfully in {total_time:.2f}s")
    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        model = None
    yield
    # Shutdown
    logger.info("Shutting down, releasing model resources.")
    model = None
    logger.info("Shutdown complete.")

# ---------- FastAPI app ----------
app = FastAPI(
    title="Free AI Response API",
    description="Uses local GGUF model with queue management",
    version="1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],          # Allows all methods, including OPTIONS
    allow_headers=["*"],
)

# Request/Response models
class ChatRequest(BaseModel):
    question: str
    context: str = ""

class ChatResponse(BaseModel):
    response: str

class GenerateSectionRequest(BaseModel):
    section_type: str
    context: str
    compress_input: bool = True

class GenerateSectionResponse(BaseModel):
    content: str

# ---------- Endpoints ----------
@app.get("/")
async def root():
    return {"message": "Free AI Response API is running (local GGUF model). Use POST /chat or POST /generate-section."}

@app.get("/queue-status")
async def get_queue_status():
    """Return current queue status for load balancing."""
    return queue_status.get_status()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    queue_start = time.time()
    can_process, queue_position = await queue_status.acquire()
    queue_wait = time.time() - queue_start

    if not can_process:
        logger.info(f"Request queued at position {queue_position} (queue wait {queue_wait:.3f}s)")
        return {
            "status": "queued",
            "queue_position": queue_position,
            "message": f"Request queued at position {queue_position}"
        }

    logger.info(f"Request started processing after queue wait {queue_wait:.3f}s")
    req_start = time.time()
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")
        
        clean_start = time.time()
        cleaned_question = model.clean_question(request.question)
        clean_time = time.time() - clean_start
        logger.info(f"Cleaned question in {clean_time:.4f}s")
        
        response_text = await model.generate_response(cleaned_question, request.context)
        
        total_time = time.time() - req_start
        logger.info(f"Chat request completed in {total_time:.2f}s (including queue wait {queue_wait:.3f}s)")
        return ChatResponse(response=response_text)
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        await queue_status.release()

@app.post("/generate-section", response_model=GenerateSectionResponse)
async def generate_section(request: GenerateSectionRequest):
    queue_start = time.time()
    can_process, queue_position = await queue_status.acquire()
    queue_wait = time.time() - queue_start

    if not can_process:
        logger.info(f"Request queued at position {queue_position} (queue wait {queue_wait:.3f}s)")
        return {
            "status": "queued",
            "queue_position": queue_position,
            "message": f"Request queued at position {queue_position}"
        }

    logger.info(f"Section generation started after queue wait {queue_wait:.3f}s")
    req_start = time.time()
    try:
        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")
        
        content = await model.generate_section(
            request.section_type, request.context, request.compress_input
        )
        
        total_time = time.time() - req_start
        logger.info(f"Generate-section request completed in {total_time:.2f}s (queue wait {queue_wait:.3f}s)")
        return GenerateSectionResponse(content=content)
    except Exception as e:
        logger.error(f"Error generating section: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        await queue_status.release()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")