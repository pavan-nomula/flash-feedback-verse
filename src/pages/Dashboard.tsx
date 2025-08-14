import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reviewStorage, Review } from "@/lib/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ComposedChart } from "recharts";
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

        {/* Enhanced Charts with Pareto Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pareto Chart - Category Distribution */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Category Distribution (Pareto Analysis)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={analytics.paretoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="category" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  stroke="hsl(var(--primary))"
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar 
                  yAxisId="left"
                  dataKey="count" 
                  fill="hsl(var(--primary))" 
                  radius={4}
                  name="Review Count"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulativePercentage"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                  name="Cumulative %"
                />
              </ComposedChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-2">
              Shows which categories generate the most reviews (80/20 principle)
            </p>
          </Card>

          {/* Rating Distribution */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Rating Distribution Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="rating" 
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Rating', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [`${value} reviews`, 'Count']}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--secondary))" 
                  radius={4}
                />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-2">
              Distribution of ratings showing user satisfaction patterns
            </p>
          </Card>
        </div>

        {/* Popular Items and Quality Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Most Popular Items */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Most Popular Items</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analytics.popularItems.slice(0, 8).map((item, index) => (
                <div key={`${item.category}-${item.item}`} className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium truncate">{item.item}</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{item.frequency}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Items generating the most review activity (Pareto principle)
            </p>
          </Card>

          {/* Quality Distribution */}
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Review Quality Analysis</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { 
                      name: 'High Quality', 
                      value: analytics.qualityDistribution.highQuality, 
                      color: '#10B981' 
                    },
                    { 
                      name: 'Standard Quality', 
                      value: analytics.qualityDistribution.standardQuality, 
                      color: '#F59E0B' 
                    }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#F59E0B" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-lg font-bold text-primary">
                {analytics.qualityDistribution.highQualityPercentage.toFixed(1)}%
              </p>
              <p className="text-sm text-muted-foreground">
                High-quality detailed reviews (4+ stars, 50+ characters)
              </p>
            </div>
          </Card>
        </div>

        {/* Sentiment Analysis */}
        <div className="mb-8">
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