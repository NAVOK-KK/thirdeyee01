import { motion } from "framer-motion";

type Props = {
  value: number; // 0-100
  size?: number;
  label?: string;
};

export function ConfidenceGauge({ value, size = 180, label = "MATCH CONFIDENCE" }: Props) {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.22 305)" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 280)" />
          </linearGradient>
          <filter id="gauge-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(1 0 0 / 0.06)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          filter="url(#gauge-glow)"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - dash }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Tick marks */}
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const x1 = size / 2 + Math.cos(a) * (r - 14);
          const y1 = size / 2 + Math.sin(a) * (r - 14);
          const x2 = size / 2 + Math.cos(a) * (r - 18);
          const y2 = size / 2 + Math.sin(a) * (r - 18);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(1 0 0 / 0.08)" strokeWidth={1} />;
        })}
      </svg>

      <div className="relative text-center">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tabular-nums tracking-tight text-glow"
        >
          {value.toFixed(1)}
          <span className="text-lg text-muted-foreground font-normal">%</span>
        </motion.div>
        <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
