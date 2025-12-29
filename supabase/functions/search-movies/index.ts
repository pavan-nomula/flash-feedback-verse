import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query || query.length < 2) {
      return new Response(
        JSON.stringify({ movies: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const tmdbApiKey = Deno.env.get('TMDB_API_KEY')
    if (!tmdbApiKey) {
      console.error('TMDB_API_KEY not found')
      throw new Error('TMDB_API_KEY not configured')
    }

    console.log(`Searching TMDB for: ${query}`)

    // Search for movies using TMDB API
    const searchResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!searchResponse.ok) {
      console.error(`TMDB API error: ${searchResponse.status} ${searchResponse.statusText}`)
      throw new Error(`TMDB API error: ${searchResponse.statusText}`)
    }

    const searchData = await searchResponse.json()
    console.log(`Found ${searchData.results?.length || 0} movies`)

    // Extract movie titles with year and poster for better identification
    const movies = (searchData.results || []).slice(0, 10).map((movie: any) => ({
      title: movie.title + (movie.release_date ? ` (${movie.release_date.substring(0, 4)})` : ''),
      poster: movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null,
    }))

    // Also fetch trending/recent movies if query matches common terms
    let recentMovies: string[] = []
    if (query.length >= 2) {
      try {
        const trendingResponse = await fetch(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${tmdbApiKey}&language=en-US`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            }
          }
        )

        if (trendingResponse.ok) {
          const trendingData = await trendingResponse.json()
          recentMovies = (trendingData.results || [])
            .filter((movie: any) => 
              movie.title.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 5)
            .map((movie: any) => ({
              title: movie.title + (movie.release_date ? ` (${movie.release_date.substring(0, 4)})` : ''),
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : null,
            }))
        }
      } catch (error) {
        console.log('Could not fetch trending movies:', error)
      }
    }

    // Combine and deduplicate results, prioritizing trending
    const seen = new Set<string>()
    const allMovies = [...recentMovies, ...movies].filter((m) => {
      if (seen.has(m.title)) return false
      seen.add(m.title)
      return true
    }).slice(0, 10)

    return new Response(
      JSON.stringify({ movies: allMovies }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ movies: [], error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
