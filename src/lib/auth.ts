// Mock auth — demo credential store. NOT for production.
const VALID = [
  { username: "agent", password: "thirdeye2025", name: "Agent K-07", clearance: "OMEGA" },
  { username: "admin", password: "admin", name: "Director Vance", clearance: "ALPHA" },
];

const KEY = "thirdeye.session";

export type Session = { username: string; name: string; clearance: string; ts: number };

export function login(username: string, password: string): Session | null {
  const u = VALID.find((v) => v.username === username && v.password === password);
  if (!u) return null;
  const s: Session = { username: u.username, name: u.name, clearance: u.clearance, ts: Date.now() };
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s));
  return s;
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function logout() {
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
}

export const DEMO_CREDENTIALS = { username: "agent", password: "thirdeye2025" };
