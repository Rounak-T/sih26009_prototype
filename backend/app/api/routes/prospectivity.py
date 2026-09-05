import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.prospectivity import ProspectivityZone

router = APIRouter(prefix="/prospectivity", tags=["prospectivity"])

@router.get("")
def get_prospectivity(db: Session = Depends(get_db)):
    zones = db.query(ProspectivityZone).all()
    features = []
    for z in zones:
        features.append({
            "type": "Feature",
            "geometry": json.loads(z.geometry),
            "properties": {
                "prospectivity_score": z.prospectivity_score,
                "confidence": z.confidence,
                "reserve_min": z.reserve_min,
                "reserve_max": z.reserve_max,
            },
        })
    return {"type": "FeatureCollection", "features": features}