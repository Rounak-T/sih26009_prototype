from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.forecast import Forecast
from app.schemas.forecast import ForecastOut

router = APIRouter(prefix="/forecast", tags=["forecast"])

@router.get("", response_model=list[ForecastOut])
def list_forecasts(db: Session = Depends(get_db)):
    return db.query(Forecast).all()

@router.get("/{mine_id}", response_model=ForecastOut)
def get_forecast(mine_id: str, db: Session = Depends(get_db)):
    forecast = db.query(Forecast).filter(Forecast.mine_id == mine_id).first()
    if not forecast:
        raise HTTPException(status_code=404, detail="Forecast not found")
    return forecast