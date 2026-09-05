export default function AboutPage() {
  return (
    <div className="p-8 max-w-3xl space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">About This Prototype</h1>
        <p className="text-sm text-gray-500 mt-1">SIH26009 — Manganese Reserve & Production Intelligence Platform</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4 text-sm text-gray-700 leading-relaxed">
        <div>
          <h2 className="font-semibold text-slate-900 mb-1">What this platform does</h2>
          <p>Combines geological, satellite/remote-sensing, and production data to identify potential manganese reserves and predict production shortfalls at active mines, surfacing risk factors and actionable recommendations.</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 mb-1">What's real ML vs. rule-based (current prototype stage)</h2>
          <p>Prospectivity scores and production forecasts are intended to be produced by trained ML models; risk scoring and recommendations are deliberately rule-based for transparency and explainability.</p>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 mb-1">Data sources</h2>
          <p>This prototype currently runs on illustrative/synthetic data for demonstration. Production versions would draw on ISRO/Bhuvan and USGS satellite imagery, OpenStreetMap boundaries, and published Indian Bureau of Mines / Geological Survey of India records.</p>
        </div>
      </div>
    </div>
  );
}