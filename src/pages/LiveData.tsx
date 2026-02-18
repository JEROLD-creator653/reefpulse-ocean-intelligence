import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DataEntry {
  id: string;
  station: string;
  temperature: number;
  turbidity: number;
  chlorophyll: number;
  dissolved_oxygen: number;
  anomaly_score: number;
  classification: string;
  timestamp: string;
}

function generateMockEntry(): DataEntry {
  const stations = ["GBR-N", "GBR-C", "Maldives", "Belize", "Red Sea", "Hawaii"];
  const cls = Math.random() > 0.7 ? (Math.random() > 0.5 ? "caution" : "avoid") : "safe";
  return {
    id: crypto.randomUUID(),
    station: stations[Math.floor(Math.random() * stations.length)],
    temperature: +(24 + Math.random() * 6).toFixed(1),
    turbidity: +(0.5 + Math.random() * 4.5).toFixed(2),
    chlorophyll: +(0.1 + Math.random() * 0.9).toFixed(2),
    dissolved_oxygen: +(5 + Math.random() * 3).toFixed(1),
    anomaly_score: +(Math.random() * 0.8).toFixed(3),
    classification: cls,
    timestamp: new Date().toISOString(),
  };
}

const classColors: Record<string, string> = { safe: "text-reef-safe", caution: "text-reef-caution", avoid: "text-reef-avoid" };

export default function LiveData() {
  const [entries, setEntries] = useState<DataEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Subscribe to realtime + generate mock data as fallback
  useEffect(() => {
    // Initial mock entries
    const initial = Array.from({ length: 10 }, () => generateMockEntry());
    setEntries(initial);

    // Simulate live data
    const interval = setInterval(() => {
      setEntries(prev => [generateMockEntry(), ...prev.slice(0, 49)]);
    }, 2500);

    // Realtime subscription
    const channel = supabase
      .channel("reef-readings-live")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reef_readings" }, (payload) => {
        const r = payload.new as any;
        setEntries(prev => [{
          id: r.id,
          station: r.station_id?.slice(0, 8) || "Unknown",
          temperature: r.temperature,
          turbidity: r.turbidity,
          chlorophyll: r.chlorophyll,
          dissolved_oxygen: r.dissolved_oxygen,
          anomaly_score: r.anomaly_score,
          classification: r.classification,
          timestamp: r.timestamp,
        }, ...prev.slice(0, 49)]);
      })
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Radio className="h-6 w-6 text-primary animate-pulse-glow" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Live Data Stream</h1>
        <div className="flex items-center gap-1.5 ml-auto">
          <Circle className="h-2.5 w-2.5 fill-reef-safe text-reef-safe animate-pulse" />
          <span className="text-xs text-muted-foreground">LIVE</span>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="glass-card rounded-xl overflow-hidden font-mono text-xs md:text-sm">
        {/* Header */}
        <div className="grid grid-cols-7 gap-2 px-4 py-3 border-b border-border text-muted-foreground font-semibold text-xs">
          <span>TIME</span><span>STATION</span><span>TEMP</span><span>TURB</span><span>CHLOR</span><span>SCORE</span><span>STATUS</span>
        </div>
        {/* Entries */}
        <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto scrollbar-hide">
          <AnimatePresence initial={false}>
            {entries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-7 gap-2 px-4 py-2.5 border-b border-border/30 hover:bg-secondary/30 transition-colors"
              >
                <span className="text-muted-foreground">{new Date(e.timestamp).toLocaleTimeString()}</span>
                <span className="text-primary">{e.station}</span>
                <span className="text-foreground">{e.temperature}°C</span>
                <span className="text-foreground">{e.turbidity}</span>
                <span className="text-foreground">{e.chlorophyll}</span>
                <span className="text-foreground">{e.anomaly_score}</span>
                <span className={`font-semibold ${classColors[e.classification]}`}>{e.classification.toUpperCase()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Particles decoration */}
      <div className="relative h-16 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/40"
            animate={{ y: [-20, -80], opacity: [0, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            style={{ left: `${8 + i * 8}%`, bottom: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
