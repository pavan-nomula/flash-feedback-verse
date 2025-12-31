import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchTerm } = await req.json().catch(() => ({}));
    
    // Search popular apps - using common app names
    const appNames = searchTerm 
      ? [searchTerm]
      : ['WhatsApp', 'Instagram', 'Spotify', 'TikTok', 'Netflix', 'YouTube', 'Snapchat', 'Twitter', 'Telegram'];

    const allApps: any[] = [];

    for (const appName of appNames) {
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(appName)}&entity=software&limit=1&country=us`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const app = data.results[0];
            allApps.push({
              id: app.trackId,
              title: app.trackName,
              subtitle: app.sellerName,
              poster: app.artworkUrl512 || app.artworkUrl100,
              rating: app.averageUserRating,
              price: app.formattedPrice,
              category: app.primaryGenreName,
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching app ${appName}:`, err);
      }
    }

    console.log(`Returning ${allApps.length} apps`);

    return new Response(
      JSON.stringify({ apps: allApps }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trending-apps function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch app data', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
