"""
AVAIL — Unified System Launcher
Smart India Hackathon 2026 (SIH26027)

Runs:
  1. Synthetic data generator & ML model calibration.
  2. FastAPI REST backend + 4 dynamic HTML UI dashboards on http://127.0.0.1:8000.
  3. Auto-opens the main AI Dashboard in default browser.
"""

import subprocess
import time
import sys
import os
import webbrowser

def main():
    print("=" * 70)
    print(" 🚆 AVAIL Autonomous AI System Launcher — SIH26027")
    print("    Team Durga Ghee Podi Dosa | New Delhi - Howrah Main Line Corridor")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))

    # 1. Run seed data generation & calibration
    print("\n[1/2] Initializing Corridor Graph & Calibration Datasets...")
    subprocess.run([sys.executable, os.path.join(base_dir, "backend", "data_generator.py")], check=True)

    # 2. Open browser after short delay
    def open_browser():
        time.sleep(2.5)
        print("\n[+] Opening AVAIL AI Dashboard in web browser...")
        webbrowser.open("http://127.0.0.1:8000/")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    print("\n[2/2] Starting AVAIL AI Engine on http://127.0.0.1:8000 ...")
    print("=" * 70)
    print("  • AI Dashboard:        http://127.0.0.1:8000/")
    print("  • Corridor Gantt View: http://127.0.0.1:8000/gantt")
    print("  • What-If Simulation:  http://127.0.0.1:8000/simulation")
    print("  • Block Reports:       http://127.0.0.1:8000/reports")
    print("  • AI Decision Trail:   http://127.0.0.1:8000/api/ai-decision-trail")
    print("  • API Interactive Docs:http://127.0.0.1:8000/docs")
    print("=" * 70)
    print("\nPress Ctrl+C to stop the system.\n")

    # Launch uvicorn directly in foreground
    import uvicorn
    from backend.main import app
    uvicorn.run(app, host="127.0.0.1", port=8000)

if __name__ == "__main__":
    main()
