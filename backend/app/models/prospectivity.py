from sqlalchemy import Column, String, Float, Integer
from app.db.session import Base

class ProspectivityZone(Base):
    __tablename__ = "prospectivity_zones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    geometry = Column(String, nullable=False)  # stored as GeoJSON string for now
    prospectivity_score = Column(Float, nullable=False)
    confidence = Column(Float, nullable=False)
    reserve_min = Column(Float)
    reserve_max = Column(Float)