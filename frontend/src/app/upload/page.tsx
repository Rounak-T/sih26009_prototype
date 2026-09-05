"use client";
import { useState } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadFile } from "@/lib/api";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const handleRunAnalysis = async () => {
    if (!file) return;
    setStatus("loading");
    try {
      const result = await uploadFile(file);
      setStatus("success");
      setMessage(`Processed ${result.row_count} rows successfully.`);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Data</h1>
        <p className="text-sm text-gray-500 mt-1">Upload production CSV files to update analysis</p>
      </div>

      <label className="block bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 p-10 text-center cursor-pointer hover:border-blue-400 transition-colors">
        <UploadCloud size={36} className="mx-auto text-gray-400" />
        <p className="text-sm text-gray-500 mt-3">Click to select a CSV file, or drag one here</p>
        <p className="text-xs text-gray-400 mt-1">Required columns: mine_id, period, planned_tonnes, actual_tonnes</p>
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
      </label>

      {file && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-3">
          <FileText size={20} className="text-blue-600" />
          <p className="text-sm font-medium text-slate-800">{file.name}</p>
        </div>
      )}

      <button
        onClick={handleRunAnalysis}
        disabled={!file || status === "loading"}
        className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
      >
        {status === "loading" ? "Processing..." : "Run Analysis"}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-2 text-emerald-600 text-sm">
          <CheckCircle2 size={18} /> {message}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={18} /> {message}
        </div>
      )}
    </div>
  );
}