import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Scan, Lock, User, ArrowRight, ShieldAlert } from "lucide-react";
import { login, getSession, DEMO_CREDENTIALS } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Secure Access — Third Eye" },
      { name: "description", content: "Authenticate to enter the Third Eye forensic intelligence hub." },
    ],
  }),
  beforeLoad: () => {
    if (typeof window !== "undefined" && getSession()) throw redirect({ to: "/" });
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const s = login(u.trim(), p);
    if (!s) {
      setErr("Access denied. Invalid credentials.");
      setLoading(false);
      return;
    }
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen grid place-items-center p-6 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-40 animate-grid-drift" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, oklch(0.65 0.25 305 / 0.18), transparent 60%)" }} />

      {/* Floating glyphs */}
      <div className="absolute top-10 left-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/40">
        SECTOR_07 // INGRESS_NODE
      </div>
      <div className="absolute bottom-10 right-10 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/40">
        ENC_AES-256 / TLS_1.3
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-8 glow-soft"
      >
        {/* Corner brackets */}
        {(["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"]).map((c, i) => (
          <div key={i} className={`absolute ${c} h-4 w-4 border-primary/50`} />
        ))}

        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 rounded-2xl gradient-cyber grid place-items-center glow-cyber">
            <Scan className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Third <span className="text-gradient-cyber">Eye</span>
            </h1>
            <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground mt-1">
              FORENSIC AI · CLEARANCE REQUIRED
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field icon={<User className="h-3.5 w-3.5" />} label="OPERATOR ID">
            <input
              autoFocus
              value={u}
              onChange={(e) => setU(e.target.value)}
              placeholder="agent"
              autoComplete="username"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/40"
            />
          </Field>
          <Field icon={<Lock className="h-3.5 w-3.5" />} label="ACCESS KEY">
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/40"
            />
          </Field>

          {err && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs text-destructive font-mono px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {err}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 gradient-cyber text-white font-semibold text-sm rounded-xl px-4 py-3 flex items-center justify-center gap-2 glow-soft hover:glow-cyber transition-shadow disabled:opacity-60"
          >
            {loading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full"
                />
                AUTHENTICATING…
              </>
            ) : (
              <>
                AUTHORIZE ACCESS
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-muted-foreground/70">
          <div className="flex justify-between">
            <span>DEMO CREDENTIALS</span>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => { setU(DEMO_CREDENTIALS.username); setP(DEMO_CREDENTIALS.password); }}
            >
              autofill
            </button>
          </div>
          <div className="mt-1 text-foreground/80">
            {DEMO_CREDENTIALS.username} · {DEMO_CREDENTIALS.password}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block group">
      <div className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground mb-1.5">{label}</div>
      <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-black/40 border border-white/8 focus-within:border-primary/50 focus-within:glow-soft transition-all">
        <span className="text-muted-foreground group-focus-within:text-primary transition-colors">{icon}</span>
        {children}
      </div>
    </label>
  );
}
