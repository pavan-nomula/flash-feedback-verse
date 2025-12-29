import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Tv, Trophy, Smartphone } from "lucide-react";

export type TrendingItem = {
  title: string;
  subtitle?: string;
  poster?: string | null;
};

type TrendingSectionProps = {
  title: string;
  description: string;
  items: TrendingItem[];
  onReview: (title: string) => void;
  emptyText?: string;
  type?: "movie" | "tv" | "sport" | "app";
};

const iconMap = {
  movie: Film,
  tv: Tv,
  sport: Trophy,
  app: Smartphone,
};

const TrendingSection = ({
  title,
  description,
  items,
  onReview,
  emptyText = "No trending items available.",
  type = "movie",
}: TrendingSectionProps) => {
  const Icon = iconMap[type];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-xl gradient-text">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">{emptyText}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.title}
                className="group flex flex-col rounded-lg overflow-hidden bg-card/50 border border-border/50 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative aspect-[2/3] bg-muted overflow-hidden">
                  {item.poster ? (
                    <img
                      src={item.poster}
                      alt={`${item.title} poster`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <Icon className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="text-sm font-medium leading-tight line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-muted-foreground mb-3">{item.subtitle}</p>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-auto w-full text-xs"
                    onClick={() => onReview(item.title)}
                  >
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingSection;
