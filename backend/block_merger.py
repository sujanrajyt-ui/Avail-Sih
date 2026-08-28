from typing import List, Dict, Any
import json
import os

try:
    from backend.predictive_model import TravelTimePredictor
except ImportError:
    from predictive_model import TravelTimePredictor

try:
    from backend.data_generator import SEGMENTS
except ImportError:
    from data_generator import SEGMENTS

class DisjointSet:
    def __init__(self, n: int):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, i: int) -> int:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i: int, j: int):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            if self.rank[root_i] < self.rank[root_j]:
                root_i, root_j = root_j, root_i
            self.parent[root_j] = root_i
            if self.rank[root_i] == self.rank[root_j]:
                self.rank[root_i] += 1

class BlockMerger:
    def __init__(self, merge_window_minutes: int = 120, buffer_minutes: int = 15):
        """
        :param merge_window_minutes: Maximum gap between two requests on the same segment to trigger integration.
        :param buffer_minutes: Setup/tear-down safety buffer added to integrated block.
        """
        self.merge_window = merge_window_minutes
        self.buffer_minutes = buffer_minutes
        self._predictor = None

    def _get_predictor(self) -> TravelTimePredictor:
        if self._predictor is None:
            self._predictor = TravelTimePredictor()
        return self._predictor

    @staticmethod
    def _real_segment_length(segment: str) -> float:
        """
        Returns the true corridor length (km) for a segment key such as 'CNB-PRYJ',
        falling back to the historical default of 195 km for unknown segments.
        """
        if "-" not in segment:
            return 195.0
        try:
            seg_from, seg_to = segment.split("-")
        except ValueError:
            return 195.0
        for seg in SEGMENTS:
            if seg["from"] == seg_from and seg["to"] == seg_to:
                return float(seg["length_km"])
        return 195.0

    def merge_requests(self, raw_requests: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Merges siloed departmental maintenance requests into Integrated Corridor Blocks.
        Returns the merged blocks and quantifiable efficiency metrics.
        """
        if not raw_requests:
            return {"integrated_blocks": [], "metrics": {}}

        n = len(raw_requests)
        ds = DisjointSet(n)

        # Pairwise comparison for spatial & temporal overlap/proximity
        for i in range(n):
            req1 = raw_requests[i]
            for j in range(i + 1, n):
                req2 = raw_requests[j]

                # Check spatial condition (same track segment)
                if req1["segment"] == req2["segment"]:
                    # Check track compatibility (e.g. DOWN_LINE vs BOTH, or UP_LINE)
                    tracks_compatible = (
                        req1["track_affected"] == req2["track_affected"] or
                        req1["track_affected"] == "BOTH" or
                        req2["track_affected"] == "BOTH"
                    )

                    if tracks_compatible:
                        # Check temporal overlap or proximity within merge_window
                        s1, e1 = req1["preferred_start_min"], req1["preferred_end_min"]
                        s2, e2 = req2["preferred_start_min"], req2["preferred_end_min"]

                        # Intervals [s1, e1] and [s2, e2] overlap or are close
                        if not (e1 + self.merge_window < s2 or e2 + self.merge_window < s1):
                            ds.union(i, j)

        # Group requests by connected component
        groups: Dict[int, List[Dict[str, Any]]] = {}
        for i in range(n):
            root = ds.find(i)
            if root not in groups:
                groups[root] = []
            groups[root].append(raw_requests[i])

        integrated_blocks = []
        block_id_counter = 1

        total_siloed_duration_min = sum(r["preferred_end_min"] - r["preferred_start_min"] for r in raw_requests)
        total_integrated_duration_min = 0

        for root, req_group in groups.items():
            segment = req_group[0]["segment"]
            from_st = req_group[0]["from_station"]
            to_st = req_group[0]["to_station"]
            departments = list(set(r["department"] for r in req_group))
            dept_codes = list(set(r["department_code"] for r in req_group))
            request_ids = [r["request_id"] for r in req_group]
            work_types = [r["work_type"] for r in req_group]

            # Determine unified block start & end times
            min_start = min(r["preferred_start_min"] for r in req_group)
            
            # Integrated block length = max(individual durations) + buffer for multi-agency handover
            max_single_duration = max(r["preferred_end_min"] - r["preferred_start_min"] for r in req_group)
            
            # Synergy savings: Concurrent execution saves time vs sequential execution
            # If multi-agency, total time required = max_single_duration + 30 mins setup
            if len(req_group) > 1:
                integrated_duration = max_single_duration + self.buffer_minutes
            else:
                integrated_duration = max_single_duration

            integrated_start = min_start
            integrated_end = integrated_start + integrated_duration

            total_integrated_duration_min += integrated_duration

            # Determine composite speed restriction (most restrictive)
            speed_restrictions = [r["required_speed_restriction_kmph"] for r in req_group]
            min_speed_restriction = min(speed_restrictions)

            # Determine track closure type
            tracks_affected = set(r["track_affected"] for r in req_group)
            if "BOTH" in tracks_affected or ("DOWN_LINE" in tracks_affected and "UP_LINE" in tracks_affected):
                composite_track = "BOTH"
            elif "DOWN_LINE" in tracks_affected:
                composite_track = "DOWN_LINE"
            else:
                composite_track = "UP_LINE"

            # Individual sum of requested hours for this group
            siloed_group_mins = sum(r["preferred_end_min"] - r["preferred_start_min"] for r in req_group)
            hours_saved_in_group = (siloed_group_mins - integrated_duration) / 60.0

            # Calculate predicted delay risk score for this block's segment
            seg_length = self._real_segment_length(segment)
            risk_score = self._get_predictor().get_segment_risk_score(
                segment_length_km=seg_length,
                max_speed_kmph=min_speed_restriction or 120,
                congestion_index=0.6
            )

            integrated_blocks.append({
                "block_id": f"ICB-{block_id_counter:03d}",
                "segment": segment,
                "from_station": from_st,
                "to_station": to_st,
                "start_min": integrated_start,
                "end_min": integrated_end,
                "duration_min": integrated_duration,
                "start_time_str": f"{integrated_start // 60:02d}:{integrated_start % 60:02d}",
                "end_time_str": f"{integrated_end // 60:02d}:{integrated_end % 60:02d}",
                "departments": departments,
                "department_codes": dept_codes,
                "requests_merged": request_ids,
                "work_descriptions": work_types,
                "merged_count": len(req_group),
                "track_affected": composite_track,
                "speed_restriction_kmph": min_speed_restriction,
                "siloed_hours_sum": round(siloed_group_mins / 60.0, 2),
                "integrated_hours": round(integrated_duration / 60.0, 2),
                "hours_saved": round(max(0, hours_saved_in_group), 2),
                "predicted_delay_risk": risk_score
            })
            block_id_counter += 1

        # Calculate Overall KPI Metrics
        siloed_total_hours = total_siloed_duration_min / 60.0
        integrated_total_hours = total_integrated_duration_min / 60.0
        total_hours_saved = siloed_total_hours - integrated_total_hours
        idle_reduction_pct = (total_hours_saved / siloed_total_hours * 100) if siloed_total_hours > 0 else 0.0

        metrics = {
            "total_siloed_requests": n,
            "total_integrated_blocks": len(integrated_blocks),
            "multi_department_blocks_created": sum(1 for b in integrated_blocks if b["merged_count"] > 1),
            "total_siloed_corridor_shutdown_hours": round(siloed_total_hours, 2),
            "total_integrated_corridor_shutdown_hours": round(integrated_total_hours, 2),
            "corridor_hours_saved": round(max(0, total_hours_saved), 2),
            "idle_block_reduction_pct": round(idle_reduction_pct, 1),
            "corridor_capacity_restored_pct": round(idle_reduction_pct * 0.85, 1)
        }

        return {
            "integrated_blocks": integrated_blocks,
            "metrics": metrics
        }

if __name__ == "__main__":
    data_path = os.path.join(os.path.dirname(__file__), "data", "maintenance_requests.json")
    if os.path.exists(data_path):
        with open(data_path, "r") as f:
            reqs = json.load(f)
        merger = BlockMerger(merge_window_minutes=120)
        result = merger.merge_requests(reqs)
        print("\n=== INTEGRATED CORRIDOR BLOCKS ===")
        for b in result["integrated_blocks"]:
            print(f"[{b['block_id']}] Segment: {b['segment']} | Depts: {', '.join(b['departments'])} | Time: {b['start_time_str']} - {b['end_time_str']} | Saved: {b['hours_saved']} hrs")
        print("\n=== KPI METRICS ===")
        print(json.dumps(result["metrics"], indent=2))
