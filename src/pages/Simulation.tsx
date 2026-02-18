import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Cpu, Thermometer, Factory, Fish } from "lucide-react";

export default function Simulation() {
  const [temperature, setTemperature] = useState([26]);
  const [pollution, setPollution] = useState([20]);
  const [fishing, setFishing] = useState([30]);

  const healthScore = useMemo(() => {
    const tempPenalty = Math.max(0, (temperature[0] - 28) * 15);
    const pollPenalty = pollution[0] * 0.5;
    const fishPenalty = fishing[0] * 0.3;
    return Math.max(0, Math.min(100, 100 - tempPenalty - pollPenalty - fishPenalty));
  }, [temperature, pollution, fishing]);

  const classification = healthScore > 66 ? "safe" : healthScore > 33 ? "caution" : "avoid";
  const classColor = classification === "safe" ? "text-reef-safe" : classification === "caution" ? "text-reef-caution" : "text-reef-avoid";

  const futureData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const yearOffset = i;
      const decay = (100 - healthScore) * 0.08 * yearOffset;
      return {
        year: `Y+${i}`,
        health: Math.max(0, healthScore - decay + (Math.random() - 0.5) * 5),
        coral: Math.max(0, healthScore * 0.8 - decay * 0.9 + (Math.random() - 0.5) * 3),
      };
    });
  }, [healthScore]);

  const coralSegments = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      const alive = Math.random() * 100 < healthScore;
      return { id: i, alive, height: 20 + Math.random() * 40 };
    });
  }, [healthScore]);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Cpu className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Reef Digital Twin</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 space-y-8">
          <h3 className="font-display font-semibold text-foreground">Simulation Controls</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Thermometer className="h-4 w-4" /> Temperature</span>
                <span className="text-sm font-semibold text-foreground">{temperature[0]}°C</span>
              </div>
              <Slider value={temperature} onValueChange={setTemperature} min={20} max={35} step={0.5} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Factory className="h-4 w-4" /> Pollution Level</span>
                <span className="text-sm font-semibold text-foreground">{pollution[0]}%</span>
              </div>
              <Slider value={pollution} onValueChange={setPollution} min={0} max={100} step={1} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-2 text-sm text-muted-foreground"><Fish className="h-4 w-4" /> Fishing Pressure</span>
                <span className="text-sm font-semibold text-foreground">{fishing[0]}%</span>
              </div>
              <Slider value={fishing} onValueChange={setFishing} min={0} max={100} step={1} />
            </div>
          </div>

          <div className="text-center pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground mb-1">Reef Health Score</div>
            <motion.div key={healthScore} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className={`text-5xl font-display font-bold ${classColor}`}>
              {healthScore.toFixed(0)}
            </motion.div>
            <div className={`text-sm font-semibold mt-1 ${classColor}`}>{classification.toUpperCase()}</div>
          </div>
        </motion.div>

        {/* Reef Visualization */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Reef Health Visualization</h3>
          <div className="relative h-48 bg-ocean-deep rounded-lg overflow-hidden flex items-end justify-center gap-1 px-4 pb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-mid to-transparent opacity-50" />
            {coralSegments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ height: 0 }}
                animate={{ height: c.height }}
                transition={{ duration: 0.5, delay: c.id * 0.03 }}
                className="relative z-10 rounded-t-full"
                style={{
                  width: 12,
                  backgroundColor: c.alive
                    ? `hsl(${142 + Math.random() * 40}, 70%, ${40 + Math.random() * 20}%)`
                    : `hsl(0, 0%, ${30 + Math.random() * 20}%)`,
                  opacity: c.alive ? 1 : 0.5,
                }}
              />
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-foreground mb-3">Future Projection</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={futureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(200 40% 15%)" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(200 30% 55%)" }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "hsl(210 60% 6%)", border: "1px solid hsl(200 40% 15%)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="health" stroke="#4caf50" strokeWidth={2} dot={false} name="Health" />
                <Line type="monotone" dataKey="coral" stroke="#00bcd4" strokeWidth={2} dot={false} name="Coral Cover" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
