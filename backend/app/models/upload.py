from sqlalchemy import Column, String, Integer, DateTime
from datetime import datetime
from app.db.session import Base

class UploadedDataset(Base):
    __tablename__ = "uploaded_datasets"

    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="processing")
    row_count = Column(Integer, default=0)