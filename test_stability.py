"""
AVAIL — Tier 1a Stability Audit Script (test_stability.py)
Runs a series of full pipeline audits across the synthetic network and verifies:
1. ZERO track-block collisions in every optimized schedule (rigorous interval audit).
2. The integrated corridor merger completes consistently without exceptions.
"""

import sys
import os
import random

sys.path.append(os.path.join(os.path.dirname(__file__), "backend"))

from data_generator import generate_corridor_graph, generate_synthetic_timetable, generate_siloed_maintenance_requests
from block_merger import BlockMerger
from optimizer import CorridorOptimizer


def audit_collisions(optimized_timetable, integrated_blocks):
    """
    Rigorous collision audit: no train segment interval may overlap any
    integrated maintenance block on the same segment (either direction).
    """
    seg_intervals = {}
    for train in optimized_timetable:
        t_id = train["train_id"]
        stops = train["stops"]
        for i in range(len(stops) - 1):
            key = f"{stops[i]['station']}-{stops[i + 1]['station']}"
            seg_intervals.setdefault(key, []).append(
                (t_id, stops[i]["opt_dep_min"], stops[i + 1]["opt_arr_min"])
            )
    collisions = 0
    for block in integrated_blocks:
        b_start, b_end = block["start_min"], block["end_min"]
        for seg in [f"{block['from_station']}-{block['to_station']}",
                    f"{block['to_station']}-{block['from_station']}"]:
            for (t_id, dep, arr) in seg_intervals.get(seg, []):
                if not (arr <= b_start or dep >= b_end):
                    collisions += 1
    return collisions


def run_stability_audit(num_runs=8):
    print("=" * 70)
    print("   AVAIL STABILITY AUDIT: Running %s Pipeline Audits" % num_runs)
    print("=" * 70)

    total_collisions = 0
    successful_runs = 0

    for i in range(1, num_runs + 1):
        seed = random.randint(1000, 9999)
        random.seed(seed)

        network = generate_corridor_graph()
        timetable = generate_synthetic_timetable()
        requests = generate_siloed_maintenance_requests()

        merger = BlockMerger(merge_window_minutes=120)
        merged_res = merger.merge_requests(requests)
        integrated_blocks = merged_res["integrated_blocks"]

        assert len(integrated_blocks) > 0, "Merger produced zero blocks"

        optimizer = CorridorOptimizer(time_limit_seconds=5.0)
        start = __import__("time").time()
        opt_res = optimizer.solve(network, timetable, integrated_blocks)
        dur = __import__("time").time() - start

        kpis = opt_res.get("kpis", {})
        collisions = audit_collisions(opt_res.get("optimized_timetable", []), integrated_blocks)
        total_collisions += collisions

        if opt_res.get("status") == "SUCCESS" and collisions == 0:
            successful_runs += 1
            status_icon = "PASSED"
        else:
            status_icon = "FAILED"

        print("Run %02d/%02d | Seed: %s | Trains: %2d | Blocks: %d | "
              "| Solve: %.3fs | Collisions: %d | %s"
              % (i, num_runs, seed, len(timetable), len(integrated_blocks), dur, collisions, status_icon))

    print("=" * 70)
    print("AUDIT SUMMARY:")
    print("  * Successful Runs: %d/%d" % (successful_runs, num_runs))
    print("  * Total Safety Collisions: %d" % total_collisions)
    print("  * Safety Guarantee: all segment occupancies stay clear of every block window")
    print("=" * 70)

    assert total_collisions == 0, "STABILITY AUDIT FAILED: Detected %d track collisions!" % total_collisions
    print("SUCCESS: 0 Track-Block Collisions verified across all runs!")
    return True


if __name__ == "__main__":
    ok = run_stability_audit(8)
    if not ok:
        sys.exit(1)