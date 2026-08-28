"""
AVAIL System - Telemetry Anomaly Detector (Tier 0c)
Smart India Hackathon 2026 | Problem Statement SIH26027 | Team Durga Ghee Podi Dosa

Unsupervised IsolationForest model to flag real-time track vibration and signalling anomalies.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest


class TelemetryAnomalyDetector:
    def __init__(self, random_state=42):
        self.random_state = random_state
        self.model = IsolationForest(contamination=0.08, random_state=self.random_state)
        self.feature_names = ["vibration_rms", "track_temp_c", "ohe_voltage_kv", "signal_lag_ms"]
        self.is_trained = False

    def train(self, num_samples=500):
        np.random.seed(self.random_state)
        # Standard sensor telemetry
        vib = np.random.normal(1.2, 0.3, num_samples)
        temp = np.random.normal(28.0, 4.0, num_samples)
        voltage = np.random.normal(25.0, 0.8, num_samples) # 25kV standard IR OHE
        lag = np.random.normal(45.0, 10.0, num_samples)    # Signal lag ms

        # Inject 8% synthetic anomalies
        n_anom = int(num_samples * 0.08)
        vib[:n_anom] += np.random.uniform(2.5, 4.5, n_anom)
        temp[:n_anom] += np.random.uniform(15.0, 25.0, n_anom)
        voltage[:n_anom] -= np.random.uniform(3.0, 7.0, n_anom)
        lag[:n_anom] += np.random.uniform(100.0, 300.0, n_anom)

        df = pd.DataFrame({
            "vibration_rms": vib,
            "track_temp_c": temp,
            "ohe_voltage_kv": voltage,
            "signal_lag_ms": lag
        })

        self.model.fit(df)
        self.is_trained = True
        print("[+] IsolationForest Telemetry Anomaly Detector Trained.")

    def detect_anomaly(self, sensor_dict):
        if not self.is_trained:
            self.train()

        input_df = pd.DataFrame([{
            "vibration_rms": sensor_dict.get("vibration_rms", 1.2),
            "track_temp_c": sensor_dict.get("track_temp_c", 28.0),
            "ohe_voltage_kv": sensor_dict.get("ohe_voltage_kv", 25.0),
            "signal_lag_ms": sensor_dict.get("signal_lag_ms", 45.0)
        }])

        pred = self.model.predict(input_df)[0]  # -1 for anomaly, 1 for normal
        score = float(self.model.score_samples(input_df)[0])
        return {
            "is_anomaly": bool(pred == -1),
            "anomaly_score": round(score, 4),
            "status": "ANOMALY_DETECTED" if pred == -1 else "NORMAL"
        }


if __name__ == "__main__":
    detector = TelemetryAnomalyDetector()
    detector.train()
    res = detector.detect_anomaly({"vibration_rms": 4.8, "signal_lag_ms": 280.0})
    print("Anomaly Detection Test Result:", res)
