import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Cpu, Database, Zap } from "lucide-react";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { NeuralPulse } from "./NeuralPulse";

export type AnalysisResult = {
  confidence: number;
  identity: string;
  matchId: string;
  neuralProbability: number;
  age: number;
  region: string;
  insights: string[];
};

type Props = {
  identifying: boolean;
  result: AnalysisResult | null;
};

export function AIInsightPanel({ identifying, result }: Props) {
  return (
    <motion.aside
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="glass-strong rounded-2xl flex flex-col h-full overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">AI ENGINE</p>
          <h2 className="text-sm font-semibold mt-0.5">Insight Stream</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <NeuralPulse size={6} color={identifying ? "var(--cyber)" : "var(--success)"} />
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
            {identifying ? "Compute" : "Idle"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-cyber p-4 space-y-4">
        {/* Gauge */}
        <div className="flex flex-col items-center py-2">
          <ConfidenceGauge value={result?.confidence ?? 0} size={170} />
        </div>

        {/* Identity */}
        <div className="rounded-xl glass p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">IDENTITY</span>
            <span className="font-mono text-[9px] text-primary">{result?.matchId ?? "—"}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={result?.identity ?? "none"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-base font-semibold tracking-tight"
            >
              {result?.identity ?? "Unknown subject"}
            </motion.div>
          </AnimatePresence>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Stat label="AGE" value={result ? `${result.age}` : "—"} />
            <Stat label="REGION" value={result?.region ?? "—"} />
            <Stat label="P(NEURAL)" value={result ? `${result.neuralProbability.toFixed(2)}` : "—"} />
          </div>
        </div>

        {/* Model status grid */}
        <div className="grid grid-cols-2 gap-2">
          <ModelChip icon={<Brain className="h-3 w-3" />} label="ResNet-152" status="ACTIVE" />
          <ModelChip icon={<Cpu className="h-3 w-3" />} label="FaceNet-V3" status="ACTIVE" />
          <ModelChip icon={<Database className="h-3 w-3" />} label="VectorDB" status={identifying ? "QUERY" : "READY"} accent={identifying} />
          <ModelChip icon={<Zap className="h-3 w-3" />} label="EdgeTPU" status="2.4 TOP/s" />
        </div>

        {/* Insights */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-3 w-3 text-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">MODEL INSIGHTS</span>
          </div>
          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {(result?.insights ?? ["Awaiting subject composition…"]).map((i, idx) => (
                <motion.div
                  key={`${result?.matchId ?? "init"}-${idx}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed"
                >
                  <span className="text-primary mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                  <span>{i}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-black/30 border border-white/5 px-2 py-1.5">
      <div className="font-mono text-[8px] tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold tabular-nums mt-0.5">{value}</div>
    </div>
  );
}

function ModelChip({ icon, label, status, accent }: { icon: React.ReactNode; label: string; status: string; accent?: boolean }) {
  return (
    <div className="rounded-lg glass px-2.5 py-2 flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={accent ? "text-primary" : "text-muted-foreground"}>{icon}</span>
        <span className="text-[10px] font-medium truncate">{label}</span>
      </div>
      <span className={`font-mono text-[8px] tracking-wider ${accent ? "text-primary animate-pulse" : "text-[oklch(0.74_0.18_155)]"}`}>
        {status}
      </span>
    </div>
  );
}
