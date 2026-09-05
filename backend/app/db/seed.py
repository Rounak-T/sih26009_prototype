import json
import os
from app.db.session import SessionLocal
from app.models.mine import Mine
from app.models.production import ProductionRecord
from app.models.forecast import Forecast
from app.models.risk import RiskFactor
from app.models.recommendation import Recommendation
from app.models.prospectivity import ProspectivityZone

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "mock")

def load_json(filename):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "r") as f:
        return json.load(f)

def seed():
    db = SessionLocal()
    try:
        # Clear existing data (children first, then parent)
        db.query(RiskFactor).delete()
        db.query(Recommendation).delete()
        db.query(Forecast).delete()
        db.query(ProductionRecord).delete()
        db.query(ProspectivityZone).delete()
        db.query(Mine).delete()
        db.commit()

        # Step 1: insert mines FIRST and commit immediately
        for m in load_json("mines.json"):
            db.add(Mine(**m))
        db.commit()
        print("Mines seeded.")

        # Step 2: now insert everything that depends on mines existing
        for p in load_json("production.json"):
            db.add(ProductionRecord(**p))

        for f in load_json("forecast.json"):
            db.add(Forecast(**f))

        for r in load_json("risks.json"):
            for factor in r["factors"]:
                db.add(RiskFactor(mine_id=r["mine_id"], **factor))

        for rec in load_json("recommendations.json"):
            db.add(Recommendation(
                mine_id=rec["mine_id"],
                risk_level=rec["risk_level"],
                primary_cause=rec["primary_cause"],
                recommendation_text=rec["recommendation"],
            ))

        prospectivity_geojson = load_json("prospectivity.geojson")
        for feature in prospectivity_geojson["features"]:
            props = feature["properties"]
            db.add(ProspectivityZone(
                geometry=json.dumps(feature["geometry"]),
                prospectivity_score=props["prospectivity_score"],
                confidence=props["confidence"],
                reserve_min=props.get("reserve_min"),
                reserve_max=props.get("reserve_max"),
            ))

        db.commit()
        print("Seed complete.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()