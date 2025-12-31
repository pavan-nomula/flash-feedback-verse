import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TrendingSection, { TrendingItem } from "@/components/TrendingSection";

type TmdbTrendingResponse = {
  movies: { title: string; year?: string; poster?: string | null }[];
  tv: { title: string; year?: string; poster?: string | null }[];
};

type SportsEvent = {
  id: string;
  title: string;
  subtitle: string;
  poster_path: string | null;
  home_team: { name: string; badge: string | null };
  away_team: { name: string; badge: string | null };
  sport: string;
};

type AppItem = {
  id: number;
  title: string;
  subtitle: string;
  poster: string | null;
  category: string;
};

const TrendingContent = () => {
  const navigate = useNavigate();

  const { data: tmdbData, isLoading: tmdbLoading } = useQuery({
    queryKey: ["trending-tmdb"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("trending-tmdb", {
        body: { limit: 9 },
      });
      if (error) throw error;
      return data as TmdbTrendingResponse;
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: sportsData, isLoading: sportsLoading } = useQuery({
    queryKey: ["trending-sports"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("trending-sports");
      if (error) throw error;
      return data as { events: SportsEvent[] };
    },
    staleTime: 1000 * 60 * 10,
  });

  const { data: appsData, isLoading: appsLoading } = useQuery({
    queryKey: ["trending-apps"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("trending-apps");
      if (error) throw error;
      return data as { apps: AppItem[] };
    },
    staleTime: 1000 * 60 * 10,
  });

  const trendingMovies: TrendingItem[] = useMemo(() => {
    if (!tmdbData?.movies) return [];
    return tmdbData.movies.map((m) => ({
      title: m.year ? `${m.title} (${m.year})` : m.title,
      subtitle: "Popular this week",
      poster: m.poster,
    }));
  }, [tmdbData?.movies]);

  const trendingTv: TrendingItem[] = useMemo(() => {
    if (!tmdbData?.tv) return [];
    return tmdbData.tv.map((s) => ({
      title: s.year ? `${s.title} (${s.year})` : s.title,
      subtitle: "Popular this week",
      poster: s.poster,
    }));
  }, [tmdbData?.tv]);

  const trendingSports: TrendingItem[] = useMemo(() => {
    if (!sportsData?.events || sportsData.events.length === 0) {
      return [
        { title: "Cricket: India vs Australia", subtitle: "Match review" },
        { title: "Football: Real Madrid vs Barcelona", subtitle: "Match review" },
        { title: "Basketball: Lakers vs Warriors", subtitle: "Game review" },
      ];
    }
    return sportsData.events.map((event) => ({
      title: event.title,
      subtitle: `${event.sport} • ${event.subtitle}`,
      poster: event.home_team.badge || event.away_team.badge || event.poster_path,
    }));
  }, [sportsData?.events]);

  const trendingApps: TrendingItem[] = useMemo(() => {
    if (!appsData?.apps || appsData.apps.length === 0) {
      return [
        { title: "WhatsApp", subtitle: "Mobile app review" },
        { title: "Instagram", subtitle: "Mobile app review" },
        { title: "Spotify", subtitle: "Mobile app review" },
      ];
    }
    return appsData.apps.map((app) => ({
      title: app.title,
      subtitle: app.category || app.subtitle,
      poster: app.poster,
    }));
  }, [appsData?.apps]);

  const goReview = (category: "movies" | "tv-series" | "sports" | "mobile-apps", title: string) => {
    navigate(`/review/${category}?item=${encodeURIComponent(title)}`);
  };

  return (
    <section className="space-y-10" aria-label="Trending content">
      <TrendingSection
        title="Trending Movies"
        description={tmdbLoading ? "Loading trending movies…" : "Latest popular movies you can review right now."}
        items={tmdbLoading ? [] : trendingMovies}
        emptyText={tmdbLoading ? "Loading…" : "No trending movies found."}
        onReview={(title) => goReview("movies", title)}
        type="movie"
      />

      <TrendingSection
        title="Trending TV Series"
        description={tmdbLoading ? "Loading trending series…" : "Popular TV series this week — add your review."}
        items={tmdbLoading ? [] : trendingTv}
        emptyText={tmdbLoading ? "Loading…" : "No trending TV series found."}
        onReview={(title) => goReview("tv-series", title)}
        type="tv"
      />

      <TrendingSection
        title="Trending Sport Matches"
        description={sportsLoading ? "Loading upcoming matches…" : "Upcoming matches from top leagues."}
        items={sportsLoading ? [] : trendingSports}
        emptyText={sportsLoading ? "Loading…" : "No upcoming matches found."}
        onReview={(title) => goReview("sports", title)}
        type="sport"
      />

      <TrendingSection
        title="Trending Mobile Apps"
        description={appsLoading ? "Loading popular apps…" : "Top apps from the App Store."}
        items={appsLoading ? [] : trendingApps}
        emptyText={appsLoading ? "Loading…" : "No apps found."}
        onReview={(title) => goReview("mobile-apps", title)}
        type="app"
      />
    </section>
  );
};

export default TrendingContent;
