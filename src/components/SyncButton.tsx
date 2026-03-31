import { useState } from "react";
import { Zap } from "lucide-react";

const generateKey = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = Array.from({ length: 4 }, () =>
    Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
  );
  return segments.join("-");
};

const SyncButton = () => {
  const [syncKey, setSyncKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setSyncKey(null);
    setTimeout(() => {
      setSyncKey(generateKey());
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="glow-button rounded-xl px-10 py-4 text-sm tracking-[0.3em] text-primary uppercase disabled:opacity-50 flex items-center gap-3"
      >
        <Zap size={16} className={isGenerating ? "animate-spin" : ""} />
        {isGenerating ? "SYNCING..." : "GENERATE SYNC KEY"}
      </button>

      {(isGenerating || syncKey) && (
        <div className="glass-panel px-6 py-4 w-full max-w-lg">
          {isGenerating ? (
            <div className="h-6 rounded bg-gradient-to-r from-transparent via-primary/20 to-transparent bg-[length:200%_100%] animate-[shimmer_1.5s_linear_infinite]" />
          ) : (
            <div className="animate-fade-in text-center">
              <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground uppercase block mb-2">
                Sync Key Generated
              </span>
              <span className="font-mono-space text-primary text-sm md:text-base tracking-widest glow-text break-all">
                {syncKey}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SyncButton;
