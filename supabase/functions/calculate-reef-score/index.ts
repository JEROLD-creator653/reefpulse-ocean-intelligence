import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { temperature, turbidity, chlorophyll, dissolved_oxygen } = await req.json();

    // Simulated Isolation Forest scoring
    const tempScore = Math.abs(temperature - 26) / 12; // optimal ~26°C
    const turbScore = Math.min(turbidity / 10, 1);
    const chlorScore = Math.abs(chlorophyll - 0.5) / 1.5;
    const oxyScore = Math.max(0, (7 - dissolved_oxygen) / 7);

    const weights = { temp: 0.35, turb: 0.2, chlor: 0.25, oxy: 0.2 };
    const anomalyScore = Math.min(1, Math.max(0,
      weights.temp * tempScore +
      weights.turb * turbScore +
      weights.chlor * chlorScore +
      weights.oxy * oxyScore
    ));

    const classification = anomalyScore < 0.33 ? "safe" : anomalyScore < 0.66 ? "caution" : "avoid";

    return new Response(JSON.stringify({
      anomaly_score: Math.round(anomalyScore * 1000) / 1000,
      classification,
      factors: {
        temperature: { value: temperature, score: Math.round(tempScore * 100) / 100, weight: weights.temp },
        turbidity: { value: turbidity, score: Math.round(turbScore * 100) / 100, weight: weights.turb },
        chlorophyll: { value: chlorophyll, score: Math.round(chlorScore * 100) / 100, weight: weights.chlor },
        dissolved_oxygen: { value: dissolved_oxygen, score: Math.round(oxyScore * 100) / 100, weight: weights.oxy },
      },
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
