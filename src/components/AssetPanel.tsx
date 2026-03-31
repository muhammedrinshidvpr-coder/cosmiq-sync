import { ImagePlus, FileUp } from "lucide-react";
import { useState, useCallback } from "react";

const AssetPanel = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const names = Array.from(e.dataTransfer.files).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setFiles((prev) => [...prev, ...names]);
    }
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
          <input type="file" multiple className="hidden" onChange={handleFileInput} accept="image/*" />
          <ImagePlus size={32} className="text-muted-foreground/40 mb-3" />
          <span className="font-display text-xs tracking-widest text-muted-foreground/60 text-center">
            Upload Artifacts
          </span>
          <span className="text-[10px] text-muted-foreground/30 mt-1 font-mono-space">
            (Screenshots)
          </span>
        </label>
        {files.length > 0 && (
          <div className="mt-4 space-y-1">
            {files.map((f, i) => (
              <div key={i} className="text-xs text-primary/60 font-mono-space truncate">
                ▸ {f}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetPanel;
