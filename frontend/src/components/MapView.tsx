"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "@/lib/leaflet-fix";
import { getMines, getProspectivity } from "@/lib/api";
import { Mine } from "@/lib/types";
import type { Feature } from "geojson";

export default function MapView() {
  const [mines, setMines] = useState<Mine[]>([]);
  const [prospectivity, setProspectivity] = useState<GeoJSON.FeatureCollection | null>(null);

  useEffect(() => {
    getMines().then(setMines);
    getProspectivity().then(setProspectivity);
  }, []);

  const styleByScore = (feature?: Feature) => {
    const score = feature?.properties?.prospectivity_score ?? 0;
    return {
      fillColor: score > 0.6 ? "#059669" : score > 0.3 ? "#f59e0b" : "#fde68a",
      fillOpacity: 0.5,
      color: "#374151",
      weight: 1,
    };
  };

  return (
    <MapContainer center={[22.9, 79.5]} zoom={6} className="h-full w-full rounded-xl">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {prospectivity && (
        <GeoJSON
          data={prospectivity}
          style={styleByScore}
          onEachFeature={(feature, layer) => {
            const p = feature.properties;
            layer.bindPopup(
              `<strong>Prospectivity: ${(p.prospectivity_score * 100).toFixed(0)}%</strong><br/>Confidence: ${(p.confidence * 100).toFixed(0)}%<br/>Reserve: ${p.reserve_min.toLocaleString()} - ${p.reserve_max.toLocaleString()} t`
            );
          }}
        />
      )}
      {mines.map((mine) => (
        <Marker key={mine.id} position={[mine.lat, mine.lng]}>
          <Popup>
            <strong>{mine.name}</strong>
            <br />
            {mine.state}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}