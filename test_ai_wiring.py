"""
AVAIL System - AI Wiring Verification Test (Tier 0a)
Smart India Hackathon 2026 | Problem Statement SIH26027 | Team Durga Ghee Podi Dosa

Proves that segment delay risk scores predicted by the RandomForest model dynamically alter the CP-SAT solver's optimal train departure times.
"""

from backend.data_generator import generate_corridor_graph, generate_synthetic_timetable, generate_siloed_maintenance_requests
from backend.block_merger import BlockMerger
from backend.predictive_model import TravelTimePredictor
from backend.optimizer import CorridorOptimizer


def run_ai_wiring_test():
    print("=" * 75)
    print("AVAIL TIER 0a PROOF: AI PREDICTIVE DELAY WIRING VERIFICATION TEST")
    print("=" * 75)

    # 1. Load baseline data
    network_graph = generate_corridor_graph()
    timetable = generate_synthetic_timetable()
    requests = generate_siloed_maintenance_requests()

    merger = BlockMerger(merge_window_minutes=120)
    merged_data = merger.merge_requests(requests)
    blocks = merged_data["integrated_blocks"]

    predictor = TravelTimePredictor()

    # TEST SCENARIO 1: Baseline / Low Risk Scores across all segments (0.10)
    optimizer_low = CorridorOptimizer(time_limit_seconds=5.0)
    # Pre-populate segments
    for seg in network_graph["segments"]:
        seg_key = f"{seg['from']}-{seg['to']}"
        rev_key = f"{seg['to']}-{seg['from']}"
        optimizer_low.predictor.predict = lambda **kwargs: {"predicted_delay_risk": 0.10}

    res_low = optimizer_low.solve(network_graph, timetable, blocks)
    sched_low = res_low["optimized_timetable"]

    # TEST SCENARIO 2: High Risk Score (0.95) forced on key bottleneck segment 'CNB-PRYJ'
    optimizer_high = CorridorOptimizer(time_limit_seconds=5.0)
    def mock_high_risk(priority, avg_speed, distance_km, signal_blocks, congestion_index=0.4, weather_severity=0.2):
        # High risk if distance is around 195km (CNB-PRYJ)
        risk = 0.95 if abs(distance_km - 195) < 10 else 0.10
        return {"predicted_delay_risk": risk}
    optimizer_high.predictor.predict = mock_high_risk

    res_high = optimizer_high.solve(network_graph, timetable, blocks)
    sched_high = res_high["optimized_timetable"]

    # 3. Compare Schedules
    schedule_diffs = 0
    detailed_diffs = []

    for t_low, t_high in zip(sched_low, sched_high):
        if t_low["departure_time_mins"] != t_high["departure_time_mins"] or t_low["arrival_time_mins"] != t_high["arrival_time_mins"]:
            schedule_diffs += 1
            detailed_diffs.append(
                f"  - Train {t_low['train_id']} ({t_low['type']}): LowRisk Dep={t_low['departure_time_mins']}m -> HighRisk Dep={t_high['departure_time_mins']}m"
            )

    print(f"\n[+] Baseline Low-Risk Solve Status : {res_low['solver_status']}")
    print(f"[+] High-Risk CNB-PRYJ Solve Status: {res_high['solver_status']}")
    print(f"[+] Schedule Alterations Detected   : {schedule_diffs} train paths changed")

    if detailed_diffs:
        print("\n[Sample Schedule Alterations due to ML Risk Weighting]:")
        for diff in detailed_diffs[:5]:
            print(diff)

    assert schedule_diffs > 0 or res_low['total_delay_mins'] != res_high['total_delay_mins'], "FAILED: ML risk scores did not alter optimizer behavior!"

    print("\n" + "=" * 75)
    print("VERIFICATION SUCCESS: Predictive ML Delay Risk scores dynamically drive CP-SAT solver decision-making!")
    print("=" * 75)
    return True


if __name__ == "__main__":
    success = run_ai_wiring_test()
    if not success:
        sys.exit(1)
