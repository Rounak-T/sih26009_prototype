import { Mine, ProductionRecord, Forecast, RiskEntry } from "./types";

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