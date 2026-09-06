import { Mine, ProductionRecord, Forecast, RiskEntry, Recommendation } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getMines(): Promise<Mine[]> {
  const res = await fetch(`${API_URL}/mines`);
  return res.json();
}

export async function getMine(id: string): Promise<Mine> {
  const res = await fetch(`${API_URL}/mines/${id}`);
  return res.json();
}

export async function getProduction(mineId?: string): Promise<ProductionRecord[]> {
  if (mineId) {
    const res = await fetch(`${API_URL}/production/${mineId}`);
    return res.json();
  }
  // no "list all production" endpoint yet — fetch per mine when needed
  return [];
}

export async function getForecast(mineId?: string): Promise<Forecast[]> {
  if (mineId) {
    const res = await fetch(`${API_URL}/forecast/${mineId}`);
    const single = await res.json();
    return [single];
  }
  const res = await fetch(`${API_URL}/forecast`);
  return res.json();
}

export async function getRisks(mineId: string): Promise<RiskEntry[]> {
  const res = await fetch(`${API_URL}/risks/${mineId}`);
  const single = await res.json();
  return [single];
}

export async function getRecommendations(mineId?: string): Promise<Recommendation[]> {
  const url = mineId ? `${API_URL}/recommendations/${mineId}` : `${API_URL}/recommendations`;
  const res = await fetch(url);
  return res.json();
}

export async function getProspectivity(): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch(`${API_URL}/prospectivity`);
  return res.json();
}

export async function uploadFile(file: File): Promise<{ job_id: number; status: string; row_count: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}

export async function predictProspectivity(features: {
  lat: number; lng: number; elevation: number; slope_deg: number;
  drainage_density: number; ndvi: number; ndwi: number; land_surface_temp: number;
  mineral_alteration_index: number; mn_ppm_soil: number; magnetic_anomaly_nt: number;
  distance_to_fault_km: number; distance_to_known_mine_km: number; geology_type: string;
}) {
  const res = await fetch(`${API_URL}/predict/prospectivity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}

export async function predictForecast(features: {
  historical_avg: number; planned_tonnes: number; downtime_hours: number;
  rainfall: number; mine_type: string;
}) {
  const res = await fetch(`${API_URL}/predict/forecast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}