import os
import json
import random
from typing import Dict, List, Any

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

STATIONS = [
    {"code": "NDLS", "name": "New Delhi", "km": 0},
    {"code": "CNB", "name": "Kanpur Central", "km": 440},
    {"code": "PRYJ", "name": "Prayagraj Junction", "km": 635},
    {"code": "DDU", "name": "Pt. Deen Dayal Upadhyaya", "km": 788},
    {"code": "GAYA", "name": "Gaya Junction", "km": 993},
    {"code": "DHN", "name": "Dhanbad Junction", "km": 1194},
    {"code": "ASN", "name": "Asansol Junction", "km": 1253},
    {"code": "HWH", "name": "Howrah Junction", "km": 1447}
]

SEGMENTS = [
    {"from": "NDLS", "to": "CNB", "length_km": 440, "max_speed_kmph": 130, "tracks": 2, "signal_blocks": 88},
    {"from": "CNB", "to": "PRYJ", "length_km": 195, "max_speed_kmph": 130, "tracks": 2, "signal_blocks": 39},
    {"from": "PRYJ", "to": "DDU", "length_km": 153, "max_speed_kmph": 130, "tracks": 2, "signal_blocks": 30},
    {"from": "DDU", "to": "GAYA", "length_km": 205, "max_speed_kmph": 120, "tracks": 2, "signal_blocks": 41},
    {"from": "GAYA", "to": "DHN", "length_km": 201, "max_speed_kmph": 110, "tracks": 2, "signal_blocks": 40},
    {"from": "DHN", "to": "ASN", "length_km": 59, "max_speed_kmph": 120, "tracks": 2, "signal_blocks": 12},
    {"from": "ASN", "to": "HWH", "length_km": 194, "max_speed_kmph": 130, "tracks": 2, "signal_blocks": 38}
]

TRAIN_TYPES = {
    "VANDE_BHARAT": {"priority": 1, "avg_speed": 125, "dwell_min": 3, "color": "#00F0FF"},
    "RAJDHANI": {"priority": 1, "avg_speed": 115, "dwell_min": 5, "color": "#FF2A6D"},
    "SUPERFAST": {"priority": 2, "avg_speed": 95, "dwell_min": 7, "color": "#05D9E8"},
    "EXPRESS": {"priority": 3, "avg_speed": 80, "dwell_min": 10, "color": "#FFC400"},
    "FREIGHT": {"priority": 4, "avg_speed": 60, "dwell_min": 0, "color": "#D1F7FF"}
}

def generate_corridor_graph() -> Dict[str, Any]:
    return {
        "corridor": "New Delhi - Howrah Main Line",
        "total_distance_km": 1447,
        "stations": STATIONS,
        "segments": SEGMENTS
    }

def generate_synthetic_timetable() -> List[Dict[str, Any]]:
    trains = []
    
    # Define realistic train profiles
    train_templates = [
        {"id": "22436", "name": "Vande Bharat Express (NDLS-HWH)", "type": "VANDE_BHARAT", "dir": "DOWN", "start_time": "06:00"},
        {"id": "12302", "name": "Howrah Rajdhani (NDLS-HWH)", "type": "RAJDHANI", "dir": "DOWN", "start_time": "16:50"},
        {"id": "12301", "name": "New Delhi Rajdhani (HWH-NDLS)", "type": "RAJDHANI", "dir": "UP", "start_time": "16:55"},
        {"id": "12314", "name": "Sealdah Rajdhani (NDLS-HWH)", "type": "RAJDHANI", "dir": "DOWN", "start_time": "16:30"},
        {"id": "12260", "name": "Duronto Express (NDLS-HWH)", "type": "RAJDHANI", "dir": "DOWN", "start_time": "19:40"},
        {"id": "12304", "name": "Poorva Express (NDLS-HWH)", "type": "SUPERFAST", "dir": "DOWN", "start_time": "17:40"},
        {"id": "12382", "name": "Poorva Express via Gaya (NDLS-HWH)", "type": "SUPERFAST", "dir": "DOWN", "start_time": "17:40"},
        {"id": "12307", "name": "Howrah SF Express (NDLS-HWH)", "type": "SUPERFAST", "dir": "DOWN", "start_time": "08:00"},
        {"id": "12381", "name": "Poorva Express (HWH-NDLS)", "type": "SUPERFAST", "dir": "UP", "start_time": "08:15"},
        {"id": "12313", "name": "Sealdah Rajdhani (HWH-NDLS)", "type": "RAJDHANI", "dir": "UP", "start_time": "16:50"},
        
        # Express Trains
        {"id": "13010", "name": "Doon Express (NDLS-HWH)", "type": "EXPRESS", "dir": "DOWN", "start_time": "05:00"},
        {"id": "13009", "name": "Doon Express (HWH-NDLS)", "type": "EXPRESS", "dir": "UP", "start_time": "20:25"},
        {"id": "12322", "name": "Kalka Mail (NDLS-HWH)", "type": "EXPRESS", "dir": "DOWN", "start_time": "21:25"},
        {"id": "12321", "name": "Howrah Mail (HWH-NDLS)", "type": "EXPRESS", "dir": "UP", "start_time": "23:35"},
        {"id": "12802", "name": "Purushottam Express (NDLS-HWH)", "type": "EXPRESS", "dir": "DOWN", "start_time": "22:40"},
        
        # Freight Trains (Crucial for bottleneck simulation)
        {"id": "BOXN-01", "name": "Coal Rake 4041 (DDU-DHN)", "type": "FREIGHT", "dir": "DOWN", "start_time": "02:15"},
        {"id": "BOXN-02", "name": "Steel Rake 8812 (ASN-CNB)", "type": "FREIGHT", "dir": "UP", "start_time": "04:30"},
        {"id": "BCNA-03", "name": "Container Rake 102 (NDLS-DDU)", "type": "FREIGHT", "dir": "DOWN", "start_time": "07:15"},
        {"id": "BOXN-04", "name": "Coal Rake 9012 (DHN-PRYJ)", "type": "FREIGHT", "dir": "UP", "start_time": "09:45"},
        {"id": "BOXN-05", "name": "Iron Ore Rake (ASN-DDU)", "type": "FREIGHT", "dir": "UP", "start_time": "13:20"},
        {"id": "BCNA-06", "name": "Grain Special (CNB-HWH)", "type": "FREIGHT", "dir": "DOWN", "start_time": "15:10"},
        {"id": "BOXN-07", "name": "Coal Rake 5011 (GAYA-CNB)", "type": "FREIGHT", "dir": "UP", "start_time": "18:00"},
        {"id": "BCNA-08", "name": "Freight Container (NDLS-HWH)", "type": "FREIGHT", "dir": "DOWN", "start_time": "21:00"}
    ]

    for template in train_templates:
        tt = TRAIN_TYPES[template["type"]]
        h, m = map(int, template["start_time"].split(":"))
        curr_time_min = h * 60 + m
        
        station_order = STATIONS if template["dir"] == "DOWN" else list(reversed(STATIONS))
        stops = []
        
        for i, st in enumerate(station_order):
            if i == 0:
                stops.append({
                    "station": st["code"],
                    "km": st["km"],
                    "arr_min": curr_time_min,
                    "dep_min": curr_time_min
                })
            else:
                prev_st = station_order[i-1]
                dist = abs(st["km"] - prev_st["km"])
                travel_min = int((dist / tt["avg_speed"]) * 60)
                arr_min = curr_time_min + travel_min
                dep_min = arr_min + tt["dwell_min"]
                
                stops.append({
                    "station": st["code"],
                    "km": st["km"],
                    "arr_min": arr_min,
                    "dep_min": dep_min
                })
                curr_time_min = dep_min

        trains.append({
            "train_id": template["id"],
            "name": template["name"],
            "type": template["type"],
            "priority": tt["priority"],
            "direction": template["dir"],
            "color": tt["color"],
            "stops": stops
        })

    return trains

def generate_siloed_maintenance_requests() -> List[Dict[str, Any]]:
    """
    Generates realistic, un-coordinated maintenance requests from
    Civil Engineering, OHE (Electrical), and S&T (Signalling) departments.
    Notice overlapping windows on identical or adjacent track segments!
    """
    requests = [
        # Segment CNB-PRYJ: Severe overlapping requests across 3 departments
        {
            "request_id": "REQ-CIVIL-101",
            "department": "Civil",
            "department_code": "CIV",
            "segment": "CNB-PRYJ",
            "from_station": "CNB",
            "to_station": "PRYJ",
            "work_type": "Deep Ballast Screening & Rail Grinding",
            "preferred_start_min": 360,   # 06:00
            "preferred_end_min": 570,     # 09:30 (3.5 hrs)
            "min_duration_min": 210,
            "priority": 1,
            "track_affected": "DOWN_LINE",
            "required_speed_restriction_kmph": 30
        },
        {
            "request_id": "REQ-OHE-204",
            "department": "OHE (Electrical)",
            "department_code": "OHE",
            "segment": "CNB-PRYJ",
            "from_station": "CNB",
            "to_station": "PRYJ",
            "work_type": "Catenary Wire Tensioning & Insulator Swapping",
            "preferred_start_min": 450,   # 07:30
            "preferred_end_min": 630,     # 10:30 (3.0 hrs)
            "min_duration_min": 180,
            "priority": 2,
            "track_affected": "DOWN_LINE",
            "required_speed_restriction_kmph": 0 # Full Power Block
        },
        {
            "request_id": "REQ-ST-302",
            "department": "S&T (Signalling)",
            "department_code": "ST",
            "segment": "CNB-PRYJ",
            "from_station": "CNB",
            "to_station": "PRYJ",
            "work_type": "Electronic Interlocking & Point Machine Overhaul",
            "preferred_start_min": 480,   # 08:00
            "preferred_end_min": 660,     # 11:00 (3.0 hrs)
            "min_duration_min": 150,
            "priority": 1,
            "track_affected": "BOTH",
            "required_speed_restriction_kmph": 20
        },

        # Segment DDU-GAYA: Overlapping Civil and OHE requests
        {
            "request_id": "REQ-CIVIL-102",
            "department": "Civil",
            "department_code": "CIV",
            "segment": "DDU-GAYA",
            "from_station": "DDU",
            "to_station": "GAYA",
            "work_type": "TRT Track Renewal & Sleeper Replacement",
            "preferred_start_min": 780,   # 13:00
            "preferred_end_min": 1020,    # 17:00 (4.0 hrs)
            "min_duration_min": 240,
            "priority": 1,
            "track_affected": "UP_LINE",
            "required_speed_restriction_kmph": 20
        },
        {
            "request_id": "REQ-OHE-205",
            "department": "OHE (Electrical)",
            "department_code": "OHE",
            "segment": "DDU-GAYA",
            "from_station": "DDU",
            "to_station": "GAYA",
            "work_type": "Cantilever Assembly Replacement",
            "preferred_start_min": 840,   # 14:00
            "preferred_end_min": 1050,    # 17:30 (3.5 hrs)
            "min_duration_min": 180,
            "priority": 2,
            "track_affected": "UP_LINE",
            "required_speed_restriction_kmph": 0
        },

        # Segment GAYA-DHN: S&T Signalling maintenance early morning
        {
            "request_id": "REQ-ST-305",
            "department": "S&T (Signalling)",
            "department_code": "ST",
            "segment": "GAYA-DHN",
            "from_station": "GAYA",
            "to_station": "DHN",
            "work_type": "Axle Counter Testing & Signal LED Replacement",
            "preferred_start_min": 120,   # 02:00
            "preferred_end_min": 300,     # 05:00 (3.0 hrs)
            "min_duration_min": 180,
            "priority": 2,
            "track_affected": "DOWN_LINE",
            "required_speed_restriction_kmph": 40
        },

        # Segment DHN-ASN: Civil track tamping
        {
            "request_id": "REQ-CIVIL-103",
            "department": "Civil",
            "department_code": "CIV",
            "segment": "DHN-ASN",
            "from_station": "DHN",
            "to_station": "ASN",
            "work_type": "CSM Tamping Machine Operation",
            "preferred_start_min": 600,   # 10:00
            "preferred_end_min": 840,     # 14:00 (4.0 hrs)
            "min_duration_min": 240,
            "priority": 2,
            "track_affected": "DOWN_LINE",
            "required_speed_restriction_kmph": 30
        }
    ]
    return requests

def build_data_files():
    os.makedirs(DATA_DIR, exist_ok=True)
    
    graph = generate_corridor_graph()
    timetable = generate_synthetic_timetable()
    requests = generate_siloed_maintenance_requests()
    
    with open(os.path.join(DATA_DIR, "network_graph.json"), "w") as f:
        json.dump(graph, f, indent=2)
        
    with open(os.path.join(DATA_DIR, "timetable.json"), "w") as f:
        json.dump(timetable, f, indent=2)
        
    with open(os.path.join(DATA_DIR, "maintenance_requests.json"), "w") as f:
        json.dump(requests, f, indent=2)
        
    print(f"[+] Data Generation Complete. Saved files into: {DATA_DIR}")

if __name__ == "__main__":
    build_data_files()
