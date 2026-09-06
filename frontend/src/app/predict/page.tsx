"use client";
import { useState } from "react";
import { predictProspectivity, predictForecast } from "@/lib/api";

const FIELD_LABELS: Record<string, string> = {
  lat: "Latitude",
  lng: "Longitude",
  elevation: "Elevation (m)",
  slope_deg: "Slope (degrees)",
  drainage_density: "Drainage density",
  ndvi: "NDVI",
  ndwi: "NDWI",
  land_surface_temp: "Land surface temp (°C)",
  mineral_alteration_index: "Mineral alteration index",
  mn_ppm_soil: "Mn in soil (ppm)",
  magnetic_anomaly_nt: "Magnetic anomaly (nT)",
  distance_to_fault_km: "Distance to fault (km)",
  distance_to_known_mine_km: "Distance to known mine (km)",
  historical_avg: "Historical avg (tonnes)",
  planned_tonnes: "Planned tonnes",
  downtime_hours: "Downtime (hours)",
  rainfall: "Rainfall (mm)",
};

function scoreColor(score: number) {
  if (score >= 0.6) return { bg: "bg-emerald-50", text: "text-emerald-700", label: "High potential" };
  if (score >= 0.3) return { bg: "bg-amber-50", text: "text-amber-700", label: "Moderate potential" };
  return { bg: "bg-gray-50", text: "text-gray-600", label: "Low potential" };
}

function shortfallColor(pct: number) {
  if (pct >= 20) return { bg: "bg-red-50", text: "text-red-700", label: "High shortfall risk" };
  if (pct >= 8) return { bg: "bg-amber-50", text: "text-amber-700", label: "Moderate shortfall risk" };
  return { bg: "bg-emerald-50", text: "text-emerald-700", label: "On track" };
}

export default function PredictPage() {
  const [prospectivityInput, setProspectivityInput] = useState({
    lat: 21.8,
    lng: 80.18,
    elevation: 400,
    slope_deg: 6,
    drainage_density: 0.6,
    ndvi: 0.5,
    ndwi: 0.2,
    land_surface_temp: 30,
    mineral_alteration_index: 0.4,
    mn_ppm_soil: 500,
    magnetic_anomaly_nt: 15,
    distance_to_fault_km: 5,
    distance_to_known_mine_km: 100,
    geology_type: "archean",
  });
  const [prospectivityResult, setProspectivityResult] = useState<any>(null);

  const [forecastInput, setForecastInput] = useState({
    historical_avg: 10000,
    planned_tonnes: 12000,
    downtime_hours: 100,
    rainfall: 1200,
    mine_type: "underground",
  });
  const [forecastResult, setForecastResult] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);

  const handleProspectivitySubmit = async () => {
    setError(null);
    try {
      const result = await predictProspectivity(prospectivityInput);
      setProspectivityResult(result);
    } catch {
      setError("Prospectivity prediction failed. Check backend is running.");
    }
  };

  const handleForecastSubmit = async () => {
    setError(null);
    try {
      const result = await predictForecast(forecastInput);
      setForecastResult(result);
    } catch {
      setError("Forecast prediction failed. Check backend is running.");
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Live prediction</h1>
        <p className="text-sm text-gray-500 mt-1">
          Run the trained models directly against custom inputs
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="font-semibold text-slate-900">Prospectivity model</h2>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(prospectivityInput).map(([key, value]) =>
              key === "geology_type" ? (
                <div key={key} className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Geology type
                  </label>
                  <select
                    value={value as string}
                    onChange={(e) =>
                      setProspectivityInput({
                        ...prospectivityInput,
                        geology_type: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-900"
                  >
                    <option value="archean">archean</option>
                    <option value="gondite_archean">gondite_archean</option>
                    <option value="kodurite_archean">kodurite_archean</option>
                    <option value="laterite">laterite</option>
                  </select>
                </div>
              ) : (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {FIELD_LABELS[key] ?? key}
                  </label>
                  <input
                    type="number"
                    value={value as number}
                    onChange={(e) =>
                      setProspectivityInput({
                        ...prospectivityInput,
                        [key]: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
              )
            )}
          </div>

          <button
            onClick={handleProspectivitySubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Predict prospectivity
          </button>

          {prospectivityResult && (
            <div className={`${scoreColor(prospectivityResult.prospectivity_score).bg} rounded-xl p-5 mt-3`}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-3xl font-bold text-slate-900">
                  {(prospectivityResult.prospectivity_score * 100).toFixed(0)}%
                </span>
                <span className={`text-sm font-semibold ${scoreColor(prospectivityResult.prospectivity_score).text}`}>
                  {scoreColor(prospectivityResult.prospectivity_score).label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Prospectivity score</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Confidence</p>
                  <p className="font-medium text-slate-900">
                    {(prospectivityResult.confidence * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reserve range</p>
                  <p className="font-medium text-slate-900">
                    {prospectivityResult.reserve_min?.toLocaleString()} –{" "}
                    {prospectivityResult.reserve_max?.toLocaleString()} t
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3">
          <h2 className="font-semibold text-slate-900">Forecast model</h2>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(forecastInput).map(([key, value]) =>
              key === "mine_type" ? (
                <div key={key} className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Mine type
                  </label>
                  <select
                    value={value as string}
                    onChange={(e) =>
                      setForecastInput({ ...forecastInput, mine_type: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-900"
                  >
                    <option value="underground">underground</option>
                    <option value="opencast">opencast</option>
                  </select>
                </div>
              ) : (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    {FIELD_LABELS[key] ?? key}
                  </label>
                  <input
                    type="number"
                    value={value as number}
                    onChange={(e) =>
                      setForecastInput({
                        ...forecastInput,
                        [key]: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
              )
            )}
          </div>

          <button
            onClick={handleForecastSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Predict forecast
          </button>

          {forecastResult && (
            <div className={`${shortfallColor(forecastResult.shortfall_pct).bg} rounded-xl p-5 mt-3`}>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-3xl font-bold text-slate-900">
                  {forecastResult.forecast_tonnes?.toLocaleString()} t
                </span>
                <span className={`text-sm font-semibold ${shortfallColor(forecastResult.shortfall_pct).text}`}>
                  {shortfallColor(forecastResult.shortfall_pct).label}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">Forecast production</p>
              <div>
                <p className="text-xs text-gray-500">Shortfall vs planned</p>
                <p className="font-medium text-slate-900">{forecastResult.shortfall_pct}%</p>
                <div className="h-1.5 bg-white rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      forecastResult.shortfall_pct >= 20
                        ? "bg-red-500"
                        : forecastResult.shortfall_pct >= 8
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(forecastResult.shortfall_pct, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}