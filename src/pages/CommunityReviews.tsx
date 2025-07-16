import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reviewStorage, Review } from "@/lib/storage";
import { Search, Star, Users, TrendingUp } from "lucide-react";

const CommunityReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | Review['category']>('all');
  
  const reviews = reviewStorage.getReviews();

  const filteredReviews = useMemo(() => {
    let filtered = reviews;
    
    if (filter !== 'all') {
      filtered = filtered.filter(review => review.category === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [reviews, filter, searchTerm]);

  // Calculate item aggregates
  const itemAggregates = useMemo(() => {
    const aggregates: Record<string, { totalRating: number; count: number; reviews: Review[] }> = {};
    
    reviews.forEach(review => {
      const key = `${review.category}-${review.itemName.toLowerCase()}`;
      if (!aggregates[key]) {
        aggregates[key] = { totalRating: 0, count: 0, reviews: [] };
      }
      aggregates[key].totalRating += review.rating;
      aggregates[key].count += 1;
      aggregates[key].reviews.push(review);
    });
    
    return aggregates;
  }, [reviews]);

  const categoryLabels = {
    movies: 'Movies',
    'tv-series': 'TV Series',
    cricket: 'Cricket',
    'mobile-apps': 'Apps',
  };

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">Community Reviews</h1>
            <div className="glass rounded-3xl p-12 max-w-md mx-auto">
              <Users size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Community Reviews Yet</h2>
              <p className="text-muted-foreground mb-6">
                Be the first to share a review and start building the community!
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="btn-neon"
              >
                Write the First Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Community Reviews</h1>
          <p className="text-muted-foreground">
            Discover what the community thinks about movies, shows, cricket, and apps
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{reviews.length}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Object.keys(itemAggregates).length}
                </p>
                <p className="text-sm text-muted-foreground">Unique Items</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search reviews by item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glow-border"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn-neon' : 'glow-border'}
          >
            All Categories
          </Button>
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              onClick={() => setFilter(key as Review['category'])}
              className={filter === key ? 'btn-neon' : 'glow-border'}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const aggregateKey = `${review.category}-${review.itemName.toLowerCase()}`;
            const aggregate = itemAggregates[aggregateKey];
            const avgRating = aggregate ? aggregate.totalRating / aggregate.count : review.rating;
            
            return (
              <Card key={review.id} className="glass p-6 animate-slide-up">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold">{review.itemName}</h3>
                      <Badge variant="secondary" className="capitalize">
                        {categoryLabels[review.category]}
                      </Badge>
                      {aggregate && aggregate.count > 1 && (
                        <Badge variant="outline" className="text-accent border-accent">
                          {aggregate.count} reviews
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">This review:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= review.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.rating}/5</span>
                      </div>
                      
                      {aggregate && aggregate.count > 1 && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Community avg:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={
                                  star <= Math.round(avgRating)
                                    ? "text-primary fill-primary"
                                    : "text-muted-foreground"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-primary">
                            {avgRating.toFixed(1)}/5
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-2">{review.reviewText}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.submissionDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <Search size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Reviews Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityReviews;