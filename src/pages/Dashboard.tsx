import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reviewStorage, Review } from "@/lib/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Trash2, Star, TrendingUp, Award, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | Review['category']>('all');
  
  const reviews = reviewStorage.getReviews();
  const analytics = reviewStorage.getAnalytics();

  const filteredReviews = useMemo(() => {
    return filter === 'all' ? reviews : reviews.filter(review => review.category === filter);
  }, [reviews, filter]);

  const handleDeleteReview = (id: string) => {
    try {
      reviewStorage.deleteReview(id);
      toast({
        title: "Review Deleted",
        description: "Your review has been removed successfully.",
      });
      // Force re-render by updating the page
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sentimentData = [
    { name: 'Positive', value: analytics.sentiments.positive, color: '#10B981' },
    { name: 'Neutral', value: analytics.sentiments.neutral, color: '#F59E0B' },
    { name: 'Negative', value: analytics.sentiments.negative, color: '#EF4444' },
  ];

  const categoryData = [
    { category: 'Movies', count: reviews.filter(r => r.category === 'movies').length },
    { category: 'TV Series', count: reviews.filter(r => r.category === 'tv-series').length },
    { category: 'Sports', count: reviews.filter(r => r.category === 'sports').length },
    { category: 'Apps', count: reviews.filter(r => r.category === 'mobile-apps').length },
  ];

  const categoryLabels = {
    movies: 'Movies',
    'tv-series': 'TV Series',
    sports: 'Sports',
    'mobile-apps': 'Apps',
  };

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold gradient-text mb-4">My Reviews</h1>
            <div className="glass rounded-3xl p-12 max-w-md mx-auto">
              <Star size={48} className="text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Reviews Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start sharing your thoughts on movies, TV shows, sports, and apps!
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="btn-neon"
              >
                Write Your First Review
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
          <h1 className="text-4xl font-bold gradient-text mb-2">My Reviews</h1>
          <p className="text-muted-foreground">
            Track your reviews and discover your rating patterns
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Star className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.totalReviews}</p>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <TrendingUp className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                <Award className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics.sentiments.positive}</p>
                <p className="text-sm text-muted-foreground">Positive Reviews</p>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {categoryData.filter(c => c.count > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Sentiment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Reviews by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'btn-neon' : 'glow-border'}
          >
            All Reviews
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

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="glass p-6 animate-slide-up">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{review.itemName}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {categoryLabels[review.category]}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
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
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.submissionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{review.reviewText}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;