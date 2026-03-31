import { ImagePlus, FileUp, X } from "lucide-react";
import { useState, useCallback } from "react";

const AssetPanel = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleClear = () => {
    setPreview(null);
    setFileName(null);
  };

  return (
    <div className="glass-panel flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-primary/10">
        <span className="font-display text-[11px] tracking-[0.2em] text-primary/70 uppercase">
          Asset Upload
        </span>
        <FileUp size={14} className="text-muted-foreground" />
      </div>
      <div className="flex-1 p-5">
        {preview ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-3 animate-fade-in">
            <div className="relative group">
              <img
                src={preview}
                alt={fileName || "Uploaded asset"}
                className="max-h-[180px] max-w-full rounded-lg border border-primary/20 object-contain"
              />
              <button
                onClick={handleClear}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                title="Clear"
              >
                <X size={12} />
              </button>
            </div>
            <span className="text-[10px] text-muted-foreground/60 font-mono-space truncate max-w-full">
              {fileName}
            </span>
          </div>
        ) : (
          <label
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center h-full min-h-[200px] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-primary/60 bg-primary/5"
                : "border-muted-foreground/20 hover:border-primary/30 hover:bg-primary/[0.02]"
            }`}
          >
            <input type="file" className="hidden" onChange={handleFileInput} accept="image/*" />
            <ImagePlus size={32} className="text-muted-foreground/40 mb-3" />
            <span className="font-display text-xs tracking-widest text-muted-foreground/60 text-center">
              Upload Artifacts
            </span>
            <span className="text-[10px] text-muted-foreground/30 mt-1 font-mono-space">
              (Screenshots)
            </span>
          </label>
        )}
      </div>
    </div>
  );
};

export default AssetPanel;
