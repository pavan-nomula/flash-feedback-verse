import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type TrendingItem = {
  title: string;
  subtitle?: string;
};

type Props = {
  title: string;
  description: string;
  items: TrendingItem[];
  emptyText?: string;
  onReview: (title: string) => void;
};

const TrendingSection = ({ title, description, items, emptyText, onReview }: Props) => {
  return (
    <section className="space-y-4" aria-label={title}>
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </header>

      {items.length === 0 ? (
        <Card className="glass p-6">
          <p className="text-sm text-muted-foreground">{emptyText ?? "No trending items right now."}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={`${title}-${item.title}`} className="glass p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{item.title}</p>
                  {item.subtitle ? (
                    <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="glow-outline"
                  size="sm"
                  onClick={() => onReview(item.title)}
                >
                  Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
