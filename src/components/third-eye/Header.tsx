import { motion } from "framer-motion";
import { Settings, LogOut, Scan, Shield } from "lucide-react";
import { NeuralPulse } from "./NeuralPulse";
import { cn } from "@/lib/utils";

type Props = {
  agentName: string;
  clearance: string;
  connected: boolean;
  onIdentify: () => void;
  onLogout: () => void;
  identifying: boolean;
};

export function Header({ agentName, clearance, connected, onIdentify, onLogout, identifying }: Props) {
  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 px-4 pt-4"
    >
      <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 rounded-xl gradient-cyber grid place-items-center glow-soft shrink-0">
            <Scan className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            <span className="absolute -inset-px rounded-xl border border-white/20" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold tracking-tight leading-none">
              Third <span className="text-gradient-cyber">Eye</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 font-mono">
              Forensic AI · v3.2.1
            </p>
          </div>
        </div>

        {/* Neural link */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass">
          <NeuralPulse size={8} color={connected ? "var(--success)" : "var(--destructive)"} />
          <span className="text-[10px] uppercase tracking-[0.18em] font-mono text-muted-foreground">
            Neural Link
          </span>
          <span className={cn("text-[10px] font-mono font-semibold", connected ? "text-[oklch(0.74_0.18_155)]" : "text-destructive")}>
            {connected ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground">{agentName}</span>
            <span className="text-[10px] font-mono text-primary font-semibold">·{clearance}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={onIdentify}
            disabled={identifying}
            className="relative group flex items-center gap-2 rounded-xl px-4 py-2 gradient-cyber text-white text-xs font-semibold tracking-wide glow-soft hover:glow-cyber transition-shadow disabled:opacity-60"
          >
            <Scan className={cn("h-3.5 w-3.5", identifying && "animate-pulse")} />
            <span>{identifying ? "ANALYZING…" : "IDENTIFY"}</span>
          </motion.button>

          <button className="h-9 w-9 grid place-items-center rounded-xl glass hover:bg-white/5 transition-colors">
            <Settings className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onLogout}
            className="h-9 w-9 grid place-items-center rounded-xl glass hover:bg-destructive/20 hover:text-destructive transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
