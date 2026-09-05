"use client";
import { useEffect, useState } from "react";
import { getMines, getForecast } from "@/lib/api";
import { Mine, Forecast } from "@/lib/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProductionPage() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);

  useEffect(() => {
    getMines().then(setMines);
    getForecast().then(setForecasts);
  }, []);

  const chartData = forecasts.map((f) => {
    const mine = mines.find((m) => m.id === f.mine_id);
    return {
      name: mine?.name ?? f.mine_id,
      Planned: f.planned_tonnes,
      Forecast: f.forecast_tonnes,
    };
  });

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Production Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Planned vs forecast production across all active mines</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="Planned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Forecast" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}