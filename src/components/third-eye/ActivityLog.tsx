import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";

export type LogEntry = {
  id: string;
  time: string;
  level: "INFO" | "OK" | "WARN" | "SCAN";
  message: string;
};

const LEVEL_COLOR: Record<LogEntry["level"], string> = {
  INFO: "text-muted-foreground",
  OK: "text-[oklch(0.74_0.18_155)]",
  WARN: "text-[oklch(0.78_0.17_75)]",
  SCAN: "text-primary",
};

export function ActivityLog({ logs }: { logs: LogEntry[] }) {
  return (
    <div className="glass-strong rounded-2xl flex flex-col overflow-hidden h-full">
      <div className="px-4 pt-3 pb-2 border-b border-white/5 flex items-center gap-2">
        <Terminal className="h-3.5 w-3.5 text-primary" />
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">ACTIVITY_LOG</p>
        <span className="ml-auto font-mono text-[9px] text-muted-foreground/60">
          {logs.length} EVENTS
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-cyber px-3 py-2 font-mono text-[10px] space-y-1">
        <AnimatePresence initial={false}>
          {logs.map((l) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-2 leading-tight"
            >
              <span className="text-muted-foreground/50 shrink-0">{l.time}</span>
              <span className={`${LEVEL_COLOR[l.level]} font-semibold shrink-0 w-9`}>{l.level}</span>
              <span className="text-foreground/80">{l.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
