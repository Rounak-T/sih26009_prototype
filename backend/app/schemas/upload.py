from pydantic import BaseModel
from datetime import datetime

class UploadStatusOut(BaseModel):
    job_id: int
    status: str
    row_count: int
    filename: str

    class Config:
        from_attributes = True