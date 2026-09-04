"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function MapPage() {
  return (
    <div className="p-8 h-screen flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Prospectivity Map</h1>
        <p className="text-sm text-gray-500 mt-1">Green zones indicate higher manganese prospectivity</p>
      </div>
      <div className="flex-1 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
        <MapView />
      </div>
    </div>
  );
}