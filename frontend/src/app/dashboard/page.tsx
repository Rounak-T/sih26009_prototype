"use client";
import { useEffect, useState } from "react";
import { getMines, getForecast } from "@/lib/api";
import { Mine, Forecast } from "@/lib/types";
import KPICard from "@/components/KPICard";
import { Mountain, AlertTriangle, TrendingDown, MapPinned } from "lucide-react";

export default function DashboardPage() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    getMines().then(setMines);
    getForecast().then(setForecasts);
  }, []);

  const highRiskCount = forecasts.filter((f) => f.risk_level === "High").length;
  const avgShortfall =
    forecasts.length > 0
      ? (forecasts.reduce((sum, f) => sum + f.shortfall_pct, 0) / forecasts.length).toFixed(1)
      : "0";

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mining Intelligence Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time manganese prospectivity and production risk across active sites</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard label="Total Mines" value={mines.length} icon={Mountain} accent="blue" />
        <KPICard label="High Risk Mines" value={highRiskCount} icon={AlertTriangle} accent="red" />
        <KPICard label="Avg Shortfall" value={`${avgShortfall}%`} icon={TrendingDown} accent="amber" />
        <KPICard label="High-Potential Zones" value={12} sublabel="from prospectivity map" icon={MapPinned} accent="emerald" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Top Risk Mines</h2>
          <span className="text-xs text-gray-400">{forecasts.length} mines tracked</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 text-gray-500 text-left uppercase text-xs tracking-wide">
            <tr>
              <th className="px-5 py-3 font-medium">Mine</th>
              <th className="px-5 py-3 font-medium">State</th>
              <th className="px-5 py-3 font-medium">Risk Level</th>
              <th className="px-5 py-3 font-medium">Shortfall %</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((f) => {
              const mine = mines.find((m) => m.id === f.mine_id);
              return (
                <tr key={f.mine_id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{mine?.name ?? f.mine_id}</td>
                  <td className="px-5 py-3.5 text-gray-500">{mine?.state ?? "-"}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        f.risk_level === "High"
                          ? "bg-red-100 text-red-700"
                          : f.risk_level === "Medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {f.risk_level}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 font-medium">{f.shortfall_pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}