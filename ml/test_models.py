import joblib
import pandas as pd

prospectivity_bundle = joblib.load("models/prospectivity_v1.pkl")
forecast_bundle = joblib.load("models/forecast_v1.pkl")

# Test prospectivity
sample = pd.DataFrame([{
    "lat": 21.8, "lng": 80.18, "elevation": 400, "ndvi": 0.6,
    "land_surface_temp": 30, "soil_moisture": 0.2, "rainfall": 1200,
    "geology_type_archean": 1, "geology_type_deccan_trap": 0,
    "geology_type_gondwana": 0, "geology_type_laterite": 0,
}]).reindex(columns=prospectivity_bundle["columns"], fill_value=0)
print("Prospectivity score:", prospectivity_bundle["model"].predict(sample)[0])

# Test forecast
sample2 = pd.DataFrame([{
    "historical_avg": 10000, "planned_tonnes": 12000,
    "downtime_hours": 120, "rainfall": 1200,
}]).reindex(columns=forecast_bundle["columns"], fill_value=0)
print("Forecast tonnes:", forecast_bundle["model"].predict(sample2)[0])