from sqlalchemy import Column, String, Float
from app.db.session import Base

class Mine(Base):
    __tablename__ = "mines"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    state = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    status = Column(String, default="active")
    type = Column(String, default="existing_mine")