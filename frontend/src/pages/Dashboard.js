import { useMemo, useState, useEffect } from "react";
import { Menu, X, ShieldAlert, BarChart3, History, Settings, SunMoon } from "lucide-react";
import LiveMap from "../components/LiveMap";
import DriverList from "../components/DriverList";
import TelemetryBento from "../components/TelemetryBento";
import AlertsCenter from "../components/AlertsCenter";
import DriverDetailSheet from "../components/DriverDetailSheet";
import CrashHistoryModal from "../components/CrashHistoryModal";
import CrashStatsWidget from "../components/CrashStatsWidget";
import { useCrashSocket } from "../lib/ws";

export default function Dashboard() {
  const { drivers, alerts, setAlerts, status, lastImpactId } = useCrashSocket();
  const [selectedId, setSelectedId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState("monitor");
  const [theme, setTheme] = useState(() => localStorage.getItem("crash-theme") || "dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("crash-theme", theme);
    window.dispatchEvent(new Event("themechange"));
  }, [theme]);

  const driverList = Object.values(drivers || {});
  const selected = useMemo(() => {
    if (selectedId && drivers[selectedId]) return drivers[selectedId];
    if (driverList.length > 0) return driverList[0];
    return null;
  }, [selectedId, drivers, driverList]);

  const openDetail = (id) => { setDetailId(id); setSheetOpen(true); };
  const activeAlertCount = alerts.filter((a) => a.status === "pending").length;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#080808] text-white">
      <aside className={`${sidebarOpen ? "w-72" : "w-16"} transition-all duration-300 border-r border-[#7f1d1d]/40 bg-gradient-to-b from-[#130b0b] to-[#090909] p-3 flex flex-col gap-3`}>
        <button onClick={() => setSidebarOpen((v) => !v)} className="h-10 w-10 rounded-lg border border-white/10 flex items-center justify-center">{sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        <div className="flex items-center gap-2 px-1">
          <ShieldAlert className="h-7 w-7 text-[#c2413a]" />
          {sidebarOpen ? <div><div className="text-sm font-bold">C.R.A.S.H.</div><div className="text-[10px] text-neutral-400">Command Center</div></div> : null}
        </div>
        {sidebarOpen ? (
          <>
            <button onClick={() => setTab("monitor")} className="px-3 py-2 rounded-lg border border-white/10 text-left">Monitoreo</button>
            <button onClick={() => setTab("stats")} className="px-3 py-2 rounded-lg border border-white/10 text-left flex items-center gap-2"><BarChart3 className="h-4 w-4"/> Estadísticas</button>
            <button onClick={() => setHistoryOpen(true)} className="px-3 py-2 rounded-lg border border-white/10 text-left flex items-center gap-2"><History className="h-4 w-4"/> Historial choques</button>
            <button onClick={() => setTab("settings")} className="px-3 py-2 rounded-lg border border-white/10 text-left flex items-center gap-2"><Settings className="h-4 w-4"/> Configuración</button>
            <label className="mt-2 flex items-center justify-between rounded-lg border border-white/10 px-3 py-2">
              <span className="text-xs flex items-center gap-2"><SunMoon className="h-4 w-4"/> Tema</span>
              <button onClick={() => setTheme((v) => (v === "dark" ? "light" : "dark"))} className={`relative h-6 w-11 rounded-full ${theme === "dark" ? "bg-[#7f1d1d]" : "bg-emerald-500"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${theme === "dark" ? "left-0.5" : "left-5"}`} />
              </button>
            </label>
          </>
        ) : null}
      </aside>

      <main className="flex-1 p-3 overflow-hidden">
        {tab === "monitor" ? (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
            <aside className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 min-h-0 flex flex-col"><DriverList drivers={drivers} selectedId={selected?.id} onSelect={setSelectedId} onOpenDetail={openDetail} /></aside>
            <section className="lg:col-span-6 flex flex-col gap-3 min-h-0"><div className="flex-1 rounded-2xl border border-white/10 overflow-hidden min-h-[280px]"><LiveMap drivers={drivers} selectedId={selected?.id} onSelect={setSelectedId} /></div><TelemetryBento driver={selected} /></section>
            <aside className="lg:col-span-3 min-h-0"><AlertsCenter alerts={alerts} setAlerts={setAlerts} lastImpactId={lastImpactId} onSelectDriver={setSelectedId} onOpenDriverDetail={openDetail} /></aside>
          </div>
        ) : null}
        {tab === "stats" ? <div className="h-full overflow-auto"><CrashStatsWidget /></div> : null}
        {tab === "settings" ? <div className="h-full rounded-2xl border border-white/10 p-6 bg-white/[0.02]"><h2 className="text-xl font-bold mb-4">Configuración recomendada por usuario</h2><ul className="space-y-3 text-sm text-neutral-300"><li>• Umbral G personalizado por tipo de vehículo.</li><li>• Tiempo de confirmación automática de alerta (15-60s).</li><li>• Sensibilidad GPS mínima para validar impacto.</li><li>• Canal preferido de aviso a contacto (SMS/WhatsApp/Llamada).</li><li>• Geocercas de zonas de alto riesgo.</li></ul></div> : null}
      </main>

      <DriverDetailSheet driverId={detailId} driver={detailId ? drivers[detailId] : null} open={sheetOpen} onOpenChange={setSheetOpen} />
      <CrashHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}
