from pydantic import BaseModel

class ProductionOut(BaseModel):
    mine_id: str
    period: str
    planned_tonnes: float
    actual_tonnes: float

    class Config:
        from_attributes = True