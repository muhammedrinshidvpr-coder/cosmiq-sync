import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, LogIn, Shield, Timer, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateSession = async () => {
    setIsCreating(true);
    const newCode = generateRoomCode();

    try {
      const { error } = await supabase
        .from("active_workspaces")
        .insert([{ room_code: newCode }]);

      if (error) throw error;
      navigate(`/space/${newCode}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("System error: Could not initialize workspace.");
      setIsCreating(false);
    }
  };

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.length === 5) {
      navigate(`/space/${joinCode.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center relative overflow-hidden text-white font-sans">
      {/* TOP NAVIGATION */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <img
            src="/sync-logo.png"
            alt="CosmIQ Sync"
            className="w-10 h-10 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.3)]"
          />
          <span className="font-display text-xl tracking-[0.15em] text-white">
            SYNC
          </span>
        </div>

        <a
          href="https://www.cosmiqproject.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
        >
          <img
            src="/main-logo.png"
            alt="CosmIQ Academy"
            className="w-5 h-5 rounded-full"
          />
          <span className="text-[10px] font-mono-space tracking-[0.2em] text-white/70 group-hover:text-white uppercase">
            By CosmIQ
          </span>
        </a>
      </nav>

      {/* HERO SECTION */}
      <header className="w-full max-w-4xl mx-auto px-6 pt-12 pb-16 text-center z-10 flex flex-col items-center gap-6 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono-space tracking-widest uppercase mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Live for TKM Labs
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent">
          Transfer Code.
          <br className="hidden md:block" /> Not Credentials.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The frictionless, burner workspace built for engineering students.
          Drop your lab code, sync your assets, and walk away. Everything
          auto-destructs in 24 hours.
        </p>
      </header>

      {/* THE GATEWAY ACTION ZONE */}
      <main className="w-full max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6 z-10 mb-20">
        {/* SENDER CARD */}
        <div className="glass-panel p-8 md:p-10 flex flex-col items-center justify-center text-center space-y-8 relative group overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl font-display tracking-[0.15em] text-primary uppercase glow-text">
              Lab PC
            </h2>
            <p className="text-xs text-muted-foreground font-mono-space tracking-widest uppercase">
              Start a new session
            </p>
          </div>

          <button
            onClick={handleCreateSession}
            disabled={isCreating}
            className={`w-full glow-button rounded-xl px-8 py-5 text-sm tracking-[0.3em] text-black bg-primary uppercase disabled:opacity-50 flex items-center justify-center gap-3 font-bold ${
              isCreating
                ? "animate-pulse"
                : "hover:scale-[1.02] transition-transform"
            }`}
          >
            <Zap size={18} className={isCreating ? "animate-spin" : ""} />
            {isCreating ? "INITIALIZING..." : "START WORKSPACE"}
          </button>
        </div>

        {/* RECEIVER CARD */}
        <div className="glass-panel p-8 md:p-10 flex flex-col items-center justify-center text-center space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-display tracking-[0.15em] text-white uppercase">
              Mobile App
            </h2>
            <p className="text-xs text-muted-foreground font-mono-space tracking-widest uppercase">
              Access your files
            </p>
          </div>

          <form onSubmit={handleJoinSession} className="w-full space-y-4">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="5-DIGIT CODE"
              maxLength={5}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-6 py-5 text-center text-xl font-display tracking-[0.3em] text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all uppercase placeholder:text-muted-foreground/30 placeholder:tracking-widest"
            />
            <button
              type="submit"
              disabled={joinCode.length !== 5}
              className="w-full rounded-xl px-8 py-4 text-sm tracking-[0.3em] bg-white/5 hover:bg-white/10 text-white border border-white/10 uppercase transition-all disabled:opacity-30 flex items-center justify-center gap-3 font-bold"
            >
              <LogIn size={18} />
              ACCESS FILES
            </button>
          </form>
        </div>
      </main>

      {/* VALUE PROPOSITION GRID */}
      <section className="w-full max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6 z-10 pb-20">
        <div className="glass-panel p-6 flex flex-col items-center text-center gap-4 bg-black/20 border-white/5">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Shield size={24} />
          </div>
          <h3 className="text-sm font-display tracking-widest uppercase text-white/90">
            Zero Logins
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No emails. No passwords. Skip the friction and instantly connect
            your devices.
          </p>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center text-center gap-4 bg-black/20 border-white/5">
          <div className="p-3 rounded-full bg-destructive/10 text-destructive">
            <Timer size={24} />
          </div>
          <h3 className="text-sm font-display tracking-widest uppercase text-white/90">
            Auto-Destruct
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Never leave your code on a public lab PC. Workspaces vanish
            automatically after 24 hours.
          </p>
        </div>

        <div className="glass-panel p-6 flex flex-col items-center text-center gap-4 bg-black/20 border-white/5">
          <div className="p-3 rounded-full bg-blue-500/10 text-blue-400">
            <Globe size={24} />
          </div>
          <h3 className="text-sm font-display tracking-widest uppercase text-white/90">
            Cross-Platform
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seamlessly move code, text, and media assets between Windows, Mac,
            iOS, and Android.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 py-8 z-10 bg-black/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/main-logo.png"
              alt="CosmIQ"
              className="w-6 h-6 rounded-full grayscale opacity-50"
            />
            <span className="text-[10px] font-mono-space tracking-[0.2em] text-muted-foreground uppercase">
              A Project by CosmIQ Academy
            </span>
          </div>
          <div className="text-[10px] font-mono-space tracking-[0.2em] text-muted-foreground/50 uppercase">
            © {new Date().getFullYear()} • Engineered for speed
          </div>
        </div>
      </footer>

      {/* BACKGROUND EFFECTS */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>
    </div>
  );
};

export default Index;
