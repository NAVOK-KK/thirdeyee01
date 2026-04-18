import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { fabric } from "fabric";
import { getSession, logout, type Session } from "@/lib/auth";
import { FACIAL_PARTS, type FacialPart } from "@/lib/facial-parts";
import { Header } from "@/components/third-eye/Header";
import { FloatingToolbar } from "@/components/third-eye/FloatingToolbar";
import { CanvasWorkspace } from "@/components/third-eye/CanvasWorkspace";
import { AIInsightPanel, type AnalysisResult } from "@/components/third-eye/AIInsightPanel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Third Eye — Cyber Forensic AI Intelligence Hub" },
      { name: "description", content: "Construct suspect composites and run neural recognition with the Third Eye forensic AI platform." },
      { property: "og:title", content: "Third Eye — Cyber Forensic AI Intelligence Hub" },
      { property: "og:description", content: "Premium forensic AI workspace: composite sketching, neural matching, real-time intelligence." },
    ],
  }),
  component: HubPage,
});

const IDENTITIES = [
  { id: "VX-7714-Δ", name: "Subject Vorenko, M.", region: "EU-East", age: 41 },
  { id: "RH-2089-Ω", name: "Subject Rahimi, A.", region: "ME-Levant", age: 33 },
  { id: "ST-4451-Σ", name: "Subject Sato, K.", region: "APAC-JP", age: 47 },
  { id: "DK-9023-Λ", name: "Subject De Klerk, J.", region: "AF-South", age: 38 },
];

const INSIGHT_POOL = [
  "Periorbital asymmetry +0.12σ — flagged for second-pass.",
  "Cheekbone vector aligns with archive cluster #7714.",
  "Brow ridge curvature within 4.2% of canonical match.",
  "Mandible angle suggests Northern European ancestry.",
  "Pupil distance 62mm — within normative range.",
  "Lip thickness ratio 0.41 — moderate confidence band.",
  "Hairline morphology indicates 35-45 age bracket.",
  "Nasal bridge geometry: dorsal hump detected.",
];

function HubPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [identifying, setIdentifying] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [partCount, setPartCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const historyRef = useRef<fabric.Object[]>([]);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/login" });
      return;
    }
    setSession(s);
    pushLog("OK", `Operator ${s.name} authorized · clearance ${s.clearance}`);
    pushLog("INFO", "Neural link established · 3 models online");
    pushLog("INFO", "VectorDB synchronized · 2.4M reference embeddings");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pushLog = (level: LogEntry["level"], message: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs((l) => [{ id: crypto.randomUUID(), time, level, message }, ...l].slice(0, 60));
  };

  const onCanvasReady = (c: fabric.Canvas) => {
    canvasRef.current = c;
    const update = () => setPartCount(c.getObjects().length);
    c.on("object:added", () => { update(); });
    c.on("object:removed", update);
  };

  const addPart = (p: FacialPart, pos?: { x: number; y: number }) => {
    const c = canvasRef.current;
    if (!c) return;
    fabric.loadSVGFromString(p.svg, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options) as fabric.Object;
      const targetX = pos?.x ?? c.getWidth() / 2 + (Math.random() * 40 - 20);
      const targetY = pos?.y ?? c.getHeight() / 2 + (Math.random() * 40 - 20);
      obj.set({
        left: targetX - p.defaultW / 2,
        top: targetY - p.defaultH / 2,
        scaleX: p.defaultW / (obj.width ?? p.defaultW),
        scaleY: p.defaultH / (obj.height ?? p.defaultH),
        cornerColor: "#A855F7",
        cornerStyle: "circle",
        cornerSize: 8,
        transparentCorners: false,
        borderColor: "#A855F7",
        borderScaleFactor: 1.5,
        padding: 4,
      });
      (obj as fabric.Object & { __label?: string }).__label = p.label;
      c.add(obj);
      c.setActiveObject(obj);
      historyRef.current.push(obj);
      c.renderAll();
      pushLog("INFO", `Component ${pos ? "dropped" : "added"} · ${p.category.toUpperCase()}/${p.label}`);
    });
  };

  const handleDropPart = (partId: string, x: number, y: number) => {
    const part = FACIAL_PARTS.find((fp) => fp.id === partId);
    if (part) addPart(part, { x, y });
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    canvasRef.current?.setBackgroundColor("transparent", () => canvasRef.current?.renderAll());
    historyRef.current = [];
    setResult(null);
    pushLog("WARN", "Canvas purged · all components removed");
  };

  const handleUndo = () => {
    const c = canvasRef.current;
    const last = historyRef.current.pop();
    if (c && last) {
      c.remove(last);
      pushLog("INFO", "Undo · last component removed");
    }
  };

  const handleIdentify = async () => {
    if (!canvasRef.current || canvasRef.current.getObjects().length === 0) {
      pushLog("WARN", "Identify aborted · canvas empty");
      return;
    }
    setIdentifying(true);
    pushLog("SCAN", "Neural sweep initiated · ResNet-152 + FaceNet-V3");
    await delay(800);
    pushLog("SCAN", "Extracting 512-dim embedding…");
    await delay(900);
    pushLog("SCAN", "Querying VectorDB · 2.4M candidates");
    await delay(900);

    const id = IDENTITIES[Math.floor(Math.random() * IDENTITIES.length)];
    const confidence = 72 + Math.random() * 26; // 72–98
    const insights = shuffle(INSIGHT_POOL).slice(0, 4);
    const r: AnalysisResult = {
      confidence,
      identity: id.name,
      matchId: id.id,
      neuralProbability: 0.6 + Math.random() * 0.39,
      age: id.age,
      region: id.region,
      insights,
    };
    setResult(r);
    setIdentifying(false);
    pushLog("OK", `Match found · ${id.id} · ${confidence.toFixed(1)}% confidence`);
  };

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const headerProps = useMemo(() => ({
    agentName: session?.name ?? "—",
    clearance: session?.clearance ?? "—",
    connected: true,
  }), [session]);

  if (!session) return null;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <Header
        {...headerProps}
        identifying={identifying}
        onIdentify={handleIdentify}
        onLogout={handleLogout}
      />

      {/* Bento grid */}
      <main className="flex-1 px-4 pb-4 pt-3 min-h-0 grid gap-3 grid-cols-1 lg:grid-cols-12 lg:grid-rows-[1fr]">
        {/* Toolbar */}
        <div className="lg:col-span-3 min-h-0 h-full lg:max-h-none">
          <FloatingToolbar onAdd={addPart} />
        </div>

        {/* Canvas */}
        <div className="lg:col-span-6 min-h-[420px] lg:min-h-0 h-full">
          <CanvasWorkspace
            identifying={identifying}
            onCanvasReady={onCanvasReady}
            partCount={partCount}
            onClear={handleClear}
            onUndo={handleUndo}
            onDropPart={handleDropPart}
          />
        </div>

        {/* AI panel */}
        <div className="lg:col-span-3 min-h-0 h-full lg:max-h-none">
          <AIInsightPanel identifying={identifying} result={result} />
        </div>
      </main>
    </div>
  );
}

function delay(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
function shuffle<T>(arr: T[]) { return [...arr].sort(() => Math.random() - 0.5); }
