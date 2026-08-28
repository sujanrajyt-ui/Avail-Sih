import os
import sys
import json
from typing import Dict, List, Any, Optional

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data_generator import build_data_files, DATA_DIR
from block_merger import BlockMerger
from optimizer import CorridorOptimizer
from predictive_model import TravelTimePredictor

app = FastAPI(
    title="AVAIL Engine API",
    description="Automatic Block Planning & Integrated Rescheduling Engine for Indian Railways (SIH26027)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global memory state
NETWORK_GRAPH = {}
TIMETABLE = []
RAW_REQUESTS = []

merger_engine = BlockMerger(merge_window_minutes=120)
optimizer_engine = CorridorOptimizer(time_limit_seconds=6.0)
predictive_engine = TravelTimePredictor()

def load_or_generate_data():
    global NETWORK_GRAPH, TIMETABLE, RAW_REQUESTS
    
    graph_path = os.path.join(DATA_DIR, "network_graph.json")
    tt_path = os.path.join(DATA_DIR, "timetable.json")
    req_path = os.path.join(DATA_DIR, "maintenance_requests.json")

    if not (os.path.exists(graph_path) and os.path.exists(tt_path) and os.path.exists(req_path)):
        build_data_files()

    with open(graph_path, "r") as f:
        NETWORK_GRAPH = json.load(f)
    with open(tt_path, "r") as f:
        TIMETABLE = json.load(f)
    with open(req_path, "r") as f:
        RAW_REQUESTS = json.load(f)

# Load data on import
load_or_generate_data()

@app.on_event("startup")
def startup_event():
    load_or_generate_data()

class MaintenanceRequestModel(BaseModel):
    request_id: str
    department: str
    department_code: str
    segment: str
    from_station: str
    to_station: str
    work_type: str
    preferred_start_min: int
    preferred_end_min: int
    min_duration_min: int
    priority: int
    track_affected: str
    required_speed_restriction_kmph: int

class WhatIfScenarioModel(BaseModel):
    modified_blocks: List[Dict[str, Any]]
    merge_window_minutes: Optional[int] = 120
    headway_buffer_minutes: Optional[int] = 4

@app.get("/")
def read_root():
    return {
        "system": "AVAIL - Asset Visibility & Availability through Intelligent Logistics",
        "hackathon": "Smart India Hackathon 2026 (SIH26027)",
        "team": "Durga Ghee Podi Dosa",
        "status": "ONLINE",
        "corridor": NETWORK_GRAPH.get("corridor", "New Delhi - Howrah Main Line"),
        "total_stations": len(NETWORK_GRAPH.get("stations", [])),
        "total_trains": len(TIMETABLE)
    }

@app.get("/api/network")
def get_network():
    return NETWORK_GRAPH

@app.get("/api/requests")
def get_requests():
    return {
        "raw_requests": RAW_REQUESTS,
        "count": len(RAW_REQUESTS)
    }

@app.post("/api/requests")
def add_request(req: MaintenanceRequestModel):
    RAW_REQUESTS.append(req.dict())
    return {
        "message": "Maintenance request submitted successfully",
        "total_requests": len(RAW_REQUESTS)
    }

@app.post("/api/merge-blocks")
def merge_blocks(merge_window_minutes: int = 120):
    merger = BlockMerger(merge_window_minutes=merge_window_minutes)
    merged_data = merger.merge_requests(RAW_REQUESTS)
    return merged_data

@app.post("/api/optimize")
def optimize_schedule(merge_window_minutes: int = 120):
    merger = BlockMerger(merge_window_minutes=merge_window_minutes)
    merged_data = merger.merge_requests(RAW_REQUESTS)
    
    optimization_result = optimizer_engine.solve(
        network_graph=NETWORK_GRAPH,
        timetable=TIMETABLE,
        integrated_blocks=merged_data["integrated_blocks"]
    )
    
    return {
        "merger_summary": merged_data["metrics"],
        "integrated_blocks": merged_data["integrated_blocks"],
        "optimization": optimization_result
    }

@app.post("/api/what-if")
def what_if_simulation(scenario: WhatIfScenarioModel):
    """
    Controller What-If Sandbox: Re-optimizes traffic when controller shifts block start/end times
    or alters department priority parameters. Returns before vs after comparative diff.
    """
    # 1. Base optimization (original blocks)
    base_merged = merger_engine.merge_requests(RAW_REQUESTS)
    base_opt = optimizer_engine.solve(NETWORK_GRAPH, TIMETABLE, base_merged["integrated_blocks"])
    
    # 2. What-If optimization (user modified blocks)
    whatif_blocks = scenario.modified_blocks if scenario.modified_blocks else base_merged["integrated_blocks"]
    whatif_opt = optimizer_engine.solve(NETWORK_GRAPH, TIMETABLE, whatif_blocks)

    # 3. Calculate comparative delta
    base_delay = base_opt.get("kpis", {}).get("total_system_delay_minutes", 0)
    whatif_delay = whatif_opt.get("kpis", {}).get("total_system_delay_minutes", 0)
    delay_diff_min = whatif_delay - base_delay

    base_punct = base_opt.get("kpis", {}).get("punctuality_pct", 0)
    whatif_punct = whatif_opt.get("kpis", {}).get("punctuality_pct", 0)
    punct_diff_pct = round(whatif_punct - base_punct, 1)

    return {
        "scenario": "CONTROLLER_WHAT_IF",
        "base_kpis": base_opt.get("kpis", {}),
        "whatif_kpis": whatif_opt.get("kpis", {}),
        "comparison_diff": {
            "delay_change_minutes": delay_diff_min,
            "punctuality_change_pct": punct_diff_pct,
            "status": "IMPROVED" if delay_diff_min <= 0 else "INCREASED_DELAY"
        },
        "whatif_timetable": whatif_opt.get("optimized_timetable", []),
        "whatif_blocks": whatif_blocks
    }

@app.get("/api/predict-travel-time")
def predict_travel(priority: int = 1, speed: float = 125.0, distance: float = 440.0, signal_blocks: int = 88, congestion: float = 0.4):
    pred = predictive_engine.predict(
        priority=priority,
        avg_speed=speed,
        distance_km=distance,
        signal_blocks=signal_blocks,
        congestion_index=congestion
    )
    return pred

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
