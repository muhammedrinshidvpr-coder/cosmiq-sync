import { useState } from "react";
import { Zap } from "lucide-react";

const generateHexKey = () => {
  const hex = () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, "0");
  return `${hex()}-${hex()}${hex()}`;
};

const SyncButton = () => {
  const [syncKey, setSyncKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setSyncKey(null);
    setTimeout(() => {
      setSyncKey(generateHexKey());
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {!syncKey && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`glow-button rounded-xl px-10 py-4 text-sm tracking-[0.3em] text-primary uppercase disabled:opacity-50 flex items-center gap-3 ${
            isGenerating ? "animate-pulse-neon" : ""
          }`}
        >
          <Zap size={16} className={isGenerating ? "animate-spin" : ""} />
          {isGenerating ? "SYNCING..." : "GENERATE SYNC KEY"}
        </button>
      )}

      {isGenerating && (
        <div className="glass-panel px-6 py-4 w-full max-w-lg">
          <div className="h-6 rounded bg-gradient-to-r from-transparent via-primary/20 to-transparent bg-[length:200%_100%] animate-[shimmer_1.5s_linear_infinite]" />
        </div>
      )}

      {syncKey && !isGenerating && (
        <div className="glass-panel px-8 py-6 w-full max-w-lg animate-fade-in text-center space-y-3">
          <span className="text-[10px] font-display tracking-[0.2em] text-muted-foreground uppercase block">
            Your Sync Key
          </span>
          <span className="font-display text-2xl md:text-3xl text-primary tracking-[0.15em] glow-text block">
            {syncKey}
          </span>
          <div className="pt-2 border-t border-primary/10">
            <span className="text-[10px] font-mono-space tracking-[0.15em] text-destructive/80 uppercase">
              ⚠ Burner Active: Content Self-Destructs in 24 Hours
            </span>
          </div>
          <button
            onClick={handleGenerate}
            className="mt-2 text-[10px] font-display tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase"
          >
            Regenerate
          </button>
        </div>
      )}
    </div>
  );
};

export default SyncButton;
