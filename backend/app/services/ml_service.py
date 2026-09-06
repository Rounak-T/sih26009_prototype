import joblib
import pandas as pd
import os

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "ml_models")

_prospectivity_bundle = joblib.load(os.path.join(MODELS_DIR, "prospectivity_v2.pkl"))
_forecast_bundle = joblib.load(os.path.join(MODELS_DIR, "forecast_v2.pkl"))


def predict_prospectivity(features: dict) -> dict:
    """
    features keys expected: lat, lng, elevation, slope_deg, drainage_density,
    ndvi, ndwi, land_surface_temp, mineral_alteration_index, mn_ppm_soil,
    magnetic_anomaly_nt, distance_to_fault_km, distance_to_known_mine_km,
    geology_type (one of: archean, gondite_archean, kodurite_archean, laterite)
    """
    df = pd.DataFrame([features])
    df = pd.get_dummies(df, columns=["geology_type"])
    df = df.reindex(columns=_prospectivity_bundle["columns"], fill_value=0)

    score = float(_prospectivity_bundle["model"].predict(df)[0])
    score = max(0.0, min(1.0, score))

    return {
        "prospectivity_score": round(score, 3),
        "confidence": 0.6,
        "reserve_min": int(score * 200000),
        "reserve_max": int(score * 400000),
    }


def predict_forecast(features: dict) -> dict:
    """
    features keys expected: historical_avg, planned_tonnes, downtime_hours,
    rainfall, mine_type (one of: opencast, underground)
    """
    df = pd.DataFrame([features])
    df = pd.get_dummies(df, columns=["mine_type"])
    df = df.reindex(columns=_forecast_bundle["columns"], fill_value=0)

    forecast_tonnes = float(_forecast_bundle["model"].predict(df)[0])
    forecast_tonnes = max(0.0, forecast_tonnes)

    planned = features.get("planned_tonnes", forecast_tonnes)
    shortfall_pct = round(max(0.0, (planned - forecast_tonnes) / planned * 100), 1) if planned else 0.0

    return {
        "forecast_tonnes": round(forecast_tonnes, 1),
        "shortfall_pct": shortfall_pct,
    }