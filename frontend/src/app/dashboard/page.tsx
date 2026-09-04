"use client";
import { useEffect, useState } from "react";
import { getMines } from "@/lib/api";
import { Mine } from "@/lib/types";

export default function DashboardPage() {
  const [mines, setMines] = useState<Mine[]>([]);

  useEffect(() => {
    getMines().then(setMines);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>{mines.length} mines loaded</p>
    </div>
  );
}