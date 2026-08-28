"""
AVAIL System - AI Wiring Verification Test (Tier 0a)
Smart India Hackathon 2026 | Problem Statement SIH26027 | Team Durga Ghee Podi Dosa

Proves that segment delay risk scores predicted by the RandomForest model dynamically
alter the CP-SAT solver's optimal train departure times, while keeping every solved
schedule collision-free.
"""

import sys

from backend.data_generator import generate_corridor_graph, generate_synthetic_timetable, generate_siloed_maintenance_requests
from backend.block_merger import BlockMerger
from backend.optimizer import CorridorOptimizer


def verify_no_collisions(optimized_timetable, integrated_blocks):
    """Check every segment interval is fully clear of each maintenance block."""
    seg_intervals = {}
    for train in optimized_timetable:
        t_id = train["train_id"]
        stops = train["stops"]
        for i in range(len(stops) - 1):
            key = f"{stops[i]['station']}-{stops[i + 1]['station']}"
            seg_intervals.setdefault(key, []).append(
                (t_id, stops[i]["opt_dep_min"], stops[i + 1]["opt_arr_min"])
            )
    for block in integrated_blocks:
        b_start, b_end = block["start_min"], block["end_min"]
        for seg in [f"{block['from_station']}-{block['to_station']}",
                    f"{block['to_station']}-{block['from_station']}"]:
            for (_tid, dep, arr) in seg_intervals.get(seg, []):
                assert arr <= b_start or dep >= b_end, (
                    f"COLLISION: train {_tid} occupies {seg} during block "
                    f"[{b_start},{b_end}]"
                )


def run_ai_wiring_test():
    print("=" * 75)
    print("AVAIL TIER 0a PROOF: AI PREDICTIVE DELAY WIRING VERIFICATION TEST")
    print("=" * 75)

    network_graph = generate_corridor_graph()
    timetable = generate_synthetic_timetable()
    requests = generate_siloed_maintenance_requests()

    merger = BlockMerger(merge_window_minutes=120)
    merged_data = merger.merge_requests(requests)
    blocks = merged_data["integrated_blocks"]

    # TEST SCENARIO 1: Low risk on every segment
    optimizer_low = CorridorOptimizer(time_limit_seconds=6.0)
    optimizer_low.predictor.predict = lambda **kwargs: {"predicted_delay_risk": 0.10}
    res_low = optimizer_low.solve(network_graph, timetable, blocks)

    # TEST SCENARIO 2: High risk forced on the CNB-PRYJ bottleneck (195 km)
    optimizer_high = CorridorOptimizer(time_limit_seconds=6.0)
    def mock_high_risk(priority, avg_speed, distance_km, signal_blocks, congestion_index=0.4, weather_severity=0.2):
        risk = 0.95 if abs(distance_km - 195) < 10 else 0.10
        return {"predicted_delay_risk": risk}
    optimizer_high.predictor.predict = mock_high_risk
    res_high = optimizer_high.solve(network_graph, timetable, blocks)

    sched_low = {t["train_id"]: t for t in res_low.get("optimized_timetable", [])}
    sched_high = {t["train_id"]: t for t in res_high.get("optimized_timetable", [])}

    schedule_diffs = 0
    detailed_diffs = []
    for t_id, t_low in sched_low.items():
        t_high = sched_high.get(t_id)
        if not t_high:
            continue
        dep_low = t_low["stops"][-1]["opt_dep_min"]
        dep_high = t_high["stops"][-1]["opt_dep_min"]
        if dep_low != dep_high:
            schedule_diffs += 1
            detailed_diffs.append(
                f"  - Train {t_id} ({t_low['name']}): LowRisk dep={dep_low}m -> HighRisk dep={dep_high}m"
            )

    # Both solutions MUST be collision free regardless of risk weighting
    verify_no_collisions(res_low.get("optimized_timetable", []), blocks)
    verify_no_collisions(res_high.get("optimized_timetable", []), blocks)

    low_delay = res_low.get("kpis", {}).get("total_system_delay_minutes", 0)
    high_delay = res_high.get("kpis", {}).get("total_system_delay_minutes", 0)

    print(f"\n[+] Baseline Low-Risk Solve Status : {res_low.get('kpis', {}).get('solver_status')}")
    print(f"[+] High-Risk CNB-PRYJ Solve Status: {res_high.get('kpis', {}).get('solver_status')}")
    print(f"[+] Schedule Alterations Detected   : {schedule_diffs} train paths changed")
    print(f"[+] Total Delay (low vs high risk)  : {low_delay}m vs {high_delay}m")
    print(f"[+] Collision Audit                 : 0 collisions in BOTH solves")

    if detailed_diffs:
        print("\n[Sample Schedule Alterations due to ML Risk Weighting]:")
        for diff in detailed_diffs[:5]:
            print(diff)

    assert schedule_diffs > 0 or low_delay != high_delay, (
        "FAILED: ML risk scores did not alter optimizer behavior!"
    )

    print("\n" + "=" * 75)
    print("VERIFICATION SUCCESS: Predictive ML Delay Risk scores dynamically drive CP-SAT solver decision-making!")
    print("=" * 75)
    return True


if __name__ == "__main__":
    success = run_ai_wiring_test()
    if not success:
        sys.exit(1)