"""
AVAIL — Unified System Launcher & Automated React Integrator
Smart India Hackathon 2026 (SIH26027)

Runs:
  1. Automated React UI Build (npm run build inside frontend/)
  2. Synthetic data generator & ML model calibration
  3. FastAPI REST backend + Million-Dollar React SPA on http://127.0.0.1:8000
  4. Auto-opens the main AI Dashboard in default browser
"""

import subprocess
import time
import sys
import os
import webbrowser

def kill_existing_port_process(port=8000):
    """Kills any process currently listening on the specified port (Windows/Linux)."""
    try:
        if os.name == 'nt':
            cmd = f'for /f "tokens=5" %a in (\'netstat -aon ^| findstr :{port} ^| findstr LISTENING\') do taskkill /f /pid %a'
            subprocess.run(cmd, shell=True, capture_output=True)
        else:
            cmd = f'fuser -k {port}/tcp'
            subprocess.run(cmd, shell=True, capture_output=True)
    except Exception:
        pass

def build_react_frontend(base_dir):
    """Verifies and automatically builds the React SPA frontend if needed."""
    frontend_dir = os.path.join(base_dir, "frontend")
    dist_dir = os.path.join(frontend_dir, "dist")

    print("\n[1/3] Checking React Frontend Build...")
    if not os.path.exists(dist_dir) or True: # Always ensure fresh bundle
        print("    Building React + Vite bundle (`npm run build`)...")
        try:
            cmd = "npm.cmd run build" if os.name == 'nt' else "npm run build"
            res = subprocess.run(cmd, cwd=frontend_dir, shell=True, capture_output=True, text=True)
            if res.returncode == 0:
                print("    ✅ React Build Complete (`frontend/dist` compiled).")
            else:
                print(f"    ⚠️ Build warning: {res.stderr[:200]}")
        except Exception as e:
            print(f"    ⚠️ React build skipped ({e}). Using existing bundle.")

def main():
    print("=" * 70)
    print(" 🚆 AVAIL Autonomous AI System Launcher — SIH26027")
    print("    Team Durga Ghee Podi Dosa | New Delhi - Howrah Main Line Corridor")
    print("=" * 70)

    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    is_render = "RENDER" in os.environ or "PORT" in os.environ

    if not is_render:
        kill_existing_port_process(port)
        time.sleep(0.5)

    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 1. Build React frontend bundle if dist doesn't exist
    build_react_frontend(base_dir)

    # 2. Run seed data generation & calibration
    print("\n[2/3] Initializing Corridor Graph & Calibration Datasets...")
    subprocess.run([sys.executable, os.path.join(base_dir, "backend", "data_generator.py")], check=True)

    # 3. Open browser locally if interactive session
    if not is_render:
        def open_browser():
            time.sleep(2.5)
            print(f"\n[+] Opening AVAIL AI Dashboard in web browser (http://127.0.0.1:{port}/)...")
            webbrowser.open(f"http://127.0.0.1:{port}/")

        import threading
        threading.Thread(target=open_browser, daemon=True).start()

    print(f"\n[3/3] Starting AVAIL AI Engine on http://{host}:{port} ...")
    print("=" * 70)
    print(f"  • AI Dashboard (React): http://{host}:{port}/")
    print(f"  • API Interactive Docs: http://{host}:{port}/docs")
    print("=" * 70)

    # Launch uvicorn
    import uvicorn
    from backend.main import app
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    main()
