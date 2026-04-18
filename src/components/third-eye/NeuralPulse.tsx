import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function NeuralPulse({ className, size = 12, color = "var(--cyber)" }: { className?: string; size?: number; color?: string }) {
  return (
    <span className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: color, opacity: 0.5 }} />
      <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: color, opacity: 0.5, animationDelay: "0.6s" }} />
      <motion.span
        className="relative rounded-full"
        style={{ width: size, height: size, background: color, boxShadow: `0 0 12px ${color}` }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
}
