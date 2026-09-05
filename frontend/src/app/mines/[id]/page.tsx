"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getMines, getProduction, getForecast, getRisks, getRecommendations } from "@/lib/api";
import { Mine, ProductionRecord, Forecast, RiskEntry, Recommendation } from "@/lib/types";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { AlertTriangle } from "lucide-react";

export default function MineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [mine, setMine] = useState<Mine | null>(null);
  const [production, setProduction] = useState<ProductionRecord[]>([]);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [risk, setRisk] = useState<RiskEntry | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    getMines().then((mines) => setMine(mines.find((m) => m.id === id) ?? null));
    getProduction().then((prod) => setProduction(prod.filter((p) => p.mine_id === id)));
    getForecast().then((f) => setForecast(f.find((x) => x.mine_id === id) ?? null));
    getRisks().then((r) => setRisk(r.find((x) => x.mine_id === id) ?? null));
    getRecommendations().then((recs) => setRecommendations(recs.filter((r) => r.mine_id === id)));
  }, [id]);

  if (!mine) return <div className="p-8 text-gray-500">Loading mine details...</div>;

  const riskColor =
    forecast?.risk_level === "High" ? "bg-red-100 text-red-700" :
    forecast?.risk_level === "Medium" ? "bg-amber-100 text-amber-700" :
    "bg-emerald-100 text-emerald-700";

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{mine.name}</h1>
          <p className="text-sm text-gray-500 mt-1">{mine.state} • {mine.status}</p>
        </div>
        {forecast && (
          <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${riskColor}`}>
            {forecast.risk_level} Risk
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Production: Planned vs Actual</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={production}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="period" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="planned_tonnes" fill="#94a3b8" name="Planned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual_tonnes" fill="#0ea5e9" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Risk Factor Breakdown</h2>
          {risk ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={risk.factors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" width={140} fontSize={12} />
                <Tooltip />
                <Bar dataKey="weight_pct" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400">No risk data available</p>
          )}
        </div>
      </div>

      {forecast && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-900 mb-2">Next Period Forecast — {forecast.period}</h2>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div>
              <p className="text-xs text-gray-500">Planned</p>
              <p className="text-xl font-bold text-slate-900">{forecast.planned_tonnes.toLocaleString()} t</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Forecast</p>
              <p className="text-xl font-bold text-slate-900">{forecast.forecast_tonnes.toLocaleString()} t</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Shortfall</p>
              <p className="text-xl font-bold text-red-600">{forecast.shortfall_pct}%</p>
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Recommendations</h2>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Primary cause: {rec.primary_cause}</p>
                  <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}