import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  accent: "amber" | "red" | "emerald" | "blue";
}

const accentMap = {
  amber: "border-l-amber-500 bg-amber-50 text-amber-600",
  red: "border-l-red-500 bg-red-50 text-red-600",
  emerald: "border-l-emerald-500 bg-emerald-50 text-emerald-600",
  blue: "border-l-blue-500 bg-blue-50 text-blue-600",
};

export default function KPICard({ label, value, sublabel, icon: Icon, accent }: KPICardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 border border-gray-100 border-l-4 ${accentMap[accent].split(" ")[0]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{value}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-1">{sublabel}</p>}
        </div>
        <div className={`p-2.5 rounded-lg ${accentMap[accent].split(" ").slice(1).join(" ")}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}