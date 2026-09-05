from sqlalchemy import Column, String, Integer, ForeignKey
from app.db.session import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=False)
    risk_level = Column(String, nullable=False)
    primary_cause = Column(String, nullable=False)
    recommendation_text = Column(String, nullable=False)