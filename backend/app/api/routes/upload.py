import pandas as pd
import io
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.upload import UploadedDataset
from app.models.production import ProductionRecord

router = APIRouter(prefix="/upload", tags=["upload"])

REQUIRED_COLUMNS = {"mine_id", "period", "planned_tonnes", "actual_tonnes"}

@router.post("")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=422, detail="Only CSV files are supported right now")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=422, detail="Could not parse file as CSV")

    missing_cols = REQUIRED_COLUMNS - set(df.columns)
    if missing_cols:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required columns: {', '.join(missing_cols)}",
        )

    dataset = UploadedDataset(filename=file.filename, status="processing", row_count=len(df))
    db.add(dataset)
    db.commit()
    db.refresh(dataset)

    # Insert rows into production_records
    for _, row in df.iterrows():
        db.add(ProductionRecord(
            mine_id=row["mine_id"],
            period=row["period"],
            planned_tonnes=float(row["planned_tonnes"]),
            actual_tonnes=float(row["actual_tonnes"]),
        ))

    dataset.status = "complete"
    db.commit()

    return {
        "job_id": dataset.id,
        "status": dataset.status,
        "row_count": dataset.row_count,
        "filename": dataset.filename,
    }

@router.get("/{job_id}/status")
def get_upload_status(job_id: int, db: Session = Depends(get_db)):
    dataset = db.query(UploadedDataset).filter(UploadedDataset.id == job_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "job_id": dataset.id,
        "status": dataset.status,
        "row_count": dataset.row_count,
        "filename": dataset.filename,
    }