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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all stations
    const { data: stations } = await supabase.from("reef_stations").select("id");
    if (!stations || stations.length === 0) {
      return new Response(JSON.stringify({ error: "No stations found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const readings = [];
    for (const station of stations) {
      const temp = 24 + Math.random() * 6;
      const turb = 0.5 + Math.random() * 4.5;
      const chlor = 0.1 + Math.random() * 0.9;
      const oxy = 5 + Math.random() * 3;

      // Score
      const tempScore = Math.abs(temp - 26) / 12;
      const turbScore = Math.min(turb / 10, 1);
      const chlorScore = Math.abs(chlor - 0.5) / 1.5;
      const oxyScore = Math.max(0, (7 - oxy) / 7);
      const score = Math.min(1, 0.35 * tempScore + 0.2 * turbScore + 0.25 * chlorScore + 0.2 * oxyScore);
      const cls = score < 0.33 ? "safe" : score < 0.66 ? "caution" : "avoid";

      readings.push({
        station_id: station.id,
        temperature: Math.round(temp * 10) / 10,
        turbidity: Math.round(turb * 100) / 100,
        chlorophyll: Math.round(chlor * 100) / 100,
        dissolved_oxygen: Math.round(oxy * 10) / 10,
        anomaly_score: Math.round(score * 1000) / 1000,
        classification: cls,
      });
    }

    const { error } = await supabase.from("reef_readings").insert(readings);
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, count: readings.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
