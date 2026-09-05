import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("data/synthetic_forecast.csv")

X = df.drop(columns=["forecast_tonnes"])
y = df["forecast_tonnes"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = GradientBoostingRegressor(random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
print("Forecast Model MAE:", round(mae, 1), "tonnes")

joblib.dump({"model": model, "columns": list(X.columns)}, "models/forecast_v1.pkl")
print("Saved models/forecast_v1.pkl")