import { useRef } from "react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Waves, Shield, Globe, BarChart3, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as THREE from "three";

function Coral({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.1;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[2]) * 0.05;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <cylinderGeometry args={[0.05, 0.15, 0.8, 8]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

function Fish({ offset = 0 }: { offset?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime + offset;
      ref.current.position.x = Math.sin(t * 0.4) * 3;
      ref.current.position.y = Math.cos(t * 0.3) * 0.5 + 0.5;
      ref.current.position.z = Math.cos(t * 0.2) * 2;
      ref.current.rotation.y = Math.atan2(Math.cos(t * 0.4) * 3, 1);
    }
  });
  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.06, 0.2, 4]} />
      <meshStandardMaterial color="#4dd0e1" emissive="#00bcd4" emissiveIntensity={0.3} />
    </mesh>
  );
}

function LightRays() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });
  return (
    <mesh ref={ref} position={[0, 3, 0]} rotation={[0, 0, Math.PI / 6]}>
      <planeGeometry args={[0.3, 8]} />
      <meshStandardMaterial color="#4dd0e1" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Bubbles() {
  const ref = useRef<THREE.Points>(null);
  const count = 50;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 1] = Math.random() * 4 - 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  useFrame((state) => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += 0.005;
        if (pos[i * 3 + 1] > 3) pos[i * 3 + 1] = -2;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#80deea" transparent opacity={0.6} />
    </points>
  );
}

function UnderwaterScene() {
  return (
    <>
      <ambientLight intensity={0.15} color="#0d47a1" />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#4dd0e1" />
      <pointLight position={[0, 2, 0]} intensity={0.6} color="#00bcd4" distance={8} />

      {/* Seabed */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#0a2a3f" roughness={0.9} />
      </mesh>

      {/* Corals */}
      <Coral position={[-1.5, -0.8, -1]} color="#ff6b6b" scale={1.2} />
      <Coral position={[-0.8, -0.8, -0.5]} color="#ffa726" scale={0.8} />
      <Coral position={[0.3, -0.8, -1.2]} color="#ab47bc" scale={1} />
      <Coral position={[1.2, -0.8, -0.8]} color="#26a69a" scale={1.1} />
      <Coral position={[-0.3, -0.8, 0.5]} color="#ef5350" scale={0.9} />
      <Coral position={[1.8, -0.8, 0.2]} color="#66bb6a" scale={0.7} />
      <Coral position={[-2, -0.8, 0.8]} color="#42a5f5" scale={1.3} />

      {/* Fish */}
      <Fish offset={0} />
      <Fish offset={2} />
      <Fish offset={4} />

      <LightRays />
      <Bubbles />
      <fog attach="fog" args={["#021a2b", 2, 10]} />
    </>
  );
}

function AnimatedCounter({ end, suffix = "", label }: { end: number; suffix?: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <motion.div
        className="text-4xl md:text-5xl font-display font-bold text-primary glow-text"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {end.toLocaleString()}{suffix}
      </motion.div>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </motion.div>
  );
}

const features = [
  { icon: Shield, title: "AI Reef Scoring", desc: "Real-time anomaly detection using simulated Isolation Forest models" },
  { icon: Globe, title: "Global Monitoring", desc: "Track reef stations across 6 ocean regions worldwide" },
  { icon: BarChart3, title: "Tide Intelligence", desc: "24-hour workday stability planning with Safe/Caution/Avoid zones" },
  { icon: Activity, title: "Live Data Streams", desc: "Real-time sensor data feeds with WebSocket connections" },
  { icon: Users, title: "Community Impact", desc: "SDG14-aligned metrics for coastal community resilience" },
  { icon: Waves, title: "Digital Twin", desc: "Simulate reef conditions and predict future health states" },
];

export default function Index() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  return (
    <div className="bg-background">
      {/* Hero */}
      <motion.section ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale }} className="relative h-screen">
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0.5, 4], fov: 60 }}>
            <UnderwaterScene />
          </Canvas>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-primary mb-6">
              <Activity className="h-3 w-3" />
              Climate Intelligence Platform
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-4 glow-text">
              ReefPulse
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              AI-powered reef health monitoring. Protecting ocean ecosystems with real-time intelligence and predictive analytics.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="gap-2 text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-border">
                Enter Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Reef Intelligence Suite</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Comprehensive tools for ocean health monitoring, prediction, and community impact.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-hover p-6"
              >
                <f.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG14 Impact */}
      <section className="py-24 px-4 ocean-gradient">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs text-primary mb-4">
              SDG 14 — Life Below Water
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">Global Impact</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter end={6} label="Reef Stations" />
            <AnimatedCounter end={2847} label="Readings Collected" />
            <AnimatedCounter end={14} suffix="K" label="Communities Served" />
            <AnimatedCounter end={98} suffix="%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Ready to Dive In?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Explore the dashboard and see reef intelligence in action.</p>
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 px-8 py-6 glow-border">
              Launch Dashboard <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
