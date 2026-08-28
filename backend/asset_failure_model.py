"""
AVAIL System - Asset Failure Risk ML Model (Tier 0b)
Smart India Hackathon 2026 | Problem Statement SIH26027 | Team Durga Ghee Podi Dosa

Trains a RandomForestClassifier on asset operational metrics to predict 30-day failure probability / maintenance urgency.
Reports performance on a held-out test split (80/20) and exposes feature_importances_ for explainable AI.
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, f1_score


class AssetFailurePredictor:
    def __init__(self, random_state=42):
        self.random_state = random_state
        self.model = RandomForestClassifier(n_estimators=100, random_state=self.random_state)
        self.feature_names = [
            "days_since_last_maint",
            "cumulative_load_tonnage",
            "vibration_index",
            "temp_fluctuation_c",
            "switch_operations_count"
        ]
        self.is_trained = False
        self.test_accuracy = 0.0
        self.test_f1 = 0.0
        self.feature_importances = {}

    def generate_synthetic_training_data(self, num_samples=1000):
        np.random.seed(self.random_state)
        days_since_maint = np.random.uniform(10, 180, num_samples)
        tonnage = np.random.uniform(5.0, 50.0, num_samples)  # Million gross tonnes
        vibration = np.random.uniform(0.1, 5.0, num_samples) # mm/s RMS
        temp_fluct = np.random.uniform(5.0, 35.0, num_samples) # Deg C delta
        switch_ops = np.random.uniform(100, 10000, num_samples)

        # Failure risk formula with noise
        risk_score = (
            0.35 * (days_since_maint / 180.0) +
            0.25 * (tonnage / 50.0) +
            0.25 * (vibration / 5.0) +
            0.15 * (temp_fluct / 35.0) +
            np.random.normal(0.0, 0.08, num_samples)
        )
        failure_label = (risk_score > 0.58).astype(int)

        df = pd.DataFrame({
            "days_since_last_maint": days_since_maint,
            "cumulative_load_tonnage": tonnage,
            "vibration_index": vibration,
            "temp_fluctuation_c": temp_fluct,
            "switch_operations_count": switch_ops,
            "failure_label": failure_label
        })
        return df

    def train(self):
        df = self.generate_synthetic_training_data()
        X = df[self.feature_names]
        y = df["failure_label"]

        # Held-out train/test split (80/20)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=self.random_state
        )

        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)

        self.test_accuracy = float(accuracy_score(y_test, y_pred))
        self.test_f1 = float(f1_score(y_test, y_pred))

        importances = self.model.feature_importances_
        self.feature_importances = {
            name: round(float(imp), 4) for name, imp in zip(self.feature_names, importances)
        }
        self.is_trained = True
        print(f"[+] Asset Failure ML Model Trained. Test Accuracy: {self.test_accuracy:.4f}, Test F1: {self.test_f1:.4f}")
        return {
            "test_accuracy": self.test_accuracy,
            "test_f1": self.test_f1,
            "feature_importances": self.feature_importances
        }

    def predict_urgency(self, metrics_dict):
        if not self.is_trained:
            self.train()

        input_data = pd.DataFrame([{
            "days_since_last_maint": metrics_dict.get("days_since_last_maint", 45),
            "cumulative_load_tonnage": metrics_dict.get("cumulative_load_tonnage", 20.0),
            "vibration_index": metrics_dict.get("vibration_index", 1.5),
            "temp_fluctuation_c": metrics_dict.get("temp_fluctuation_c", 15.0),
            "switch_operations_count": metrics_dict.get("switch_operations_count", 2500)
        }])

        prob = self.model.predict_proba(input_data)[0][1]
        return float(prob)


if __name__ == "__main__":
    predictor = AssetFailurePredictor()
    results = predictor.train()
    print("Feature Importances:", results["feature_importances"])
