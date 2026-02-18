import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const statusColors: Record<string, string> = { safe: "#4caf50", caution: "#ff9800", avoid: "#f44336" };

export default function TidePlanner() {
  const [dayOffset, setDayOffset] = useState(0);
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  const dateStr = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  const tideData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const height = 1.5 + Math.sin((i + dayOffset) / 24 * Math.PI * 2) * 1.2 + Math.sin((i + dayOffset) / 12 * Math.PI * 2) * 0.4;
      const cls = height > 2.0 ? "avoid" : height > 1.2 ? "safe" : "caution";
      return { hour: i, label: `${i}:00`, height: Math.round(height * 100) / 100, classification: cls };
    });
  }, [dayOffset]);

  const safeWindows = useMemo(() => {
    const windows: { start: number; end: number }[] = [];
    let start = -1;
    tideData.forEach((t, i) => {
      if (t.classification === "safe" && start === -1) start = i;
      if (t.classification !== "safe" && start !== -1) { windows.push({ start, end: i - 1 }); start = -1; }
    });
    if (start !== -1) windows.push({ start, end: 23 });
    return windows;
  }, [tideData]);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Tide Workday Planner</h1>
      </div>

      {/* Day selector */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setDayOffset(d => d - 1)}><ChevronLeft className="h-5 w-5" /></Button>
        <span className="font-display font-semibold text-foreground text-lg">{dateStr}</span>
        <Button variant="ghost" size="icon" onClick={() => setDayOffset(d => d + 1)}><ChevronRight className="h-5 w-5" /></Button>
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground text-sm mb-4">24-Hour Timeline</h3>
        <div className="flex gap-0.5 h-12 rounded-lg overflow-hidden">
          {tideData.map((t) => (
            <div key={t.hour} className="flex-1 relative group cursor-pointer transition-all hover:scale-y-110"
              style={{ backgroundColor: statusColors[t.classification] + "80" }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block glass-card px-2 py-1 text-xs text-foreground whitespace-nowrap z-10">
                {t.label} — {t.height}m — {t.classification}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs">
          {Object.entries(statusColors).map(([k, c]) => (
            <span key={k} className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: c }} /> {k.charAt(0).toUpperCase() + k.slice(1)}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tide height chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">Tide Height</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={tideData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 40% 15%)" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} />
              <Tooltip contentStyle={{ background: "hsl(210 60% 6%)", border: "1px solid hsl(200 40% 15%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="height" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.15} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Work windows */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground text-sm mb-4">Optimal Work Windows</h3>
          <div className="space-y-3">
            {safeWindows.length > 0 ? safeWindows.map((w, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-reef-safe/10 border border-reef-safe/20">
                <div>
                  <div className="text-sm font-semibold text-foreground">{w.start}:00 — {w.end}:00</div>
                  <div className="text-xs text-muted-foreground">{w.end - w.start + 1} hour window</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-reef-safe/20 text-reef-safe">RECOMMENDED</span>
              </div>
            )) : (
              <div className="text-center text-muted-foreground text-sm py-8">No safe windows for this day</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
