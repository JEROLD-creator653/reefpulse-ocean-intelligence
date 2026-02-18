import { motion } from "framer-motion";
import { Database, ExternalLink, Microscope } from "lucide-react";
import { Button } from "@/components/ui/button";

const dataSources = [
  {
    name: "NASA Ocean Color",
    desc: "Sea surface temperature and chlorophyll-a concentration from satellite imagery. Global coverage with daily updates.",
    url: "https://oceancolor.gsfc.nasa.gov/",
    params: ["Chlorophyll-a", "Sea Surface Temperature", "Photosynthetically Active Radiation"],
  },
  {
    name: "NOAA Tides & Currents",
    desc: "Tide predictions, water levels, and current data from coastal stations. Real-time and forecast data.",
    url: "https://tidesandcurrents.noaa.gov/api/",
    params: ["Tide Height", "Water Temperature", "Salinity", "Currents"],
  },
  {
    name: "NCEI Coastal Water Quality",
    desc: "Historical coastal water quality measurements including dissolved oxygen, turbidity, and nutrient levels.",
    url: "https://www.ncei.noaa.gov/",
    params: ["Dissolved Oxygen", "Turbidity", "pH", "Nutrients"],
  },
  {
    name: "NASA NEO",
    desc: "Near-Earth observations providing global environmental monitoring datasets for climate research.",
    url: "https://neo.gsfc.nasa.gov/",
    params: ["Sea Surface Temp", "Ocean Color", "Aerosol Index"],
  },
];

export default function DataSources() {
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Database className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Data Sources & Research</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dataSources.map((ds, i) => (
          <motion.div key={ds.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6">
            <h3 className="font-display font-semibold text-foreground text-lg mb-2">{ds.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{ds.desc}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {ds.params.map(p => (
                <span key={p} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{p}</span>
              ))}
            </div>
            <a href={ds.url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-3 w-3" /> Visit Source
              </Button>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Model Explanation */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Microscope className="h-5 w-5 text-primary" />
          <h2 className="font-display font-semibold text-foreground text-lg">Model Methodology</h2>
        </div>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            ReefPulse uses a <strong className="text-foreground">simulated Isolation Forest</strong> approach for anomaly detection. The model evaluates four key parameters:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { param: "Temperature", weight: "35%", desc: "Deviation from optimal coral range (24-28°C)" },
              { param: "Chlorophyll", weight: "25%", desc: "Proxy for algal bloom and nutrient loading" },
              { param: "Dissolved Oxygen", weight: "20%", desc: "Indicator of water quality and marine life support" },
              { param: "Turbidity", weight: "20%", desc: "Measure of water clarity and sediment load" },
            ].map(p => (
              <div key={p.param} className="glass-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-foreground font-semibold">{p.param}</span>
                  <span className="text-primary text-xs">{p.weight}</span>
                </div>
                <p className="text-xs">{p.desc}</p>
              </div>
            ))}
          </div>
          <p>
            Each parameter is scored against known thresholds, weighted, and combined to produce a <strong className="text-foreground">Reef Anomaly Score (0–1)</strong>. Scores are classified as:
            <span className="text-reef-safe font-semibold"> Safe (&lt;0.33)</span>,
            <span className="text-reef-caution font-semibold"> Caution (0.33–0.66)</span>, or
            <span className="text-reef-avoid font-semibold"> Avoid (&gt;0.66)</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
