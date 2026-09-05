from sqlalchemy import Column, String, Float, Integer, ForeignKey
from app.db.session import Base

class RiskFactor(Base):
    __tablename__ = "risk_factors"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=False)
    name = Column(String, nullable=False)
    weight_pct = Column(Float, nullable=False)
    value = Column(Float, nullable=False)