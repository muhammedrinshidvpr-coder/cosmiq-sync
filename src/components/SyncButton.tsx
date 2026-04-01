import { useState } from "react";
import { Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SyncButtonProps {
  codeContent?: string;
  imageUrl?: string | null;
}

const generateHexKey = () => {
  const hex = () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .toUpperCase()
      .padStart(2, "0");
  return `${hex()}-${hex()}${hex()}`;
};

const SyncButton = ({ codeContent, imageUrl }: SyncButtonProps) => {
  const [syncKey, setSyncKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSyncKey(null);

    const newKey = generateHexKey();

    try {
      // Fire the payload to Supabase
      const { error } = await supabase.from("sync_payloads").insert([
        {
          sync_key: newKey,
          code_content:
            codeContent || "// TKM Lab Test Protocol - CosmIQ Sync is LIVE!",
          image_url: imageUrl || null,
        },
      ]);

      if (error) throw error;

      // If successful, show the key to the user
      setSyncKey(newKey);
    } catch (error) {
      console.error("Payload failed to launch:", error);
      alert("Database sync failed. Check your Supabase connection.");
    } finally {
      setIsGenerating(false);
    }
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
            onClick={() => setSyncKey(null)}
            className="mt-2 text-[10px] font-display tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase"
          >
            Acknowledge & Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default SyncButton;
