import os
import threading
import uvicorn
import time
from pyngrok import ngrok

def run_app():
    # Run your existing FastAPI app
    uvicorn.run("app:app", host="0.0.0.0", port=8000, log_level="info")

def main():
    # Set ngrok auth token from environment
    auth_token = os.environ.get("NGROK_AUTH_TOKEN")
    if not auth_token:
        raise ValueError("NGROK_AUTH_TOKEN environment variable not set")
    ngrok.set_auth_token(auth_token)

    # Start FastAPI in background thread
    server_thread = threading.Thread(target=run_app, daemon=True)
    server_thread.start()

    # Wait for server to be ready
    time.sleep(8)

    # Kill any existing tunnels and create a new one with your reserved domain
    ngrok.kill()
    public_url = ngrok.connect(8000, hostname="arturo-nonclarified-chivalrously.ngrok-free.dev")
    print(f"\n✅ Server is live at: {public_url}\n")

    # Keep the runner alive (GitHub Actions will stop after timeout)
    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        print("Shutting down...")
        ngrok.kill()

if __name__ == "__main__":
    main()