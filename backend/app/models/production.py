from sqlalchemy import Column, String, Float, Integer, ForeignKey
from app.db.session import Base

class ProductionRecord(Base):
    __tablename__ = "production_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    mine_id = Column(String, ForeignKey("mines.id"), nullable=False)
    period = Column(String, nullable=False)
    planned_tonnes = Column(Float, nullable=False)
    actual_tonnes = Column(Float, nullable=False)