from sqlalchemy import Column, String, Float, Integer, ForeignKey
from app.db.session import Base

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=False)
    period = Column(String, nullable=False)
    planned_tonnes = Column(Float, nullable=False)
    forecast_tonnes = Column(Float, nullable=False)
    shortfall_pct = Column(Float, nullable=False)
    risk_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)