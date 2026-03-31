import { Save, Copy } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-c";
import "prismjs/themes/prism-tomorrow.css";

const STORAGE_KEY = "cosmiq_protocol_code";

const CodePanel = () => {
  const [code, setCode] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "";
  });
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, code);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [code]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [code]);

  const highlightCode = useCallback((value: string) => {
    try {
      return highlight(value, languages.python, "python");
    } catch {
      return value;
    }
  }, []);

  return (
    <div className="glass-panel flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-primary/10">
        <span className="font-display text-[11px] tracking-[0.2em] text-primary/70 uppercase">
          Protocol Input
        </span>
        <div className="flex gap-3 items-center">
          {saved && <span className="text-[10px] text-green-400 font-mono-space animate-fade-in">Saved</span>}
          {copied && <span className="text-[10px] text-green-400 font-mono-space animate-fade-in">Copied</span>}
          <button onClick={handleSave} className="text-muted-foreground hover:text-primary transition-colors" title="Save to localStorage">
            <Save size={14} />
          </button>
          <button onClick={handleCopy} className="text-muted-foreground hover:text-primary transition-colors" title="Copy to clipboard">
            <Copy size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={highlightCode}
          padding={12}
          placeholder=">>> Paste your protocol here..."
          textareaClassName="focus:outline-none"
          className="min-h-full font-mono-space text-sm leading-relaxed"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: "hsl(var(--secondary-foreground))",
            minHeight: "100%",
          }}
        />
      </div>
    </div>
  );
};

export default CodePanel;
