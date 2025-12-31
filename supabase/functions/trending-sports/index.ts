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
    const apiKey = Deno.env.get('THESPORTSDB_API_KEY');
    
    if (!apiKey) {
      console.error('THESPORTSDB_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Sports API not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Fetch upcoming events from multiple leagues
    const leagues = [
      '4328', // English Premier League
      '4331', // German Bundesliga
      '4335', // Spanish La Liga
      '4380', // NBA
      '4387', // NFL
    ];

    const allEvents: any[] = [];

    for (const leagueId of leagues) {
      try {
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsnextleague.php?id=${leagueId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.events) {
            allEvents.push(...data.events.slice(0, 3));
          }
        }
      } catch (err) {
        console.error(`Error fetching league ${leagueId}:`, err);
      }
    }

    // Format events for frontend
    const formattedEvents = allEvents.slice(0, 10).map((event: any) => ({
      id: event.idEvent,
      title: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
      subtitle: event.strLeague,
      date: event.dateEvent,
      time: event.strTime,
      poster_path: event.strThumb || event.strBanner || null,
      home_team: {
        name: event.strHomeTeam,
        badge: event.strHomeTeamBadge,
      },
      away_team: {
        name: event.strAwayTeam,
        badge: event.strAwayTeamBadge,
      },
      venue: event.strVenue,
      sport: event.strSport,
    }));

    console.log(`Returning ${formattedEvents.length} sports events`);

    return new Response(
      JSON.stringify({ events: formattedEvents }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trending-sports function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch sports data', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
