"use client";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
  squarePreview?: boolean;
}

export default function ImageUploader({ value, onChange, label, className, squarePreview = false }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Solo se aceptan imágenes"); return; }
    if (file.size > 8 * 1024 * 1024) { setError("Máximo 8 MB"); return; }

    setUploading(true);
    setError("");

    const form = new FormData();
    form.append("token", process.env.NEXT_PUBLIC_ADMIN_PASS || "saneduardo2024");
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else setError(data.error || "Error al subir");
    } catch {
      setError("Error de conexión");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {label && (
        <label className="font-body text-xs text-white/40 uppercase tracking-widest mb-1.5 block">{label}</label>
      )}

      {value ? (
        <div className="relative group mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className={squarePreview ? "w-full max-w-56 aspect-square object-cover" : "w-full h-32 object-cover"}
            style={{ borderRadius: "4px" }}
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: "rgba(0,0,0,0.75)", borderRadius: "50%" }}
            title="Quitar imagen"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => !uploading && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-5 mb-2 cursor-pointer transition-colors hover:border-[#0D4A72]/50"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: "4px" }}
        >
          {uploading ? (
            <div className="font-body text-sm text-white/50">Subiendo...</div>
          ) : (
            <>
              <Upload size={18} className="text-white/25" />
              <div className="text-center">
                <div className="font-body text-sm text-white/50">Arrastrá o hacé clic para subir</div>
                <div className="font-body text-xs text-white/25 mt-0.5">JPG, PNG, WebP · máx 8 MB</div>
              </div>
            </>
          )}
        </div>
      )}

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="O pegá una URL directamente..."
        className="w-full font-body text-xs bg-white/5 border border-white/10 text-white/60 placeholder-white/20 px-3 py-2 focus:outline-none focus:border-[#0D4A72] transition-colors rounded-sm"
      />
      {error && <p className="font-body text-xs text-red-400 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
      />
    </div>
  );
}
