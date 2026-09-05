from pydantic import BaseModel

class MineOut(BaseModel):
    id: str
    name: str
    state: str
    lat: float
    lng: float
    status: str
    type: str

    class Config:
        from_attributes = True