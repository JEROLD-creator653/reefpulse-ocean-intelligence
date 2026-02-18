import { motion } from "framer-motion";
import { GitBranch, Database, Cpu, BarChart3, Globe, Radio, ArrowRight } from "lucide-react";

const nodes = [
  { id: "sources", label: "Data Sources", icon: Database, desc: "NASA, NOAA, NCEI", col: 0 },
  { id: "ingest", label: "Data Ingestion", icon: Radio, desc: "Edge Functions + APIs", col: 1 },
  { id: "process", label: "Processing", icon: Cpu, desc: "Normalization & Validation", col: 2 },
  { id: "ai", label: "AI Scoring", icon: BarChart3, desc: "Isolation Forest Sim", col: 3 },
  { id: "dashboard", label: "Dashboard", icon: Globe, desc: "Real-time Visualization", col: 4 },
];

const techStack = [
  { category: "Frontend", items: ["React 18", "TypeScript", "Tailwind CSS", "Framer Motion", "React Three Fiber", "Recharts", "Leaflet"] },
  { category: "Backend", items: ["Lovable Cloud", "PostgreSQL", "Edge Functions", "Realtime Subscriptions"] },
  { category: "Data", items: ["NASA Ocean Color", "NOAA Tides API", "NCEI Water Quality", "Simulated Sensors"] },
  { category: "AI/ML", items: ["Isolation Forest (Simulated)", "Weighted Threshold Scoring", "Anomaly Detection", "Classification Engine"] },
];

export default function Architecture() {
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <GitBranch className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">System Architecture</h1>
      </div>

      {/* Pipeline */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 md:p-8">
        <h3 className="font-display font-semibold text-foreground mb-8 text-center">Data Pipeline</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
          {nodes.map((node, i) => (
            <div key={node.id} className="flex items-center gap-2 md:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-hover p-4 md:p-6 text-center min-w-[120px]"
              >
                <node.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-sm font-display font-semibold text-foreground">{node.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{node.desc}</div>
              </motion.div>
              {i < nodes.length - 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.1 }}>
                  <ArrowRight className="h-5 w-5 text-primary/50 hidden md:block" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {techStack.map((group, i) => (
          <motion.div key={group.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card p-5">
            <h4 className="font-display font-semibold text-primary text-sm mb-3">{group.category}</h4>
            <ul className="space-y-1.5">
              {group.items.map(item => (
                <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
