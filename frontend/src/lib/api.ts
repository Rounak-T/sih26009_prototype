import { Mine, ProductionRecord, Forecast, RiskEntry, Recommendation } from "./types";

export async function getMines(): Promise<Mine[]> {
  const res = await fetch("/data/mines.json");
  return res.json();
}

export async function getProduction(): Promise<ProductionRecord[]> {
  const res = await fetch("/data/production.json");
  return res.json();
}

export async function getForecast(): Promise<Forecast[]> {
  const res = await fetch("/data/forecast.json");
  return res.json();
}

export async function getRisks(): Promise<RiskEntry[]> {
  const res = await fetch("/data/risks.json");
  return res.json();
}

export async function getProspectivity(): Promise<GeoJSON.FeatureCollection> {
  const res = await fetch("/data/prospectivity.geojson");
  return res.json();
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const res = await fetch("/data/recommendations.json");
  return res.json();
}