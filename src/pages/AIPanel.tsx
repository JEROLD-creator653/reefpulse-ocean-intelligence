import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Brain, AlertTriangle, CheckCircle } from "lucide-react";

const factors = [
  { name: "Temperature", weight: 0.35, value: 26.3, normal: "24-28°C", status: "normal", score: 0.15 },
  { name: "Chlorophyll", weight: 0.25, value: 0.58, normal: "0.1-1.0 µg/L", status: "normal", score: 0.1 },
  { name: "Dissolved O₂", weight: 0.2, value: 6.8, normal: "5-8 mg/L", status: "normal", score: 0.08 },
  { name: "Turbidity", weight: 0.2, value: 3.2, normal: "0-5 NTU", status: "elevated", score: 0.35 },
];

const radarData = factors.map(f => ({ factor: f.name, value: f.score * 100, weight: f.weight * 100 }));
const contributionData = factors.map(f => ({ name: f.name, contribution: f.weight * f.score * 100 }));

const anomalies = [
  { id: 1, timestamp: "2026-02-18 14:23", param: "Turbidity", value: 4.8, threshold: 5.0, status: "warning" },
  { id: 2, timestamp: "2026-02-18 13:45", param: "Temperature", value: 29.1, threshold: 28.0, status: "alert" },
  { id: 3, timestamp: "2026-02-18 12:10", param: "Chlorophyll", value: 0.95, threshold: 1.0, status: "warning" },
];

export default function AIPanel() {
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">AI Explainability</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Factor Analysis</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(200 40% 15%)" />
              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: "hsl(200 30% 55%)" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(200 30% 55%)" }} />
              <Radar name="Score" dataKey="value" stroke="#00bcd4" fill="#00bcd4" fillOpacity={0.2} />
              <Radar name="Weight" dataKey="weight" stroke="#ff9800" fill="#ff9800" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weight contributions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Factor Contributions</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={contributionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 40% 15%)" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(200 30% 55%)" }} width={100} />
              <Tooltip contentStyle={{ background: "hsl(210 60% 6%)", border: "1px solid hsl(200 40% 15%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="contribution" fill="hsl(185 80% 55%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Factor details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {factors.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">{f.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{(f.weight * 100).toFixed(0)}%</span>
            </div>
            <div className="text-2xl font-display font-bold text-foreground">{f.value}</div>
            <div className="text-xs text-muted-foreground mt-1">Normal: {f.normal}</div>
            <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${f.score * 100}%` }}
                className={`h-full rounded-full ${f.score < 0.3 ? "bg-reef-safe" : f.score < 0.6 ? "bg-reef-caution" : "bg-reef-avoid"}`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Anomaly Detection */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Anomaly Detection Output</h3>
        <div className="space-y-3">
          {anomalies.map((a) => (
            <div key={a.id} className={`flex items-center justify-between p-3 rounded-lg ${a.status === "alert" ? "bg-reef-avoid/10 border border-reef-avoid/20" : "bg-reef-caution/10 border border-reef-caution/20"}`}>
              <div className="flex items-center gap-3">
                {a.status === "alert" ? <AlertTriangle className="h-4 w-4 text-reef-avoid" /> : <CheckCircle className="h-4 w-4 text-reef-caution" />}
                <div>
                  <div className="text-sm font-semibold text-foreground">{a.param}: {a.value}</div>
                  <div className="text-xs text-muted-foreground">Threshold: {a.threshold} • {a.timestamp}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${a.status === "alert" ? "bg-reef-avoid/20 text-reef-avoid" : "bg-reef-caution/20 text-reef-caution"}`}>
                {a.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
