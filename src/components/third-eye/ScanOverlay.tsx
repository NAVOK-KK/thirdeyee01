import { motion } from "framer-motion";

export function ScanOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl"
    >
      {/* Tint */}
      <div className="absolute inset-0 bg-primary/5" />

      {/* Laser sweep */}
      <motion.div
        initial={{ y: "-10%" }}
        animate={{ y: "110%" }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-32 -top-32"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.65 0.25 305 / 0.0) 20%, oklch(0.78 0.22 305 / 0.45) 50%, oklch(0.65 0.25 305 / 0.0) 80%, transparent 100%)",
        }}
      >
        <div className="absolute bottom-1/2 left-0 right-0 h-px bg-primary shadow-[0_0_20px_4px_oklch(0.78_0.22_305_/_0.8)]" />
      </motion.div>

      {/* Scanline noise */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, oklch(1 0 0 / 0.04) 2px, oklch(1 0 0 / 0.04) 3px)",
        }}
      />

      {/* Corner brackets pulse */}
      {([
        "top-2 left-2 border-t-2 border-l-2",
        "top-2 right-2 border-t-2 border-r-2",
        "bottom-2 left-2 border-b-2 border-l-2",
        "bottom-2 right-2 border-b-2 border-r-2",
      ]).map((cls, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
          className={`absolute h-6 w-6 ${cls} border-primary`}
        />
      ))}

      {/* Center status */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="font-mono text-xs tracking-[0.4em] text-primary text-glow"
        >
          NEURAL ANALYSIS
        </motion.p>
      </div>
    </motion.div>
  );
}
