from pydantic import BaseModel

class RecommendationOut(BaseModel):
    mine_id: str
    risk_level: str
    primary_cause: str
    recommendation: str

    class Config:
        from_attributes = True