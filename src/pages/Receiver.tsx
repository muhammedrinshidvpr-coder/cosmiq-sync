import { useState, useEffect, useCallback } from "react";
import { Copy, Download, Lock, Zap, CheckCircle } from "lucide-react";
import cosmiqLogo from "@/assets/cosmiq-logo.png";

const MOCK_CODE = `#include <iostream>
#include <vector>
#include <algorithm>

class SyncProtocol {
  private:
    std::vector<uint8_t> payload;
    std::string encryptionKey;

  public:
    SyncProtocol(const std::string& key)
      : encryptionKey(key) {}

    void ingestPayload(const uint8_t* data, size_t len) {
      payload.assign(data, data + len);
      encrypt();
    }

    bool transmit(const std::string& endpoint) {
      // Secure transfer via TLS 1.3
      return sendEncrypted(endpoint, payload);
    }
};

int main() {
  SyncProtocol proto("X7-5F2A");
  proto.ingestPayload(rawData, sizeof(rawData));
  proto.transmit("wss://sync.cosmiq.dev");
  return 0;
}`;

const MOCK_IMAGE = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop";

const Receiver = () => {
  const [state, setState] = useState<"lock" | "payload">("lock");
  const [keyInput, setKeyInput] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(86382); // ~23:59:42
  const syncKey = "X7-5F2A";

  useEffect(() => {
    if (state !== "payload") return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleTransfer = useCallback(() => {
    if (keyInput.length === 0) return;
    setIsTransferring(true);
    setTimeout(() => {
      setIsTransferring(false);
      setState("payload");
    }, 2200);
  }, [keyInput]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(MOCK_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-space relative overflow-hidden flex flex-col">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <img
          src={cosmiqLogo}
          alt=""
          className="w-[60vw] max-w-[500px] select-none"
          style={{ opacity: 0.1, filter: "blur(4px)" }}
          draggable={false}
        />
        <div className="absolute w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full bg-primary/[0.06] blur-[80px]" />
      </div>

      {/* Ambient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/[0.04] blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1">
        {/* STATE 1: RETRIEVAL LOCK */}
        {state === "lock" && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="glass-panel w-full max-w-md p-8 flex flex-col items-center gap-8 animate-fade-in">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full border border-primary/30 flex items-center justify-center bg-primary/[0.05]">
                  <Lock size={24} className="text-primary" />
                </div>
                <span className="font-display text-[10px] tracking-[0.25em] text-primary/60 uppercase">
                  Secure Retrieval
                </span>
              </div>

              <div className="w-full">
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value.toUpperCase().slice(0, 7))}
                  placeholder="ENTER 6-DIGIT SYNC KEY"
                  className="w-full text-center font-display text-lg tracking-[0.2em] bg-transparent border border-primary/30 rounded-xl px-4 py-4 text-primary placeholder:text-muted-foreground/40 placeholder:text-xs placeholder:tracking-[0.15em] focus:outline-none focus:border-primary/60 focus:shadow-[0_0_30px_hsl(var(--glow-cyan)/0.15)] transition-all"
                />
              </div>

              <button
                onClick={handleTransfer}
                disabled={isTransferring || keyInput.length === 0}
                className={`glow-button w-full rounded-xl px-6 py-4 text-xs tracking-[0.3em] text-primary uppercase disabled:opacity-30 flex items-center justify-center gap-3 ${
                  isTransferring ? "animate-pulse-neon" : ""
                }`}
              >
                <Zap size={14} className={isTransferring ? "animate-spin" : ""} />
                {isTransferring ? "DECRYPTING..." : "INITIATE TRANSFER"}
              </button>

              {isTransferring && (
                <div className="w-full">
                  <div className="h-1 rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent bg-[length:200%_100%] animate-[shimmer_1s_linear_infinite]" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATE 2: PAYLOAD */}
        {state === "payload" && (
          <div className="flex-1 flex flex-col animate-fade-in">
            {/* Top bar */}
            <div className="glass-panel rounded-none border-x-0 border-t-0 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400 absolute inset-0 pulse-dot" />
                </div>
                <span className="font-display text-[9px] tracking-[0.15em] text-green-400 uppercase">
                  Sync Successful
                </span>
                <span className="font-display text-[10px] tracking-[0.1em] text-primary glow-text">
                  {syncKey}
                </span>
              </div>
              <div className="font-mono-space text-[11px] text-primary/70 tabular-nums tracking-wider">
                {formatTime(countdown)}
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 px-4 py-5 overflow-auto">
              {/* Code panel */}
              <div className="glass-panel flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                  <span className="font-display text-[10px] tracking-[0.2em] text-primary/70 uppercase">
                    Retrieved Protocol
                  </span>
                  <button
                    onClick={handleCopy}
                    className="glow-button rounded-lg px-4 py-2 text-[10px] tracking-[0.2em] text-primary uppercase flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    {copied ? (
                      <>
                        <CheckCircle size={14} className="text-green-400" />
                        <span className="text-green-400">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        COPY CODE
                      </>
                    )}
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  <pre className="font-mono-space text-xs leading-relaxed text-secondary-foreground whitespace-pre-wrap break-words">
                    {MOCK_CODE}
                  </pre>
                </div>
              </div>

              {/* Asset panel */}
              <div className="glass-panel">
                <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
                  <span className="font-display text-[10px] tracking-[0.2em] text-primary/70 uppercase">
                    Retrieved Artifact
                  </span>
                  <a
                    href={MOCK_IMAGE}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glow-button rounded-lg px-4 py-2 text-[10px] tracking-[0.2em] text-primary uppercase flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <Download size={14} />
                    DOWNLOAD
                  </a>
                </div>
                <div className="p-4">
                  <img
                    src={MOCK_IMAGE}
                    alt="Retrieved artifact"
                    className="w-full rounded-lg border border-primary/10 object-cover max-h-[200px]"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="text-center py-4">
                <span className="font-mono-space text-[10px] tracking-[0.15em] text-destructive/60 uppercase">
                  ⚠ Burn Protocol Initiated — {formatTime(countdown)} remaining
                </span>
              </div>
            </div>

            {/* Dev toggle */}
            <button
              onClick={() => setState("lock")}
              className="fixed bottom-4 right-4 text-[9px] font-mono-space text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              [reset]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Receiver;
