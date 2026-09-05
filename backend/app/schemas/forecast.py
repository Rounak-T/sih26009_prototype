from pydantic import BaseModel

class ForecastOut(BaseModel):
    mine_id: str
    period: str
    planned_tonnes: float
    forecast_tonnes: float
    shortfall_pct: float
    risk_score: float
    risk_level: str

    class Config:
        from_attributes = True