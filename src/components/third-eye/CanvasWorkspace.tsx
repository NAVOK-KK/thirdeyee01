import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RotateCcw, Layers, Crosshair, Pencil, SlidersHorizontal } from "lucide-react";
import { ScanOverlay } from "./ScanOverlay";

type Props = {
  identifying: boolean;
  onCanvasReady: (c: fabric.Canvas) => void;
  partCount: number;
  onClear: () => void;
  onUndo: () => void;
  onDropPart: (partId: string, x: number, y: number) => void;
};

export function CanvasWorkspace({ identifying, onCanvasReady, partCount, onClear, onUndo, onDropPart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [isSketching, setIsSketching] = useState(false);
  const [activeObj, setActiveObj] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return;
    const el = containerRef.current;

    const canvas = new fabric.Canvas(canvasElRef.current, {
      backgroundColor: "transparent",
      selection: true,
      preserveObjectStacking: true,
    });
    fabricRef.current = canvas;
    
    // Configure Free Drawing Brush setup
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.color = "#A855F7"; // Highlight color
    canvas.freeDrawingBrush.width = 3;
    
    canvas.on("selection:created", (e) => setActiveObj(e.selected?.[0] || null));
    canvas.on("selection:updated", (e) => setActiveObj(e.selected?.[0] || null));
    canvas.on("selection:cleared", () => setActiveObj(null));

    onCanvasReady(canvas);

    const resize = () => {
      const r = el.getBoundingClientRect();
      canvas.setDimensions({ width: r.width, height: r.height });
      setDims({ w: r.width, h: r.height });
      canvas.renderAll();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(el);

    return () => {
      ro.disconnect();
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = isSketching;
    }
  }, [isSketching]);

  return (
    <div className="relative h-full w-full glass rounded-2xl overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg animate-grid-drift opacity-60" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, oklch(0 0 0 / 0.6) 100%)",
        }}
      />

      {/* Forensic Proportion Guidelines overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-plus-lighter">
        {/* Vertical Midline */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20 border-l border-dashed border-primary/40" />
        
        {/* Eye Line */}
        <div className="absolute top-[40%] left-[10%] right-[10%] h-px border-t border-dashed border-primary/40" />
        <span className="absolute top-[40%] left-[10%] -translate-y-[120%] text-[8px] font-mono text-primary/60">EYE_LEVEL (RULE OF 1/2)</span>
        
        {/* Nose Line */}
        <div className="absolute top-[60%] left-[20%] right-[20%] h-px border-t border-dashed border-primary/40" />
        <span className="absolute top-[60%] left-[20%] -translate-y-[120%] text-[8px] font-mono text-primary/60">NASAL_BASE</span>

        {/* Mouth Line */}
        <div className="absolute top-[75%] left-[25%] right-[25%] h-px border-t border-dashed border-primary/40" />
        <span className="absolute top-[75%] left-[25%] -translate-y-[120%] text-[8px] font-mono text-primary/60">ORAL_COMMISSURE</span>
      </div>

      {/* Corner brackets */}
      {([
        ["top-3 left-3", "border-t border-l"],
        ["top-3 right-3", "border-t border-r"],
        ["bottom-3 left-3", "border-b border-l"],
        ["bottom-3 right-3", "border-b border-r"],
      ] as const).map(([pos, br], i) => (
        <div key={i} className={`absolute ${pos} h-4 w-4 ${br} border-primary/60`} />
      ))}

      {/* Top-left HUD */}
      <div className="absolute top-4 left-4 z-10 font-mono text-[10px] tracking-[0.18em] text-muted-foreground space-y-1">
        <div>SUBJECT_CANVAS_01</div>
        <div className="text-primary">{partCount} OBJECTS</div>
      </div>

      {/* Top-right HUD */}
      <div className="absolute top-4 right-4 z-10 font-mono text-[10px] tracking-[0.18em] text-muted-foreground text-right space-y-1">
        <div>{dims.w | 0}×{dims.h | 0}</div>
        <div className="text-primary">SECURE</div>
      </div>

      {/* Toolbar floating bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 glass-strong rounded-full px-2 py-1.5 flex items-center gap-1">
        <ToolBtn 
          icon={<Pencil className="h-3.5 w-3.5" />} 
          label="Sketch" 
          onClick={() => setIsSketching(prev => !prev)} 
          active={isSketching} 
        />
        <span className="h-4 w-px bg-white/10 mx-1" />
        <ToolBtn icon={<RotateCcw className="h-3.5 w-3.5" />} label="Undo" onClick={onUndo} />
        <span className="h-4 w-px bg-white/10 mx-1" />
        <ToolBtn icon={<Layers className="h-3.5 w-3.5" />} label="Layers" />
        <span className="h-4 w-px bg-white/10 mx-1" />
        <ToolBtn icon={<Trash2 className="h-3.5 w-3.5" />} label="Clear" onClick={onClear} danger />
      </div>

      {/* Canvas + drop zone */}
      <div
        ref={containerRef}
        className="absolute inset-0"
        onDragEnter={(e) => {
          if (e.dataTransfer.types.includes("application/x-thirdeye-part")) {
            e.preventDefault();
            setDragOver(true);
          }
        }}
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("application/x-thirdeye-part")) {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }
        }}
        onDragLeave={(e) => {
          // Only clear when leaving the container itself
          if (e.currentTarget === e.target) setDragOver(false);
        }}
        onDrop={(e) => {
          const id = e.dataTransfer.getData("application/x-thirdeye-part");
          if (!id) return;
          e.preventDefault();
          const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setDragOver(false);
          onDropPart(id, x, y);
        }}
      >
        <canvas ref={canvasElRef} />
      </div>

      {/* Drop highlight */}
      {dragOver && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl border-2 border-dashed border-primary/60 bg-primary/5 grid place-items-center z-20">
          <div className="glass-strong px-4 py-2 rounded-full font-mono text-[10px] tracking-[0.25em] text-primary">
            DROP TO PLACE COMPONENT
          </div>
        </div>
      )}

      {/* Morph Properties Panel */}
      <AnimatePresence>
        {activeObj && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-20 glass-strong p-4 rounded-xl w-48 space-y-4 border border-white/10"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <SlidersHorizontal className="h-3 w-3 text-primary" />
              <h3 className="text-[10px] font-mono tracking-widest text-primary uppercase mt-0.5">
                Morph Matrix
              </h3>
            </div>
            
            <div className="space-y-3">
              <MorphSlider 
                label="Width (X)" 
                value={activeObj.scaleX || 1} 
                min={0.5} max={2.5} 
                onChange={(v) => { activeObj.set('scaleX', v); fabricRef.current?.renderAll(); }} 
              />
              <MorphSlider 
                label="Height (Y)" 
                value={activeObj.scaleY || 1} 
                min={0.5} max={2.5} 
                onChange={(v) => { activeObj.set('scaleY', v); fabricRef.current?.renderAll(); }} 
              />
              <MorphSlider 
                label="Rotation" 
                value={activeObj.angle || 0} 
                min={-180} max={180} 
                onChange={(v) => { activeObj.set('angle', v); fabricRef.current?.renderAll(); }} 
              />
              <MorphSlider 
                label="Opacity" 
                value={activeObj.opacity ?? 1} 
                min={0.1} max={1} 
                onChange={(v) => { activeObj.set('opacity', v); fabricRef.current?.renderAll(); }} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{identifying && <ScanOverlay />}</AnimatePresence>

      {/* Empty state */}
      {partCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 grid place-items-center pointer-events-none"
        >
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
              AWAITING INPUT
            </p>
            <p className="text-xs text-muted-foreground/50 mt-2">
              Drag facial components from the panel
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ToolBtn({
  icon, label, onClick, danger, active,
}: { icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean; active?: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      title={label}
      className={`h-8 px-3 rounded-full flex items-center gap-1.5 text-[10px] font-mono tracking-wider transition-colors ${
        danger ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10" : active ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label.toUpperCase()}</span>
    </motion.button>
  );
}

function MorphSlider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] font-mono text-muted-foreground uppercase">
        <span>{label}</span>
        <span className="text-primary">{value.toFixed(2)}</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={(max - min) / 100}
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-primary h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
      />
    </div>
  )
}
