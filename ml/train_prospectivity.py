import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

df = pd.read_csv("data/synthetic_prospectivity.csv")
df = pd.get_dummies(df, columns=["geology_type"])

X = df.drop(columns=["prospectivity_score"])
y = df["prospectivity_score"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
print("Prospectivity Model MAE:", round(mae, 4))

joblib.dump({"model": model, "columns": list(X.columns)}, "models/prospectivity_v1.pkl")
print("Saved models/prospectivity_v1.pkl")