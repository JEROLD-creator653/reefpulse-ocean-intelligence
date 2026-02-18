
-- Create reef_stations table
CREATE TABLE public.reef_stations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reef_stations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reef stations are publicly readable"
ON public.reef_stations FOR SELECT
USING (true);

-- Create reef_readings table
CREATE TABLE public.reef_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.reef_stations(id) ON DELETE CASCADE,
  temperature DOUBLE PRECISION NOT NULL,
  turbidity DOUBLE PRECISION NOT NULL,
  chlorophyll DOUBLE PRECISION NOT NULL,
  dissolved_oxygen DOUBLE PRECISION NOT NULL,
  anomaly_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  classification TEXT NOT NULL DEFAULT 'safe',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reef_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reef readings are publicly readable"
ON public.reef_readings FOR SELECT
USING (true);

-- Enable realtime for reef_readings
ALTER PUBLICATION supabase_realtime ADD TABLE public.reef_readings;

-- Create tide_predictions table
CREATE TABLE public.tide_predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id UUID NOT NULL REFERENCES public.reef_stations(id) ON DELETE CASCADE,
  hour INTEGER NOT NULL,
  tide_height DOUBLE PRECISION NOT NULL,
  classification TEXT NOT NULL DEFAULT 'safe',
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE public.tide_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tide predictions are publicly readable"
ON public.tide_predictions FOR SELECT
USING (true);

-- Create community_metrics table
CREATE TABLE public.community_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community metrics are publicly readable"
ON public.community_metrics FOR SELECT
USING (true);
