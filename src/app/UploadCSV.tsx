"use client";

import { useRef, useState } from "react";

export default function UploadCSV() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  async function handleUpload(file: File) {
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      setStatus("success");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={status === "uploading"}
        className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-xs text-gray-300 hover:border-gray-500 hover:text-white disabled:opacity-50 transition-colors"
      >
        {status === "uploading"
          ? "Uploading..."
          : status === "success"
            ? "Updated! Reloading..."
            : "Upload CSV"}
      </button>
      {status === "error" && (
        <span className="text-xs text-red-400">Upload failed</span>
      )}
    </div>
  );
}
