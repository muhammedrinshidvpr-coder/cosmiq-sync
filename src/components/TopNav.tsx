import { Wifi } from "lucide-react";

const TopNav = () => (
  <nav className="flex items-center justify-between px-6 py-4 md:px-10">
    <span className="font-display text-sm md:text-base tracking-[0.3em] text-primary glow-text">
      CosmIQ Sync
    </span>
    <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono-space">
      <Wifi size={14} className="text-primary" />
      <span className="hidden sm:inline">Network Stable</span>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-40 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
      </span>
    </div>
  </nav>
);

export default TopNav;
