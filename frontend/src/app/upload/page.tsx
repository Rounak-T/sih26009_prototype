"use client";
import { useState } from "react";
import { UploadCloud, FileText } from "lucide-react";

export default function UploadPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.trim().split("\n");
      setRowCount(lines.length - 1); // minus header row
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Data</h1>
        <p className="text-sm text-gray-500 mt-1">Upload production or equipment CSV files to update analysis</p>
      </div>

      <label className="block bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-10 text-center cursor-pointer hover:border-blue-400 transition-colors">
        <UploadCloud size={36} className="mx-auto text-gray-400" />
        <p className="text-sm text-gray-500 mt-3">Click to select a CSV file, or drag one here</p>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />
      </label>

      {fileName && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3">
          <FileText size={20} className="text-blue-600" />
          <div>
            <p className="text-sm font-medium text-slate-800">{fileName}</p>
            <p className="text-xs text-gray-400">{rowCount ?? "..."} rows detected</p>
          </div>
        </div>
      )}

      <button
        disabled={!fileName}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        Run Analysis
      </button>
      <p className="text-xs text-gray-400">Note: analysis processing will be connected once the backend is ready.</p>
    </div>
  );
}