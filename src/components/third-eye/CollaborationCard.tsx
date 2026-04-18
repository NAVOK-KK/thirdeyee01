import { motion } from "framer-motion";
import { Users } from "lucide-react";

const COLLABORATORS = [
  { id: "1", initials: "MK", name: "M. Kovacs", color: "oklch(0.65 0.25 305)", typing: true },
  { id: "2", initials: "JR", name: "J. Reyes", color: "oklch(0.82 0.16 215)", typing: false },
  { id: "3", initials: "AN", name: "A. Noor", color: "oklch(0.74 0.18 155)", typing: false },
];

export function CollaborationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <div>
          <p className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">SECURE SESSION</p>
          <p className="text-xs font-medium mt-0.5">3 analysts connected</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* typing indicator */}
        <div className="hidden sm:flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              className="h-1 w-1 rounded-full bg-primary"
            />
          ))}
        </div>

        <div className="flex -space-x-2">
          {COLLABORATORS.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08, type: "spring", stiffness: 300, damping: 20 }}
              className="relative h-7 w-7 rounded-full grid place-items-center text-[9px] font-bold text-black border-2 border-[oklch(0.155_0.005_285)]"
              style={{ background: c.color }}
              title={c.name}
            >
              {c.initials}
              {c.typing && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-[oklch(0.74_0.18_155)] border border-black" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
