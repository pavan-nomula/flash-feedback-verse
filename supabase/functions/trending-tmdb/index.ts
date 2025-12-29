import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type TmdbItem = {
  title?: string;
  name?: string;
  first_air_date?: string;
  release_date?: string;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { limit } = await req.json().catch(() => ({ limit: 9 }));

    const tmdbApiKey = Deno.env.get("TMDB_API_KEY");
    if (!tmdbApiKey) {
      throw new Error("TMDB_API_KEY not configured");
    }

    const maxItems = typeof limit === "number" ? Math.min(Math.max(limit, 1), 20) : 9;

    const [moviesRes, tvRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}&language=en-US`),
      fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${tmdbApiKey}&language=en-US`),
    ]);

    if (!moviesRes.ok) {
      const t = await moviesRes.text();
      console.error("TMDB trending movie error:", moviesRes.status, t);
      throw new Error("Failed to fetch trending movies");
    }

    if (!tvRes.ok) {
      const t = await tvRes.text();
      console.error("TMDB trending tv error:", tvRes.status, t);
      throw new Error("Failed to fetch trending TV series");
    }

    const moviesJson = await moviesRes.json();
    const tvJson = await tvRes.json();

    const movies = (moviesJson?.results ?? []).slice(0, maxItems).map((m: TmdbItem) => ({
      title: m.title ?? "",
      year: m.release_date ? String(m.release_date).slice(0, 4) : undefined,
    })).filter((m: any) => m.title);

    const tv = (tvJson?.results ?? []).slice(0, maxItems).map((s: TmdbItem) => ({
      title: s.name ?? "",
      year: s.first_air_date ? String(s.first_air_date).slice(0, 4) : undefined,
    })).filter((s: any) => s.title);

    return new Response(JSON.stringify({ movies, tv }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("trending-tmdb error:", e);
    return new Response(
      JSON.stringify({ movies: [], tv: [], error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
