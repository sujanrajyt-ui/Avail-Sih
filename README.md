# AVAIL — Automatic Block Planning & Integrated Rescheduling Engine
### Smart India Hackathon 2026 | Problem Statement SIH26027 | Team Durga Ghee Podi Dosa

---

## 1. Executive Summary

In Indian Railways operations, Civil (track), OHE (electrification), and S&T (signalling) maintenance **blocks** are planned separately in silos. Only **~2.2%** of blocks are integrated, leaving **97.8%** isolated. This causes repeated corridor shutdowns, idle track machine time (~30–32%), and severe downstream asset failures (e.g. 400% locomotive failure surges cited in CAG audit reports).

**AVAIL** (Asset Visibility & Availability through Intelligent Logistics) solves this by:
1. **Intelligent Block Consolidation**: Merging overlapping/adjacent Civil, OHE, and S&T requests into unified **Integrated Corridor Blocks** using Union-Find spatial-temporal interval algorithms.
2. **Predictive Delay Penalization**: Coupling a `RandomForestRegressor` delay model to the constraint solver, dynamically scaling penalty weights for high-risk congestion segments.
3. **CP-SAT Constraint Optimization**: Utilizing Google OR-Tools CP-SAT solver to automatically reschedule train traffic conflict-free around block windows with **0 track collisions**.
4. **Interactive What-If UI & Web Routes**: Providing controllers with a live Gantt simulation sandbox, dynamic metrics dashboard, block submission form, and CSV report export.

---

## 2. Dynamic Live Metrics & Verification Benchmarks

All system KPIs are computed dynamically from actual corridor simulation runs (`/api/metrics`):

| Metric | Siloed Baseline | AVAIL Integrated | Impact / Improvement |
| :--- | :--- | :--- | :--- |
| **Maintenance Block Hours** | 20.0 hrs | 12.5 hrs | **37.5% Idle Block Time Saved** (7.5 hrs saved) |
| **Track Occupancy Conflicts** | 12 (unresolved) | 0 (collisions) | **100% Conflict Auto-Resolution (0 Collisions)** |
| **CP-SAT Solver Performance** | N/A | 0.128s | **Sub-Second Real-Time Solving** |
| **Network Punctuality** | 73.9% | 91.3% | **+17.4% Punctuality Boost** |
| **Machine Utilization** | ~68.0% | ~91.2% | **+23.2% Asset Availability** |

### High-Scale Stress-Test Proof (`benchmark.py`)
- **Corridor Scale**: 105 Trains (Vande Bharat, Rajdhani, Express, Superfast, Freight) across 8 main stations (1,447 km).
- **Maintenance Load**: 18 Siloed requests across Civil (Gold), OHE (Cyan), and S&T (Magenta).
- **Stress-Test Results**: **0 Collisions**, **100% Conflict-Free**, **Solve Time: 0.742s**.

---

## 3. System Architecture & Web UI Routes

```
[ Data Ingestion Layer ]
  - New Delhi - Howrah Trunk Route Digital Twin (1,447 km, double-track speed limits)
  - Synthetic Telemetry: 23-105 Trains + Weather/Congestion/Noise Variance
        │
        ▼
[ Predictive AI Engine ]  ──► RandomForestRegressor (R² = 0.942, MAE = 0.98m)
        │                     Computes predicted delay risk scores [0.0, 1.0] per segment
        ▼
[ Union-Find Merger ]     ──► Consolidated Integrated Corridor Blocks
        │                     (Civil=Gold, OHE=Cyan, S&T=Magenta)
        ▼
[ CP-SAT Constraint Solver]──► Reschedules train paths conflict-free around maintenance
        │                     (Dynamic penalty weights scaling with risk scores)
        ▼
[ Interactive UI Dashboard ]──► Streamlit Sandbox + Modern Web UI Routes
```

### Integrated Web UI Pages
- **Main Dashboard**: `http://localhost:8000/dashboard` (Live KPI Metrics, Corridor Map, Integrated Blocks List)
- **Gantt Chart View**: `http://localhost:8000/gantt` (Side-by-Side Siloed vs AVAIL Comparison, 24-hr Timeline Grid, Tooltips)
- **What-If Simulation**: `http://localhost:8000/simulation` (Interactive Sliders for Start Adj, Duration, Priority Weighting, Risk Badges)
- **Operations & Reports**: `http://localhost:8000/reports` (Block Request Form, PDF/CSV Export, Final Schedule Table)
- **Streamlit Interactive UI**: `http://localhost:8501`

---

## 4. How to Run the Prototype

### Quick Launch (Unified Launcher)
```bash
# 1. Install dependencies
pip install ortools fastapi uvicorn streamlit plotly pandas numpy scikit-learn networkx requests

# 2. Run unified launcher (starts FastAPI backend + Streamlit dashboard)
python run_avail.py
```

### Run Stress-Test Benchmark Directly
```bash
python benchmark.py
```

---

## 5. Safety & Compliance Architecture

- **Human-in-the-Loop Safeguard**: AVAIL works as a decision-support platform for Railway Controllers. Autonomous execution is restricted; every optimized schedule requires explicit controller sign-off.
- **Fail-Safe Fallback**: If CP-SAT fails to solve within 5.0 seconds under catastrophic disruption, the system falls back to default safety buffers.
- **Zero Collision Guarantee**: Hard disjunction constraints ($S_j \ge E_i$ or $S_i \ge E_j$) strictly prevent track occupancy overlap.
