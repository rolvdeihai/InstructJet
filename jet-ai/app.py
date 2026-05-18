import os
import logging
import asyncio
import time
import traceback
import json
import re
import uuid
from concurrent.futures import ThreadPoolExecutor
from typing import Set, List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from llama_cpp import Llama
from contextlib import asynccontextmanager
from huggingface_hub import hf_hub_download
from sentence_transformers import SentenceTransformer, util
import tiktoken

# ---------- Logging ----------
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

# ---------- Token counting ----------
try:
    encoding = tiktoken.get_encoding("cl100k_base")
    logger.debug("Token counter initialized")
except:
    encoding = None
    logger.warning("tiktoken not available, using fallback token counting")

def count_tokens(text: str) -> int:
    if encoding:
        return len(encoding.encode(text))
    else:
        return len(text.split())

# ---------- Fast summarization using LexRank (same as before) ----------
def smart_summarize_text(text: str, target_tokens: int = 800) -> str:
    original_tokens = count_tokens(text)
    if original_tokens <= target_tokens:
        return text

    target_sentences = max(2, min(20, int(target_tokens / 25)))
    try:
        # Ensure NLTK punkt is available
        import nltk
        try:
            nltk.data.find('tokenizers/punkt')
        except LookupError:
            nltk.download('punkt')
        from sumy.parsers.plaintext import PlaintextParser
        from sumy.nlp.tokenizers import Tokenizer
        from sumy.summarizers.lex_rank import LexRankSummarizer
        parser = PlaintextParser.from_string(text, Tokenizer("english"))
        summarizer = LexRankSummarizer()
        summary_sentences = summarizer(parser.document, target_sentences)
        summary = ' '.join(str(sentence) for sentence in summary_sentences)
        if count_tokens(summary) > target_tokens:
            words = summary.split()
            target_words = int(target_tokens * 1.3)
            summary = ' '.join(words[:target_words])
        return summary.strip() if summary else text[:int(target_tokens * 4)]
    except Exception as e:
        logger.error(f"LexRank summarization error: {e}")
        words = text.split()
        target_words = int(target_tokens * 1.3)
        return ' '.join(words[:target_words])

# ---------- Load skeletons and templates ----------
SKELETONS_PATH = "skeletons.json"
TEMPLATES_DIR = "templates_by_section"

def load_skeletons() -> List[Dict[str, Any]]:
    with open(SKELETONS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def load_all_templates() -> Dict[str, List[Dict[str, Any]]]:
    """Load all JSON files from TEMPLATES_DIR, keyed by section name.
       Converts 'templates_acknowledgement.json' -> 'acknowledgment' (removing 'templates_' and '.json').
    """
    templates = {}
    if not os.path.exists(TEMPLATES_DIR):
        logger.warning(f"Templates directory {TEMPLATES_DIR} not found")
        return templates
    for filename in os.listdir(TEMPLATES_DIR):
        if not filename.endswith(".json"):
            continue
        # Extract section name: e.g., 'templates_acknowledgement.json' -> 'acknowledgement'
        section = filename.replace("templates_", "").replace(".json", "")
        filepath = os.path.join(TEMPLATES_DIR, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    templates[section] = data
                else:
                    logger.warning(f"File {filename} does not contain a list, skipping")
        except Exception as e:
            logger.error(f"Error loading {filename}: {e}")
    logger.info(f"Loaded templates for sections: {list(templates.keys())}")
    return templates

SKELETONS = load_skeletons()
SECTION_TEMPLATES = load_all_templates()

# ---------- Embedder for skeleton selection ----------
embedder = SentenceTransformer('all-MiniLM-L6-v2')

def select_best_skeleton(user_query: str, context: str = "") -> Dict[str, Any]:
    """Return the skeleton dict with highest similarity to the user input."""
    full_input = f"{context}\n{user_query}".strip()
    start_time = time.time()
    query_emb = embedder.encode(full_input, convert_to_tensor=True)
    descriptions = [s["description"] for s in SKELETONS]
    desc_embs = embedder.encode(descriptions, convert_to_tensor=True)
    scores = util.cos_sim(query_emb, desc_embs)[0]
    best_idx = scores.argmax().item()
    best_skeleton = SKELETONS[best_idx]   
    # ---------- ADD the following lines ----------
    elapsed = time.time() - start_time
    logger.info(f"Skeleton selection took {elapsed:.3f}s")
    logger.info(f"Selected skeleton: {best_skeleton['id']} (score: {scores[best_idx].item():.3f}) - {best_skeleton['description']}")
    return SKELETONS[best_idx]

# ---------- Queue management (same as merged version) ----------
class QueueStatus:
    def __init__(self, max_concurrent: int = 1):
        self.max_concurrent = max_concurrent
        self.active_tasks = 0
        self.pending_queue = []          # list of (future, request_id)
        self._lock = asyncio.Lock()

    async def wait_and_acquire(self, request_id: str) -> int:
        async with self._lock:
            if self.active_tasks < self.max_concurrent:
                self.active_tasks += 1
                return 0
            else:
                position = len(self.pending_queue) + 1
                future = asyncio.Future()
                self.pending_queue.append((future, request_id))
        try:
            await future
        except asyncio.CancelledError:
            async with self._lock:
                for i, (f, rid) in enumerate(self.pending_queue):
                    if rid == request_id:
                        self.pending_queue.pop(i)
                        break
            raise
        async with self._lock:
            self.active_tasks += 1
            for i, (f, rid) in enumerate(self.pending_queue):
                if rid == request_id:
                    self.pending_queue.pop(i)
                    break
            return position

    async def release(self):
        async with self._lock:
            self.active_tasks -= 1
            if self.pending_queue:
                future, _ = self.pending_queue[0]
                if not future.done():
                    future.set_result(True)

    async def cancel_queued_request(self, request_id: str) -> bool:
        async with self._lock:
            for i, (future, rid) in enumerate(self.pending_queue):
                if rid == request_id:
                    self.pending_queue.pop(i)
                    if not future.done():
                        future.cancel()
                    return True
        return False

    def get_status(self):
        return {
            "active": self.active_tasks,
            "queued": len(self.pending_queue),
            "max_concurrent": self.max_concurrent
        }

queue_status = QueueStatus(max_concurrent=1)

# ---------- Global executor and active requests ----------
executor = ThreadPoolExecutor(max_workers=1)
active_request_ids: Set[str] = set()

# ---------- Global model variable ----------
model = None

# ---------- Model class (unchanged from merged version) ----------
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
        logger.info("Warming up model with test inference...")
        start_time = time.time()
        try:
            await self._generate_completion("Hello", max_tokens=10, temperature=0.1)
            warm_up_time = time.time() - start_time
            logger.info(f"Model warm-up completed in {warm_up_time:.2f}s")
        except Exception as e:
            logger.warning(f"Model warm-up failed: {e}")

    async def _generate_completion(self, prompt: str, max_tokens: int = None, temperature: float = None, request_id: str = "") -> str:
        if request_id and request_id not in active_request_ids:
            return "CANCELLED"

        if max_tokens is None:
            max_tokens = self.max_tokens
        if temperature is None:
            temperature = 0.3

        # Log prompt length (approx tokens) before call
        prompt_tokens = len(prompt.split()) * 0.75   # rough estimate
        logger.info(f"LLM call: request_id={request_id[:8]}... max_tokens={max_tokens}, temp={temperature}, prompt_len≈{int(prompt_tokens)}")

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
            # Log the actual completion tokens used
            usage = response.get('usage', {})
            completion_tokens = usage.get('completion_tokens', 0)
            total_tokens = usage.get('total_tokens', 0)
            logger.info(f"LLM completion finished in {elapsed:.3f}s → {completion_tokens} generated tokens (total {total_tokens})")
            return response['choices'][0]['text'].strip()

        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(executor, _blocking)
    
    async def generate_response(self, question: str, context: str = "", request_id: str = "") -> str:
        # Always treat as guide request when this method is called
        system_prompt = f"""You are an assistant that creates structured guides.
    When asked to create a guide, respond ONLY with a valid JSON object.
    Do not include any additional text, explanations, markdown, or code fences.
    The JSON object must contain the keys "action" and "summary".

    Format:
    {{"action": "generate_guide", "summary": "Brief summary of the task"}}

    Conversation context:
    {context}

    Now produce the JSON object for the user's request: {question}"""

        # Wrap with instruction tags (required for Mixtral)
        prompt = f"<s>[INST] {system_prompt} [/INST]"

        response_text = await self._generate_completion(prompt, max_tokens=150, temperature=0.2, request_id=request_id)
        if response_text == "CANCELLED":
            return "CANCELLED"

        # Try to extract JSON – fallback to a default structure
        import re
        match = re.search(r'\{[^{}]*"action"\s*:\s*"generate_guide"[^{}]*\}', response_text, re.DOTALL)
        if match:
            return match.group(0)
        else:
            logger.warning("Model did not return valid JSON for guide request. Using fallback.")
            return json.dumps({
                "action": "generate_guide",
                "summary": "Create a guide based on the conversation.",
                "sections": ["Overview", "Prerequisites", "Step-by-Step Instructions", "Tools & Assets", "Flow"]
            })

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

    async def generate_flow_diagram(self, context: str) -> str:
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
            response = await self._generate_completion(prompt, max_tokens=512, temperature=0.2)
            response = response.strip()
            if response.startswith("```mermaid") and response.endswith("```"):
                return response
            if "flowchart" in response or "graph" in response:
                return f"```mermaid\n{response}\n```"
            logger.warning("Invalid Mermaid output, using fallback diagram.")
            return """```mermaid
        flowchart TD
        A[Start] --> B[Follow the steps above]
        B --> C[Complete task]
        C --> D[End]"""
        except Exception as e:
            logger.error(f"Flow diagram generation failed: {e}")
            return """```mermaid
            flowchart TD
            A[Start] --> B[Error generating diagram]
            B --> C[Try again]
            C --> D[End]
            ```"""

# ---------- Template filling function ----------
async def fill_template(section_name: str, template_obj: Dict[str, Any],
                        user_query: str, context: str, request_id: str) -> str:
    """
    Given a template object like {"text": "Start by {action}.", "placeholders": ["action"], ...}
    use the LLM to replace placeholders with concrete values from the conversation.
    """
    template_text = template_obj["text"]
    
    start_time = time.time()
    
    # If no placeholders, just return the template
    if not template_obj.get("placeholders"):
        return template_text

    # Ask the model to fill the template directly (few-shot)
    prompt = f"""You are a helpful assistant that fills placeholders in sentence templates.

Given the template and the conversation, replace every {{placeholder}} with a concrete, natural value.
Return ONLY the filled sentence, nothing else.

Template: {template_text}

Conversation context:
{context}

User query: {user_query}

Filled sentence:"""

    filled = await model._generate_completion(prompt, max_tokens=150, temperature=0.3, request_id=request_id)
    if filled == "CANCELLED":
        return "CANCELLED"
    # Sanity: if the model failed to replace placeholders, fallback to removing braces
    if re.search(r'\{[^}]+\}', filled):
        # Still has placeholders – try to fill with a simpler method
        # Extract placeholders and ask for values as JSON
        placeholders = template_obj["placeholders"]
        json_prompt = f"""Extract values for the placeholders: {placeholders}
Context: {context}
User: {user_query}

Return ONLY a JSON object, e.g.: {{"action": "install", "user": "you"}}
JSON:"""
        json_response = await model._generate_completion(json_prompt, max_tokens=150, temperature=0.2, request_id=request_id)
        try:
            values = json.loads(json_response)
        except:
            values = {p: f"[{p}]" for p in placeholders}
        try:
            filled = template_text.format(**values)
        except:
            # Last resort: remove braces
            filled = re.sub(r'\{[^}]+\}', '___', template_text)
            
        # At the end, before returning:
        elapsed = time.time() - start_time
        logger.info(f"Template filling for '{section_name}' took {elapsed:.3f}s → result: {filled[:80]}...")
    return filled.strip()

# ---------- Skeleton-based answer generation ----------
async def generate_structured_answer(user_query: str, context: str, request_id: str) -> str:
    skeleton = select_best_skeleton(user_query, context)
    sections = skeleton["sections"]
    logger.info(f"Selected skeleton '{skeleton['id']}' with sections {sections}")

    # Build list of templates (or fallback)
    sections_info = []
    for section in sections:
        templates = SECTION_TEMPLATES.get(section, [])
        if templates:
            chosen = templates[0]
            sections_info.append({"section": section, "template": chosen["text"]})
        else:
            sections_info.append({"section": section, "template": None})

    # Build the instruction with proper model tags
    instruction = f"""You are a helpful assistant that fills placeholders in sentence templates.

Conversation context:
{context}

User query: {user_query}

For each of the following sections, fill the template's placeholders ({{...}}) with concrete, natural values based on the conversation.
Return ONLY a valid JSON object where keys are section names and values are strings (the completed sentence).

Sections:
{json.dumps(sections_info, indent=2)}

Example format for sections {sections}:
{json.dumps({s: f"Example filled content for {s}" for s in sections}, indent=2)}

Now produce the JSON object:"""

    # Wrap with model instruction tags
    prompt = f"<s>[INST] {instruction} [/INST]"
    
    response = await model._generate_completion(prompt, max_tokens=600, temperature=0.3, request_id=request_id)
    if response == "CANCELLED":
        return "CANCELLED"

    if not response or not response.strip():
        logger.error("Model returned empty response")
        return "I'm sorry, I couldn't generate a response at this time. Please try again."

    # Extract JSON from response
    try:
        start = response.find('{')
        end = response.rfind('}') + 1
        if start != -1 and end > start:
            json_str = response[start:end]
            filled = json.loads(json_str)
            logger.debug(f"Parsed JSON: {json.dumps(filled, indent=2)}")
        else:
            raise ValueError("No JSON object found")
    except Exception as e:
        logger.error(f"Failed to parse JSON response: {e}\nRaw response: {response[:500]}")
        return response  # fallback raw

    # Reconstruct the final answer in section order, ensuring we have strings
    ordered_texts = []
    for section in sections:
        value = filled.get(section)
        if value is None:
            ordered_texts.append(f"[Missing section: {section}]")
        elif isinstance(value, str):
            ordered_texts.append(value)
        elif isinstance(value, list):
            # If it's a list, join with newline
            ordered_texts.append("\n".join(str(item) for item in value))
        else:
            # Convert any other type to string
            ordered_texts.append(str(value))

    return "\n\n".join(ordered_texts)

# ---------- Lifespan ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        logger.info("Starting lifespan startup...")
        start_total = time.time()
        model = MixtralFreeModel()
        await model.warm_up()
        total_time = time.time() - start_total
        logger.info(f"Model initialized successfully in {total_time:.2f}s")
    except Exception as e:
        logger.error(f"Failed to initialize model: {e}")
        model = None
    yield
    logger.info("Shutting down...")
    model = None
    executor.shutdown(wait=False)

# ---------- FastAPI app ----------
app = FastAPI(title="Structured AI API", description="Uses skeletons and templates to generate responses", version="3.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class ChatRequest(BaseModel):
    question: str
    context: str = ""
    request_id: str = ""

class ChatResponse(BaseModel):
    response: str
    queue_position: int = 0

class GenerateSectionRequest(BaseModel):
    section_type: str
    context: str = ""
    compress_input: bool = True

class GenerateSectionResponse(BaseModel):
    content: str

class CompressQueryRequest(BaseModel):
    prompt: str

class CompressQueryResponse(BaseModel):
    compressed: str

class CancelRequest(BaseModel):
    request_id: str

@app.get("/")
async def root():
    return {"message": "Structured AI API running. Use POST /chat, /generate-section, /compress-query, /cancel"}

@app.get("/queue-status")
async def get_queue_status():
    return queue_status.get_status()

@app.post("/cancel")
async def cancel_request(cancel: CancelRequest):
    if await queue_status.cancel_queued_request(cancel.request_id):
        active_request_ids.discard(cancel.request_id)
        return {"status": "cancelled (queued)"}
    if cancel.request_id in active_request_ids:
        active_request_ids.remove(cancel.request_id)
        return {"status": "cancelled (active)"}
    return {"status": "not_found"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    overall_start = time.time()
    request_id = request.request_id or str(uuid.uuid4())
    active_request_ids.add(request_id)

    try:
        queue_position = await queue_status.wait_and_acquire(request_id)
    except asyncio.CancelledError:
        active_request_ids.discard(request_id)
        return ChatResponse(response="Cancelled (was in queue).", queue_position=0)

    try:
        if request_id not in active_request_ids:
            return ChatResponse(response="CANCELLED", queue_position=queue_position)

        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")

        cleaned_question = model.clean_question(request.question)
        logger.info(f"Request {request_id[:8]}: cleaned question = '{cleaned_question[:100]}...'")

        # -----------------------------------------------------------------
        # 1. Prepare context (summarize if too long)
        # -----------------------------------------------------------------
        context_to_use = request.context
        if request.context and count_tokens(request.context) > 2000:
            logger.info(f"Request {request_id[:8]}: context has {count_tokens(request.context)} tokens, summarizing...")
            summarization_start = time.time()
            context_to_use = smart_summarize_text(request.context, target_tokens=min(int(count_tokens(request.context) / 4), 1200))
            logger.info(f"Summarization took {time.time()-summarization_start:.3f}s, new token count: {count_tokens(context_to_use)}")

        # -----------------------------------------------------------------
        # 2. Detect if this is a guide request (@guide or keywords)
        # -----------------------------------------------------------------
        cleaned_lower = cleaned_question.lower()
        is_guide_request = (
            cleaned_question.startswith("@guide") or
            any(phrase in cleaned_lower for phrase in ["guide", "create a guide", "make a guide", "step by step", "tutorial"])
        )

        # -----------------------------------------------------------------
        # 3. Generate response using the appropriate method
        # -----------------------------------------------------------------
        if is_guide_request:
            response_text = await model.generate_response(cleaned_question, context_to_use, request_id)
        else:
            response_text = await generate_structured_answer(cleaned_question, context_to_use, request_id)

        if response_text == "CANCELLED":
            return ChatResponse(response="Generation cancelled.", queue_position=queue_position)

        total_time = time.time() - overall_start
        logger.info(f"Request {request_id[:8]} completed in {total_time:.3f}s (queue wait {queue_position})")
        return ChatResponse(response=response_text, queue_position=queue_position)

    except Exception as e:
        logger.error(f"Error processing request: {e}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        await queue_status.release()
        active_request_ids.discard(request_id)
        
# ---------- The other endpoints (unchanged except minor fixes) ----------
@app.post("/generate-section", response_model=GenerateSectionResponse)
async def generate_section_endpoint(request: GenerateSectionRequest):
    request_id = "section_" + str(uuid.uuid4())
    active_request_ids.add(request_id)
    try:
        queue_position = await queue_status.wait_and_acquire(request_id)
        if request_id not in active_request_ids:
            return GenerateSectionResponse(content="CANCELLED")
        if model is None:
            raise HTTPException(status_code=503, detail="Model not available")
        if request.section_type.lower() == "flow":
            diagram = await model.generate_flow_diagram(request.context)
            return GenerateSectionResponse(content=diagram)
        
        ctx = request.context
        if request.compress_input and count_tokens(ctx) > 1500:
            ctx = smart_summarize_text(ctx, target_tokens=1000)
        
        # CRITICAL: Force the model to use the context, not templates
        prompt = f"""<s>[INST] You are helping create a guide. The user wants a guide about:

{ctx}

Now write ONLY the "{request.section_type}" section of that guide. 
- Write real, specific content based on the user's request above.
- Do NOT use placeholders like [topic], [action], or [something].
- Do NOT add extra text like "Here is the section".
- Use markdown for formatting (headings, bullet points, etc.).
- Keep it under 300 words.

{request.section_type}: [/INST]"""

        generated = await model._generate_completion(prompt, max_tokens=400, temperature=0.4, request_id=request_id)
        if generated == "CANCELLED":
            return GenerateSectionResponse(content="Cancelled")
        return GenerateSectionResponse(content=generated.strip())
    except asyncio.CancelledError:
        return GenerateSectionResponse(content="Stopped.")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await queue_status.release()
        active_request_ids.discard(request_id)
        
@app.post("/compress-query", response_model=CompressQueryResponse)
async def compress_query_endpoint(request: CompressQueryRequest):
    request_id = "compress_" + str(uuid.uuid4())
    active_request_ids.add(request_id)
    try:
        queue_position = await queue_status.wait_and_acquire(request_id)
        if request_id not in active_request_ids:
            return CompressQueryResponse(compressed="CANCELLED")
        compressed = smart_summarize_text(request.prompt, target_tokens=300)
        return CompressQueryResponse(compressed=compressed)
    except asyncio.CancelledError:
        return CompressQueryResponse(compressed="")
    except Exception as e:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        await queue_status.release()
        active_request_ids.discard(request_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")