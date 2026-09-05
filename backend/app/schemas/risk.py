from pydantic import BaseModel

class RiskFactorOut(BaseModel):
    name: str
    weight_pct: float
    value: float

    class Config:
        from_attributes = True

class RiskOut(BaseModel):
    mine_id: str
    factors: list[RiskFactorOut]