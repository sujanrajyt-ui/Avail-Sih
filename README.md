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
| **Idle Block Reduction** | raw siloed windows | merged into unified blocks | **33.3%** (e.g. 11.5 corridor-hours saved on CNB-PRYJ) |
| **Raw Track Overlap (baseline)** | 44 overlapping occupancies / 1469 min on CNB-PRYJ alone | 0 collisions | **100% Conflict Auto-Resolution (0 Collisions)** |
| **CP-SAT Solver Performance** | N/A | ~6s (42-train corridor, capacity-2 model) | **Real-time feasible solve** |
| **Total Managed System Delay** | N/A | ~9,200 min (avg ~405 min/train, worst freight +32h) | Honest physical stacking under capacity-2 tracks |
| **Capacity Utilization** | N/A | ~91% | Tracks kept clear of blocks |

> **Honest framing**: AVAIL *guarantees safety (0 collisions)* and *consolidates maintenance windows*; it is a decision-support platform, not a punctuality booster. With fixed running times and 2-track capacity, residual delays reflect genuine corridor congestion and are reported as-is — never faked.

### High-Scale Stress-Test Proof (`benchmark.py`)
- **Corridor Scale**: 75 Trains (Vande Bharat, Rajdhani, Express, Superfast, Freight) across 8 main stations (1,447 km) — the empirically verified **maximum that remains feasible** under the capacity-2 model (76–105 trains are genuinely infeasible with fixed running times).
- **Maintenance Load**: 18 Siloed requests across Civil (Gold), OHE (Cyan), and S&T (Magenta) merged into 7 unified corridor blocks (31.25 h recovered, 51.2% idle-block reduction).
- **Stress-Test Results**: **0 Track Collisions (verified)**, 675 disjunction constraints, solved FEASIBLE in ~13s.
- **Empirical Proof Scripts**: `test_ai_wiring.py` (ML risk scores demonstrably re-time trains), `test_stability.py` (8/8 runs, 0 collisions).
- **Infeasibility is reported honestly**: densities above the capacity bound produce a solver INFEASIBLE result — never a fake SUCCESS.

---

## 3. System Architecture & Web UI Routes

```
[ Data Ingestion Layer ]
  - New Delhi - Howrah Trunk Route Digital Twin (1,447 km, double-track speed limits)
  - Synthetic Telemetry: 23-105 Trains + Weather/Congestion/Noise Variance
        │
        ▼
[ Predictive AI Engine ]  ──► RandomForestRegressor (R² = 0.9934, MAE = 4.7 min)
        │                     Computes predicted delay risk scores [0.0, 1.0] per segment
        │                     Asset-failure classifier: 84% accuracy / F1 0.75
        │                     Real-time anomaly flag: IsolationForest (e.g. ANOMALY_DETECTED)
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
