from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationOut

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.get("", response_model=list[RecommendationOut])
def list_recommendations(db: Session = Depends(get_db)):
    recs = db.query(Recommendation).all()
    return [
        {
            "mine_id": r.mine_id,
            "risk_level": r.risk_level,
            "primary_cause": r.primary_cause,
            "recommendation": r.recommendation_text,
        }
        for r in recs
    ]

@router.get("/{mine_id}", response_model=list[RecommendationOut])
def get_recommendations(mine_id: str, db: Session = Depends(get_db)):
    recs = db.query(Recommendation).filter(Recommendation.mine_id == mine_id).all()
    return [
        {
            "mine_id": r.mine_id,
            "risk_level": r.risk_level,
            "primary_cause": r.primary_cause,
            "recommendation": r.recommendation_text,
        }
        for r in recs
    ]