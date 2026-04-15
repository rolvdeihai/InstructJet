# Read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
# you will also find guides on how best to write your Dockerfile

# FROM python:3.12.3

# RUN useradd -m -u 1000 user
# USER user
# ENV PATH="/home/user/.local/bin:$PATH"

# WORKDIR /app

# COPY --chown=user ./requirements.txt requirements.txt
# RUN pip install --no-cache-dir --upgrade -r requirements.txt
# RUN mkdir -p /app/models && \
#     wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
#          -O /app/models/llama-2-7b-chat.Q4_K_M.gguf

# COPY --chown=user . /app
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

FROM python:3.12

# --- System dependencies ---
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y build-essential cmake

# --- Non-root user ---
RUN useradd -m -u 1000 user
USER user
WORKDIR /app
ENV PATH="/home/user/.local/bin:$PATH"

# --- Copy wheel and requirements first ---
COPY --chown=user llama_cpp_python-0.3.20-py3-none-linux_x86_64.whl .
COPY --chown=user requirements.txt .

ENV CMAKE_ARGS="-DLLAMA_AVX2=on -DLLAMA_FMA=on -DLLAMA_OPENMP=on"


# --- Install dependencies ---
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir llama_cpp_python-0.3.20-py3-none-linux_x86_64.whl

# --- Download model ---
RUN mkdir -p /app/models && \
    wget --progress=bar:force \
         --retry-connrefused \
         --tries=5 \
         --timeout=30 \
         -O /app/models/Ministral-3-3B-Instruct-2512-Q4_K_M.gguf \
         https://huggingface.co/mistralai/Ministral-3-3B-Instruct-2512-GGUF/resolve/main/Ministral-3-3B-Instruct-2512-Q4_K_M.gguf

RUN ls -lh /app/models && \
    du -h /app/models/Ministral-3-3B-Instruct-2512-Q4_K_M.gguf
    
# --- Copy source code ---
COPY --chown=user . /app

# --- Expose & run ---
EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
