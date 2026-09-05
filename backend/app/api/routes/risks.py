from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.risk import RiskFactor
from app.schemas.risk import RiskOut

router = APIRouter(prefix="/risks", tags=["risks"])

@router.get("/{mine_id}", response_model=RiskOut)
def get_risks(mine_id: str, db: Session = Depends(get_db)):
    factors = db.query(RiskFactor).filter(RiskFactor.mine_id == mine_id).all()
    return {"mine_id": mine_id, "factors": factors}