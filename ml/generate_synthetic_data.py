import numpy as np
import pandas as pd
import os

np.random.seed(42)
os.makedirs("data", exist_ok=True)

# ---------- Prospectivity dataset ----------
n = 500
df1 = pd.DataFrame({
    "lat": np.random.uniform(15, 24, n),
    "lng": np.random.uniform(75, 86, n),
    "elevation": np.random.uniform(100, 900, n),
    "ndvi": np.random.uniform(0.1, 0.8, n),
    "land_surface_temp": np.random.uniform(20, 40, n),
    "soil_moisture": np.random.uniform(0.05, 0.4, n),
    "rainfall": np.random.uniform(500, 2000, n),
    "geology_type": np.random.choice(["laterite", "gondwana", "archean", "deccan_trap"], n),
})

geology_boost = df1["geology_type"].map({"archean": 0.3, "gondwana": 0.15, "laterite": 0.1, "deccan_trap": 0.0})
df1["prospectivity_score"] = (
    0.4 * df1["ndvi"] + 0.3 * geology_boost + 0.1 * df1["soil_moisture"]
    + np.random.normal(0, 0.08, n)
).clip(0, 1)

df1.to_csv("data/synthetic_prospectivity.csv", index=False)
print("Prospectivity dataset created:", df1.shape)

# ---------- Production shortfall dataset ----------
n2 = 500
df2 = pd.DataFrame({
    "historical_avg": np.random.uniform(5000, 15000, n2),
    "planned_tonnes": np.random.uniform(6000, 16000, n2),
    "downtime_hours": np.random.uniform(0, 300, n2),
    "rainfall": np.random.uniform(500, 2000, n2),
})

# more downtime + more rainfall => bigger gap between planned and actual forecast
downtime_penalty = df2["downtime_hours"] / 300 * 0.25
rainfall_penalty = (df2["rainfall"] - 500) / 1500 * 0.1
df2["forecast_tonnes"] = (
    df2["planned_tonnes"] * (1 - downtime_penalty - rainfall_penalty)
    + np.random.normal(0, 300, n2)
).clip(lower=0)

df2.to_csv("data/synthetic_forecast.csv", index=False)
print("Forecast dataset created:", df2.shape)