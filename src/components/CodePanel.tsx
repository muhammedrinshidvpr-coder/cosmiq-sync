import { Save, Copy } from "lucide-react";
import { useState } from "react";

const CodePanel = () => {
  const [code, setCode] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="glass-panel flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-primary/10">
        <span className="font-display text-[11px] tracking-[0.2em] text-primary/70 uppercase">
          Protocol Input
        </span>
        <div className="flex gap-3">
          <button className="text-muted-foreground hover:text-primary transition-colors" title="Save">
            <Save size={14} />
          </button>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors" title="Copy">
            <Copy size={14} />
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder=">>> Paste your protocol here..."
        className="flex-1 w-full bg-transparent resize-none p-5 text-sm text-secondary-foreground placeholder:text-muted-foreground/50 font-mono-space focus:outline-none leading-relaxed"
        spellCheck={false}
      />
    </div>
  );
};

export default CodePanel;
