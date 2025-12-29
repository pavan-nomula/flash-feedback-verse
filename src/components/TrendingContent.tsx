import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TrendingSection, { TrendingItem } from "@/components/TrendingSection";

type TmdbTrendingResponse = {
  movies: { title: string; year?: string; poster?: string | null }[];
  tv: { title: string; year?: string; poster?: string | null }[];
};

const TrendingContent = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
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

  const trendingMovies: TrendingItem[] = useMemo(() => {
    if (!data?.movies) return [];
    return data.movies.map((m) => ({
      title: m.year ? `${m.title} (${m.year})` : m.title,
      subtitle: "Popular this week",
      poster: m.poster,
    }));
  }, [data?.movies]);

  const trendingTv: TrendingItem[] = useMemo(() => {
    if (!data?.tv) return [];
    return data.tv.map((s) => ({
      title: s.year ? `${s.title} (${s.year})` : s.title,
      subtitle: "Popular this week",
      poster: s.poster,
    }));
  }, [data?.tv]);

  const trendingSports: TrendingItem[] = useMemo(
    () => [
      { title: "Cricket: India vs Australia", subtitle: "Match review" },
      { title: "Football: Real Madrid vs Barcelona", subtitle: "Match review" },
      { title: "Basketball: Lakers vs Warriors", subtitle: "Game review" },
    ],
    []
  );

  const trendingApps: TrendingItem[] = useMemo(
    () => [
      { title: "WhatsApp", subtitle: "Mobile app review" },
      { title: "Instagram", subtitle: "Mobile app review" },
      { title: "Spotify", subtitle: "Mobile app review" },
    ],
    []
  );

  const goReview = (category: "movies" | "tv-series" | "sports" | "mobile-apps", title: string) => {
    navigate(`/review/${category}?item=${encodeURIComponent(title)}`);
  };

  return (
    <section className="space-y-10" aria-label="Trending content">
      <TrendingSection
        title="Trending Movies"
        description={isLoading ? "Loading trending movies…" : "Latest popular movies you can review right now."}
        items={isLoading ? [] : trendingMovies}
        emptyText={isLoading ? "Loading…" : "No trending movies found."}
        onReview={(title) => goReview("movies", title)}
        type="movie"
      />

      <TrendingSection
        title="Trending TV Series"
        description={isLoading ? "Loading trending series…" : "Popular TV series this week — add your review."}
        items={isLoading ? [] : trendingTv}
        emptyText={isLoading ? "Loading…" : "No trending TV series found."}
        onReview={(title) => goReview("tv-series", title)}
        type="tv"
      />

      <TrendingSection
        title="Trending Sport Matches"
        description="Quick picks to review today (we can connect a live sports data source next)."
        items={trendingSports}
        onReview={(title) => goReview("sports", title)}
        type="sport"
      />

      <TrendingSection
        title="Trending Mobile Apps"
        description="Popular apps to review (we can connect Play Store/App Store data next)."
        items={trendingApps}
        onReview={(title) => goReview("mobile-apps", title)}
        type="app"
      />
    </section>
  );
};

export default TrendingContent;
