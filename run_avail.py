import subprocess
import time
import sys
import os

def main():
    print("=" * 70)
    print(" 🚆 AVAIL System Launcher — Smart India Hackathon 2026 (SIH26027)")
    print("    Team Durga Ghee Podi Dosa")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Run synthetic seed generator
    print("\n[1/3] Generating synthetic seed datasets for New Delhi - Howrah Corridor...")
    subprocess.run([sys.executable, os.path.join(base_dir, "backend", "data_generator.py")], check=True)

    # 2. Start FastAPI Backend in background
    print("\n[2/3] Starting FastAPI Backend REST Service (http://127.0.0.1:8000)...")
    backend_proc = subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000"])
    
    time.sleep(2)

    # 3. Start Streamlit Dashboard
    print("\n[3/3] Launching Streamlit Interactive What-If Dashboard (http://127.0.0.1:8501)...")
    frontend_proc = subprocess.Popen([sys.executable, "-m", "streamlit", "run", os.path.join(base_dir, "frontend", "app.py"), "--server.port", "8501"])

    print("\n" + "=" * 70)
    print(" SUCCESS! AVAIL System is running.")
    print("  - Streamlit Dashboard: http://localhost:8501")
    print("  - FastAPI API Docs:    http://127.0.0.1:8000/docs")
    print(" Press Ctrl+C to terminate both servers.")
    print("=" * 70)

    try:
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping services...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
