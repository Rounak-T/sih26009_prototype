from fastapi import APIRouter
from pydantic import BaseModel
from typing import Literal
from app.services.ml_service import predict_prospectivity, predict_forecast

router = APIRouter(prefix="/predict", tags=["predict"])


class ProspectivityInput(BaseModel):
    lat: float
    lng: float
    elevation: float
    slope_deg: float
    drainage_density: float
    ndvi: float
    ndwi: float
    land_surface_temp: float
    mineral_alteration_index: float
    mn_ppm_soil: float
    magnetic_anomaly_nt: float
    distance_to_fault_km: float
    distance_to_known_mine_km: float
    geology_type: Literal["archean", "gondite_archean", "kodurite_archean", "laterite"]


class ForecastInput(BaseModel):
    historical_avg: float
    planned_tonnes: float
    downtime_hours: float
    rainfall: float
    mine_type: Literal["opencast", "underground"]


@router.post("/prospectivity")
def predict_prospectivity_endpoint(data: ProspectivityInput):
    return predict_prospectivity(data.dict())


@router.post("/forecast")
def predict_forecast_endpoint(data: ForecastInput):
    return predict_forecast(data.dict())