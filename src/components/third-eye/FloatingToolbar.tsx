import { useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, FACIAL_PARTS, type PartCategory, type FacialPart } from "@/lib/facial-parts";
import { cn } from "@/lib/utils";

type Props = {
  onAdd: (part: FacialPart) => void;
};

export function FloatingToolbar({ onAdd }: Props) {
  const [active, setActive] = useState<PartCategory>("face");
  const parts = FACIAL_PARTS.filter((p) => p.category === active);

  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="glass-strong rounded-2xl flex flex-col h-full overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/5">
        <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">COMPONENTS</p>
        <h2 className="text-sm font-semibold mt-0.5">Composite Library</h2>
      </div>

      {/* Category tabs */}
      <div className="px-3 pt-3 flex gap-1 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "relative text-[10px] font-mono tracking-wider px-2.5 py-1.5 rounded-md transition-colors uppercase",
              active === c.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {active === c.id && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-md bg-primary/15 border border-primary/30"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{c.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-cyber p-3 grid grid-cols-3 gap-2 content-start">
        {parts.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              role="button"
              tabIndex={0}
              draggable
              onClick={() => onAdd(p)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onAdd(p); } }}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "copy";
                e.dataTransfer.setData("application/x-thirdeye-part", p.id);
                const ghost = document.createElement("div");
                ghost.style.cssText =
                  "position:absolute;top:-1000px;left:-1000px;width:80px;height:80px;display:grid;place-items:center;background:rgba(168,85,247,0.18);border:1px solid rgba(168,85,247,0.7);border-radius:12px;color:#fafafa;";
                ghost.innerHTML = p.svg;
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 40, 40);
                setTimeout(() => ghost.remove(), 0);
              }}
              className="group relative aspect-square w-full rounded-xl glass hover:border-primary/40 hover:glow-soft hover:-translate-y-0.5 hover:scale-[1.04] active:scale-95 transition-all duration-200 flex items-center justify-center p-3 cursor-grab active:cursor-grabbing select-none"
              title={`Drag or click · ${p.label}`}
            >
              <div
                className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[80%] [&>svg]:max-h-[80%]"
                dangerouslySetInnerHTML={{ __html: p.svg }}
              />
              <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono text-center text-muted-foreground/60 group-hover:text-primary transition-colors uppercase tracking-wider truncate pointer-events-none">
                {p.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-white/5 font-mono text-[10px] tracking-wider text-muted-foreground flex justify-between">
        <span>{parts.length} ASSETS</span>
        <span className="text-primary">DRAG · OR · CLICK</span>
      </div>
    </motion.div>
  );
}
