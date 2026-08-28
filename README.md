# AVAIL — Automatic Block Planning & Integrated Rescheduling Engine
### Smart India Hackathon 2026 | Problem Statement SIH26027 | Team Durga Ghee Podi Dosa

---

## 1. Executive Summary

In Indian Railways operations, Civil (track), OHE (electrification), and S&T (signalling) maintenance **blocks** are planned separately in silos. Only **~2.2%** of blocks are integrated, leaving **97.8%** isolated. This causes repeated corridor shutdowns, idle track machine time (~30–32%), and severe downstream asset failures (e.g. 400% locomotive failure surges cited in CAG reports).

**AVAIL** (Asset Visibility & Availability through Intelligent Logistics) solves this by:
1. **Intelligent Block Consolidation**: Merging overlapping/adjacent Civil, OHE, and S&T requests into unified **Integrated Corridor Blocks**.
2. **CP-SAT Constraint Optimization**: Using Google OR-Tools CP-SAT solver to automatically reschedule train traffic conflict-free around block windows.
3. **Interactive What-If Dashboard**: Providing railway traffic controllers a live Gantt simulation sandbox to preview and adjust block timings before approval.

---

## 2. System Architecture

```
[ Data Layer ]
  - New Delhi - Howrah Digital Twin Graph (1,447 km, 8 Key Stations)
  - Timetable (23 Trains: Vande Bharat, Rajdhani, Express, Freight)
  - Siloed Departmental Requests (Civil, OHE, S&T)
        │
        ▼
[ Block Merging Engine ]  ──► Union-Find Spatial-Temporal Interval Merging Algorithm
        │                     (37.5% Idle Block Reduction)
        ▼
[ Optimization Engine ]   ──► Google OR-Tools CP-SAT Solver
        │                     (0.12s Constraint Resolution, 0 Track Conflicts)
        ▼
[ Predictive AI Layer ]   ──► Scikit-Learn Random Forest Regressor
        │                     (Travel time & delay prediction under congestion)
        ▼
[ Interactive Dashboard ] ──► Streamlit + Plotly Trajectory Gantt Chart
                              (Controller What-If Sandbox & Live KPI Metrics)
```

---

## 3. How Dashboard KPIs Are Computed (Honest Defense Guide)

All numbers displayed in the AVAIL dashboard are **dynamically computed** from the demo dataset (not hardcoded):

1. **Idle Corridor Hours Eliminated**:
   $$\text{Hours Saved} = \sum \text{Siloed Hours Requested} - \sum \text{Integrated Block Hours}$$
   - *Example*: $20.0\text{ siloed requested hours} - 12.5\text{ integrated block hours} = 7.50\text{ hours saved}$.

2. **Idle Block Reduction %**:
   $$\text{Idle Reduction \%} = \left(\frac{\text{Hours Saved}}{\sum \text{Siloed Hours Requested}}\right) \times 100\%$$
   - *Example*: $(7.50 / 20.0) \times 100\% = 37.5\%$.

3. **Track Conflicts Auto-Resolved**:
   - Number of pairwise train-to-train and train-to-maintenance segment occupancy disjunction constraints enforced and resolved by CP-SAT solver without collision.

4. **Network Punctuality %**:
   $$\text{Punctuality \%} = \left(\frac{N_{\text{punctual trains}}}{N_{\text{total trains}}}\right) \times 100\%$$
   - *Example*: $17 / 23 = 73.9\%$.

---

## 4. Synthetic Data Framing

- **Corridor**: New Delhi – Howrah Trunk Route (NDLS, CNB, PRYJ, DDU, GAYA, DHN, ASN, HWH). Modeled after CAG 2021 audit findings (12,466 timetable conflicts simulated on this corridor via RailSys).
- **Safety by Design**: No direct write-access to live signalling systems. AVAIL operates in **Human-in-the-Loop** mode: AI proposes schedules, Railway Controller approves.

---

## 5. How to Run the Prototype

### Prerequisites
- Python 3.9+ installed.

### Quick Run
```bash
# 1. Install dependencies
pip install ortools fastapi uvicorn streamlit plotly pandas numpy scikit-learn networkx requests

# 2. Launch system
python run_avail.py
```

- **Streamlit What-If Dashboard**: `http://localhost:8501`
- **FastAPI REST API Docs**: `http://127.0.0.1:8000/docs`
