import { motion } from "framer-motion";
import { Users, Globe, Shield, Waves, Heart, Target } from "lucide-react";

const metrics = [
  { icon: Globe, label: "Reefs Monitored", value: "6", color: "text-primary" },
  { icon: Shield, label: "Alerts Issued", value: "142", color: "text-reef-caution" },
  { icon: Users, label: "Communities Served", value: "14,200+", color: "text-reef-safe" },
  { icon: Heart, label: "Livelihoods Protected", value: "8,500+", color: "text-primary" },
  { icon: Target, label: "SDG14 Actions", value: "38", color: "text-reef-safe" },
  { icon: Waves, label: "Data Points", value: "2.8M+", color: "text-primary" },
];

const testimonials = [
  { name: "Dr. Maria Santos", role: "Marine Biologist, Philippines", quote: "ReefPulse gives us the real-time intelligence we need to coordinate conservation efforts across the Coral Triangle." },
  { name: "James Wekesa", role: "Fisheries Officer, Kenya", quote: "The tide planner has transformed how our coastal communities plan their workdays—safer and more productive." },
  { name: "Dr. Aisha Rahman", role: "Climate Researcher, Maldives", quote: "The anomaly detection system caught bleaching indicators weeks before visible signs appeared." },
];

export default function Community() {
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">Community Impact</h1>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-primary mb-4">
          SDG 14 — Life Below Water
        </div>
        <p className="text-muted-foreground max-w-xl mx-auto">Tracking our contribution to the UN Sustainable Development Goal 14: Conserve and sustainably use the oceans.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="glass-card-hover p-6 text-center">
            <m.icon className={`h-8 w-8 mx-auto mb-3 ${m.color}`} />
            <div className="text-2xl md:text-3xl font-display font-bold text-foreground mb-1">{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-display font-bold text-foreground mb-4">Voices from the Field</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card p-6">
              <p className="text-sm text-foreground italic mb-4">"{t.quote}"</p>
              <div>
                <div className="text-sm font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
