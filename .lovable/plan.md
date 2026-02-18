

# ReefPulse — Climate-Tech Reef Intelligence Platform

## Overview
A visually stunning, dark ocean-themed web platform that monitors reef health using simulated AI scoring, real-time data streams, and cinematic 3D visuals. Built with React + Vite, Lovable Cloud (Supabase) backend, and premium glassmorphism UI.

---

## Design System
- **Theme**: Dark futuristic ocean — deep navy/teal backgrounds, glowing cyan/aqua accents, glassmorphism cards with blur and transparency
- **Typography**: Modern sans-serif (Inter/Space Grotesk), bold headlines, clean data typography
- **Animations**: Framer Motion page transitions, GSAP scroll animations, React Three Fiber 3D elements, smooth micro-interactions throughout
- **Color Coding**: Green (Safe) / Yellow (Caution) / Red (Avoid) consistently across all data displays
- **Mobile-first responsive design** across all pages

---

## Pages

### 1. Cinematic Landing Page
- Fullscreen 3D underwater reef scene (React Three Fiber) with animated fish, coral, and light rays
- Scroll-driven storytelling sections with parallax effects
- SDG14 impact stats with animated counters
- "Enter Dashboard" CTA with glowing button animation

### 2. Global Reef Intelligence Dashboard
- Interactive ocean map using Leaflet with ocean-themed tiles and reef markers (color-coded Safe/Caution/Avoid)
- Reef Workday Stability Index (RWSI) summary panel with gauge visualization
- Tide prediction timeline (24-hour bar chart)
- AI anomaly risk score display with live-updating score
- Anomaly trend charts (Recharts) showing temperature, chlorophyll, turbidity over time

### 3. Reef Digital Twin Simulation
- Interactive sliders to adjust: temperature, pollution level, fishing pressure
- Animated reef health visualization that responds in real-time to slider changes
- Future prediction timeline showing projected reef state
- Before/after comparison view

### 4. AI Explainability Panel
- Visual breakdown of how the stability score is computed
- Individual factor charts: temperature, chlorophyll, dissolved oxygen, turbidity
- Anomaly detection output with highlighted anomalous readings
- Weight/contribution bars showing each factor's influence

### 5. Tide Workday Planner
- 24-hour horizontal timeline with color-coded segments (Safe/Caution/Avoid)
- Optimal work window recommendations
- Tide height visualization
- Day selector for planning ahead

### 6. Community Impact Page
- SDG14 aligned metrics with animated counters
- Livelihood stability indicators for coastal communities
- Environmental impact dashboard (reefs monitored, alerts issued, communities served)
- Testimonials/case study cards

### 7. Live Data Stream Page
- Terminal-style animated data feed showing incoming reef sensor readings
- Real-time scrolling data entries with timestamps
- Glowing data particles animation
- Powered by Supabase Realtime for live updates

### 8. Data Sources & Research Page
- Cards for each data source (NASA Ocean Color, NOAA Tides, NCEI Coastal Water Quality)
- Model explanation section describing the simulated Isolation Forest approach
- Links to actual public datasets
- Methodology documentation

### 9. System Architecture Page
- Visual pipeline diagram showing data flow: Data Sources → Processing → AI Scoring → Dashboard
- Animated connection lines between system components
- Tech stack icons and descriptions

---

## Backend (Lovable Cloud / Supabase)

### Database Tables
- **reef_stations**: id, name, lat, lng, region, status
- **reef_readings**: id, station_id, temperature, turbidity, chlorophyll, dissolved_oxygen, timestamp, anomaly_score, classification (safe/caution/avoid)
- **tide_predictions**: id, station_id, hour, tide_height, classification, date
- **community_metrics**: id, metric_name, value, updated_at

### Edge Functions
- **calculate-reef-score**: TypeScript-based scoring algorithm that takes sensor inputs and returns anomaly score (0–1) + Safe/Caution/Avoid classification using weighted thresholds (simulating Isolation Forest)
- **generate-readings**: Simulates and inserts realistic reef sensor data for demo purposes
- **fetch-tide-data**: Fetches from NOAA Tides API and stores predictions

### Real-time
- Supabase Realtime subscriptions on `reef_readings` table for the live data stream page

---

## Navigation
- Persistent sidebar/top nav with glassmorphism styling
- Smooth page transitions with Framer Motion
- Mobile hamburger menu with slide-in drawer

