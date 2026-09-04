export interface Mine {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  status: string;
  type: string;
}

export interface ProductionRecord {
  mine_id: string;
  period: string;
  planned_tonnes: number;
  actual_tonnes: number;
}

export interface Forecast {
  mine_id: string;
  period: string;
  planned_tonnes: number;
  forecast_tonnes: number;
  shortfall_pct: number;
  risk_score: number;
  risk_level: "Low" | "Medium" | "High";
}

export interface RiskFactor {
  name: string;
  weight_pct: number;
  value: number;
}

export interface RiskEntry {
  mine_id: string;
  factors: RiskFactor[];
}