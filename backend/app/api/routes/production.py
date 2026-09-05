from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.production import ProductionRecord
from app.schemas.production import ProductionOut

router = APIRouter(prefix="/production", tags=["production"])

@router.get("/{mine_id}", response_model=list[ProductionOut])
def get_production(mine_id: str, db: Session = Depends(get_db)):
    return db.query(ProductionRecord).filter(ProductionRecord.mine_id == mine_id).all()