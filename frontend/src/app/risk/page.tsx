"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMines, getForecast } from "@/lib/api";
import { Mine, Forecast } from "@/lib/types";

export default function RiskPage() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    getMines().then(setMines);
    getForecast().then((f) => setForecasts([...f].sort((a, b) => b.risk_score - a.risk_score)));
  }, []);

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Risk Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">All mines ranked by production shortfall risk</p>
      </div>

      <div className="space-y-3">
        {forecasts.map((f) => {
          const mine = mines.find((m) => m.id === f.mine_id);
          const riskColor =
            f.risk_level === "High" ? "border-l-red-500" :
            f.risk_level === "Medium" ? "border-l-amber-500" : "border-l-emerald-500";
          return (
            <Link key={f.mine_id} href={`/mines/${f.mine_id}`}>
              <div className={`bg-white rounded-xl shadow-sm border border-gray-100 border-l-4 ${riskColor} p-4 flex items-center justify-between hover:shadow-md transition-shadow`}>
                <div>
                  <p className="font-semibold text-slate-900">{mine?.name ?? f.mine_id}</p>
                  <p className="text-sm text-gray-500">{mine?.state}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Risk Score</p>
                  <p className="text-xl font-bold text-slate-900">{f.risk_score}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}