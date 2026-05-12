import { LogOut, Wifi, WifiOff, History } from "lucide-react";
import { useEffect, useState } from "react";
import CrashStatsWidget from "./CrashStatsWidget";
import { useAuth } from "../auth/AuthContext";
import { Switch } from "./ui/switch";

const STATUS_LABEL = {
  connecting: "Conectando",
  open: "En vivo",
  closed: "Reconectando",
};

function CrashLogo() {
  return (
    <svg viewBox="0 0 333 306" className="h-5 w-5 text-red-500" aria-hidden="true">
      <g transform="translate(0,306) scale(0.1,-0.1)" fill="currentColor" stroke="none">
        <path d="M1535 2895 c-44 -37 -295 -160 -407 -199 -179 -64 -366 -107 -573 -131 -212 -25 -202 -23 -208 -48 -3 -12 -11 -106 -18 -209 -10 -149 -10 -229 0 -390 7 -111 16 -209 20 -216 5 -9 14 2 26 35 17 42 19 72 16 255 -4 260 7 464 25 482 7 8 44 17 81 20 104 11 285 44 413 76 203 51 360 112 548 210 118 62 144 69 177 47 44 -30 176 -97 275 -140 216 -93 459 -156 743 -191 60 -8 114 -19 120 -25 8 -8 12 -111 14 -325 2 -264 5 -320 19 -355 9 -22 20 -41 24 -41 9 0 17 67 26 215 5 106 -10 504 -22 552 -7 27 -2 26 -199 48 -371 41 -727 157 -981 320 -64 41 -79 42 -119 10z"/>
        <path d="M1359 2575 c-248 -52 -437 -152 -595 -317 -67 -70 -99 -117 -156 -228 -38 -76 -47 -110 -27 -110 26 0 49 24 73 76 81 176 282 362 489 452 182 78 398 108 604 82 375 -46 684 -248 810 -528 34 -76 42 -85 59 -71 20 16 17 52 -8 107 -75 163 -192 284 -388 399 -253 149 -567 199 -861 138z"/>
      </g>
    </svg>
  );
}

export default function Topbar({ status, alertCount, onOpenHistory }) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("crash-theme") || "dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("crash-theme", theme);
    window.dispatchEvent(new Event("themechange"));
  }, [theme]);

  return (
    <header className="flex items-center justify-between px-4 py-3 rounded-2xl border border-red-500/30 bg-white/[0.03] backdrop-blur-2xl red-accent-panel">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.28)]">
          <CrashLogo />
        </div>
        <div className="leading-tight">
          <div className="text-[9px] uppercase tracking-[0.4em] text-neutral-500">Critical Response Alert System</div>
          <div className="font-bold tracking-tight">C.R.A.S.H. <span className="text-red-400">2.0</span> · Command Center</div>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-[10px] uppercase tracking-[0.2em] text-neutral-200">
          Claro
          <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
          Oscuro
        </label>

        <CrashStatsWidget />

        <button data-testid="open-crash-history" onClick={onOpenHistory} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-400/70 hover:bg-red-500/10 text-[10px] uppercase tracking-[0.25em] text-neutral-300 hover:text-red-300 transition-all" title="Historial completo de choques">
          <History className="h-3.5 w-3.5" />Historial de choques
        </button>

        <div data-testid="ws-status" className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] uppercase tracking-[0.25em] ${status === "open" ? "border-red-500/40 bg-red-500/10 text-red-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
          {status === "open" ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {STATUS_LABEL[status] || status}
        </div>

        {alertCount > 0 ? <div data-testid="alert-count" className="px-3 py-1.5 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 text-[10px] uppercase tracking-[0.25em] alert-flashing">{alertCount} alerta{alertCount > 1 ? "s" : ""} crítica{alertCount > 1 ? "s" : ""}</div> : null}

        {user ? (
          <div className="flex items-center gap-2 pl-3 border-l border-white/10">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-neutral-500">{user.role}</div>
            </div>
            <button data-testid="logout-btn" onClick={logout} className="ml-2 h-9 w-9 rounded-lg border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 flex items-center justify-center transition-all group" title="Cerrar sesión">
              <LogOut className="h-4 w-4 text-neutral-400 group-hover:text-red-400" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
