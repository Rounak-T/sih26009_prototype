"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getMines, getRecommendations } from "@/lib/api";
import { Mine, Recommendation } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

export default function RecommendationsPage() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    getMines().then(setMines);
    getRecommendations().then(setRecommendations);
  }, []);

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1">Actionable steps generated from current risk factors</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => {
          const mine = mines.find((m) => m.id === rec.mine_id);
          return (
            <Link key={i} href={`/mines/${rec.mine_id}`}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow flex gap-4">
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 h-fit">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {mine?.name ?? rec.mine_id} • {rec.risk_level} Risk
                  </p>
                  <p className="text-sm font-medium text-slate-800 mt-1">
                    Primary cause: {rec.primary_cause}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                </div>
              </div>
            </Link>
          );
        })}
        {recommendations.length === 0 && (
          <p className="text-sm text-gray-400">No recommendations available yet.</p>
        )}
      </div>
    </div>
  );
}