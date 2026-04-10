import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Send,
  Trash2,
  Copy,
  ImagePlus,
  Download,
  Loader2,
  Clock,
  Check,
} from "lucide-react";

interface WorkspaceItem {
  id: string;
  room_code: string;
  item_type: string;
  content: string;
  created_at: string;
}

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [codeSnippet, setCodeSnippet] = useState("");
  const [items, setItems] = useState<WorkspaceItem[]>([]);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("workspace_items")
      .select("*")
      .eq("room_code", id)
      .order("created_at", { ascending: false });

    if (data) setItems(data as WorkspaceItem[]);
    if (error) console.error("Fetch error:", error);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- TIME FORMATTER ---
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // --- VS CODE TAB EMULATOR ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Inject two spaces exactly where the cursor is
      const newCode =
        codeSnippet.substring(0, start) + "  " + codeSnippet.substring(end);
      setCodeSnippet(newCode);

      // Put the cursor back in the right spot
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  // --- CODE HANDLER ---
  const handleSendCode = async () => {
    if (!codeSnippet.trim()) return;
    setIsSubmittingCode(true);

    try {
      const { error } = await supabase
        .from("workspace_items")
        .insert([{ room_code: id, item_type: "code", content: codeSnippet }]);

      if (error) throw error;

      setCodeSnippet("");
      fetchItems();
    } catch (error) {
      console.error("Failed to send code:", error);
    } finally {
      setIsSubmittingCode(false);
    }
  };

  // --- DOWNLOAD AS FILE HANDLER ---
  const downloadCode = (content: string) => {
    // 1. Ask the user what they want to name the file
    const fileName = prompt(
      "Name your file (e.g., experiment1.c, main.py, lab.txt):",
      "code.txt",
    );

    // 2. If they click cancel, stop the function
    if (!fileName) return;

    // 3. Create and download the file with their custom name
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName; // Uses their custom name!
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- COPY HANDLER ---
  const copyToClipboard = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- IMAGE HANDLER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("workspace_images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("workspace_images").getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from("workspace_items")
        .insert([{ room_code: id, item_type: "image", content: publicUrl }]);

      if (dbError) throw dbError;

      fetchItems();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Max size is 2MB.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDestroy = async () => {
    try {
      const imagesToDelete = items.filter((i) => i.item_type === "image");

      if (imagesToDelete.length > 0) {
        const fileNames = imagesToDelete.map((item) => {
          const parts = item.content.split("/");
          return parts[parts.length - 1];
        });

        const { error: storageError } = await supabase.storage
          .from("workspace_images")
          .remove(fileNames);

        if (storageError)
          console.error("Storage cleanup failed:", storageError);
      }

      await supabase.from("active_workspaces").delete().eq("room_code", id);
      navigate("/");
    } catch (error) {
      console.error("Failed to destroy room:", error);
    }
  };

  const codeItems = items.filter((i) => i.item_type === "code");
  const imageItems = items.filter((i) => i.item_type === "image");

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center glass-panel p-4 md:px-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-display text-primary tracking-widest glow-text uppercase">
              CosmIQ Session
            </h1>
            <p className="font-mono-space text-muted-foreground text-sm tracking-[0.2em] uppercase mt-1">
              Active Room: <span className="text-white font-bold">{id}</span>
            </p>
          </div>

          {/* Action Buttons Container */}
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => window.print()}
              className="w-full md:w-auto flex justify-center items-center gap-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 px-6 py-3 rounded-xl font-mono-space text-[10px] md:text-xs tracking-[0.2em] transition-all uppercase"
            >
              Generate PDF
            </button>
            <button
              onClick={handleDestroy}
              className="w-full md:w-auto flex justify-center items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 px-6 py-3 rounded-xl font-mono-space text-[10px] md:text-xs tracking-[0.2em] transition-all uppercase"
            >
              <Trash2 size={14} />
              Destroy Workspace
            </button>
          </div>
        </header>

        {/* DASHBOARD COLUMNS */}
        <div className="grid md:grid-cols-2 gap-6 h-[75vh]">
          {/* LEFT: CODE PROTOCOLS */}
          <div className="glass-panel p-6 flex flex-col relative overflow-hidden h-full">
            <h2 className="text-sm font-display tracking-[0.2em] text-primary/80 mb-4 uppercase shrink-0">
              Code Protocols
            </h2>

            <div className="flex flex-col gap-3 shrink-0 mb-4">
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste code here (Tab key enabled)..."
                className="w-full bg-black/40 border border-primary/20 rounded-lg p-4 font-mono text-sm text-primary/90 focus:outline-none focus:border-primary/60 resize-none h-24 custom-scrollbar"
              />
              <button
                onClick={handleSendCode}
                disabled={isSubmittingCode || !codeSnippet.trim()}
                className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg py-3 flex items-center justify-center gap-2 text-xs tracking-widest uppercase transition-all disabled:opacity-50"
              >
                {isSubmittingCode ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {isSubmittingCode ? "Sending..." : "Deploy Code"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {codeItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-primary/30 font-mono-space text-xs tracking-widest uppercase bg-black/20 rounded-lg border border-primary/10 border-dashed">
                  [ No Code In Database ]
                </div>
              ) : (
                codeItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/40 border border-primary/10 rounded-lg p-4 group relative flex flex-col gap-2"
                  >
                    {/* HIDDEN IN PRINT: Timestamp Header */}
                    <div className="print:hidden flex justify-between items-center opacity-60 border-b border-primary/10 pb-2 mb-3">
                      <span className="text-[9px] font-mono-space tracking-[0.2em] uppercase text-primary/70">
                        Protocol Logged
                      </span>
                      <span className="text-[10px] font-mono-space flex items-center gap-1 text-muted-foreground">
                        <Clock size={10} /> {formatTime(item.created_at)}
                      </span>
                    </div>

                    {/* THE CLEAN CODE BOX WITH LINE NUMBERS */}
                    <pre className="font-mono text-xs text-white/80 print:text-black whitespace-pre-wrap overflow-x-auto">
                      {item.content.split("\n").map((line, index) => (
                        <div key={index} className="flex gap-4 print:gap-6">
                          <span className="text-muted-foreground/30 print:text-gray-400 select-none text-right w-6 shrink-0">
                            {index + 1}
                          </span>
                          <span className="break-all">{line || " "}</span>
                        </div>
                      ))}
                    </pre>

                    {/* ACTION BUTTONS (Download & Copy) */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => downloadCode(item.content)}
                        className="p-2 bg-primary/20 hover:bg-primary/40 rounded text-primary transition-all"
                        title="Download as File"
                      >
                        <Download size={14} />
                      </button>

                      <button
                        onClick={() => copyToClipboard(item.content, item.id)}
                        className="p-2 bg-primary/20 hover:bg-primary/40 rounded text-primary transition-all"
                        title="Copy to Clipboard"
                      >
                        {copiedId === item.id ? (
                          <Check size={14} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: MEDIA ASSETS */}
          <div className="glass-panel p-6 flex flex-col relative overflow-hidden h-full">
            <h2 className="text-sm font-display tracking-[0.2em] text-primary/80 mb-4 uppercase shrink-0">
              Media Assets
            </h2>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="shrink-0 mb-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-lg py-4 flex items-center justify-center gap-2 text-xs tracking-widest uppercase transition-all disabled:opacity-50 border-dashed"
            >
              {isUploadingImage ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ImagePlus size={16} />
              )}
              {isUploadingImage ? "Uploading Asset..." : "Upload Screenshot"}
            </button>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {imageItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-primary/30 font-mono-space text-xs tracking-widest uppercase bg-black/20 rounded-lg border border-primary/10 border-dashed">
                  [ No Images In Database ]
                </div>
              ) : (
                imageItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/40 border border-primary/10 rounded-lg p-3 group relative flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-center opacity-60 pb-1 px-1">
                      <span className="text-[9px] font-mono-space tracking-[0.2em] uppercase text-primary/70">
                        Asset Uploaded
                      </span>
                      <span className="text-[10px] font-mono-space flex items-center gap-1 text-muted-foreground">
                        <Clock size={10} /> {formatTime(item.created_at)}
                      </span>
                    </div>

                    <img
                      src={item.content}
                      alt="Uploaded lab asset"
                      className="w-full h-auto rounded border border-primary/20"
                    />
                    <a
                      href={item.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 p-2 bg-black/80 hover:bg-primary/40 rounded text-primary transition-all backdrop-blur-sm"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
