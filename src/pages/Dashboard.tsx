import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Thermometer, Droplets, Wind, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";

const statusColor: Record<string, string> = { safe: "#4caf50", caution: "#ff9800", avoid: "#f44336" };

function GaugeChart({ score, label }: { score: number; label: string }) {
  const classification = score < 0.33 ? "safe" : score < 0.66 ? "caution" : "avoid";
  const color = statusColor[classification];
  const angle = score * 180;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 70" className="w-40">
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="hsl(200 40% 15%)" strokeWidth="8" strokeLinecap="round" />
        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${(angle / 180) * 157} 157`} />
        <text x="60" y="55" textAnchor="middle" fill={color} fontSize="18" fontWeight="bold">{(score * 100).toFixed(0)}</text>
      </svg>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
      <span className="text-xs font-semibold mt-0.5" style={{ color }}>{classification.toUpperCase()}</span>
    </div>
  );
}

export default function Dashboard() {
  const [stations, setStations] = useState<any[]>([]);
  const [readings, setReadings] = useState<any[]>([]);
  const [tides, setTides] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: s } = await supabase.from("reef_stations").select("*");
      setStations(s || []);
      const { data: r } = await supabase.from("reef_readings").select("*").order("timestamp", { ascending: false }).limit(50);
      setReadings(r || []);
      const { data: t } = await supabase.from("tide_predictions").select("*").limit(24);
      setTides(t || []);
    };
    load();
  }, []);

  // Generate mock data for charts if DB is empty
  const trendData = readings.length > 0
    ? readings.slice(0, 12).reverse().map((r, i) => ({ time: `T-${12 - i}`, temp: r.temperature, chlor: r.chlorophyll, turb: r.turbidity }))
    : Array.from({ length: 12 }, (_, i) => ({
        time: `T-${12 - i}`,
        temp: 24 + Math.random() * 6,
        chlor: 0.3 + Math.random() * 0.8,
        turb: 1 + Math.random() * 4,
      }));

  const tideData = tides.length > 0
    ? tides.map(t => ({ hour: `${t.hour}:00`, height: t.tide_height, classification: t.classification }))
    : Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        height: 1.5 + Math.sin(i / 24 * Math.PI * 2) * 1.2 + Math.random() * 0.3,
        classification: i > 6 && i < 18 ? "safe" : i > 4 && i < 20 ? "caution" : "avoid",
      }));

  const avgScore = readings.length > 0
    ? readings.reduce((a, r) => a + r.anomaly_score, 0) / readings.length
    : 0.28;

  // Default station positions for map
  const mapStations = stations.length > 0 ? stations : [
    { id: "1", name: "Great Barrier Reef - North", lat: -16.2, lng: 145.8, region: "Coral Sea" },
    { id: "2", name: "Great Barrier Reef - Central", lat: -18.5, lng: 147.2, region: "Coral Sea" },
    { id: "3", name: "Maldives - Ari Atoll", lat: 3.9, lng: 72.8, region: "Indian Ocean" },
    { id: "4", name: "Caribbean - Belize Barrier", lat: 17.5, lng: -87.8, region: "Caribbean Sea" },
    { id: "5", name: "Red Sea - Ras Mohammed", lat: 27.7, lng: 34.2, region: "Red Sea" },
    { id: "6", name: "Hawaii", lat: 25.0, lng: -170.0, region: "Pacific Ocean" },
  ];

  const stationClassification = (i: number) => ["safe", "safe", "caution", "safe", "avoid", "safe"][i % 6];

  return (
    <div className="p-4 md:p-6 max-w-[1800px] mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Global Reef Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 glass-card p-4 rounded-xl overflow-hidden" style={{ height: 420 }}>
          <h3 className="font-display font-semibold text-foreground text-sm mb-3">Reef Station Network</h3>
          <div className="rounded-lg overflow-hidden" style={{ height: 370 }}>
            <MapContainer center={[10, 60]} zoom={2} style={{ height: "100%", width: "100%" }} attributionControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              {mapStations.map((s, i) => {
                const cls = stationClassification(i);
                return (
                  <CircleMarker key={s.id} center={[s.lat, s.lng]} radius={8}
                    pathOptions={{ color: statusColor[cls], fillColor: statusColor[cls], fillOpacity: 0.7, weight: 2 }}>
                    <Popup><div className="text-xs"><strong>{s.name}</strong><br/>{s.region}<br/>Status: <span style={{ color: statusColor[cls] }}>{cls.toUpperCase()}</span></div></Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </motion.div>

        {/* RWSI Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="font-display font-semibold text-foreground text-sm">Reef Workday Stability Index</h3>
          <GaugeChart score={avgScore} label="Global Average" />
          <div className="grid grid-cols-3 gap-4 w-full mt-4">
            {[
              { icon: Thermometer, label: "Temp", value: "26.3°C", color: "text-reef-safe" },
              { icon: Droplets, label: "Chlor", value: "0.58 µg/L", color: "text-primary" },
              { icon: Wind, label: "Turb", value: "2.1 NTU", color: "text-reef-caution" },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <m.icon className={`h-4 w-4 mx-auto mb-1 ${m.color}`} />
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-sm font-semibold text-foreground">{m.value}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-reef-safe/10 text-reef-safe text-xs">
            <AlertTriangle className="h-3 w-3" /> Low anomaly risk detected
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">Tide Prediction (24h)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tideData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 40% 15%)" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} />
              <Tooltip contentStyle={{ background: "hsl(210 60% 6%)", border: "1px solid hsl(200 40% 15%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="height" fill="hsl(185 80% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">Anomaly Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 40% 15%)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} />
              <Tooltip contentStyle={{ background: "hsl(210 60% 6%)", border: "1px solid hsl(200 40% 15%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="temp" stroke="#4caf50" fill="#4caf50" fillOpacity={0.1} name="Temperature" />
              <Area type="monotone" dataKey="chlor" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.1} name="Chlorophyll" />
              <Area type="monotone" dataKey="turb" stroke="#ff9800" fill="#ff9800" fillOpacity={0.1} name="Turbidity" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
