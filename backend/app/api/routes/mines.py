from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.mine import Mine
from app.schemas.mine import MineOut

router = APIRouter(prefix="/mines", tags=["mines"])

@router.get("", response_model=list[MineOut])
def list_mines(db: Session = Depends(get_db)):
    return db.query(Mine).all()

@router.get("/{mine_id}", response_model=MineOut)
def get_mine(mine_id: str, db: Session = Depends(get_db)):
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if not mine:
        raise HTTPException(status_code=404, detail="Mine not found")
    return mine