import { useNavigate } from "react-router-dom";
import { Film, Tv, Trophy, Smartphone } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'movies',
      title: 'Movies',
      description: 'Rate and review your favorite films',
      icon: Film,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      id: 'tv-series',
      title: 'TV Series',
      description: 'Share thoughts on binge-worthy shows',
      icon: Tv,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'cricket',
      title: 'Cricket',
      description: 'Review matches and performances',
      icon: Trophy,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'mobile-apps',
      title: 'Mobile Apps',
      description: 'Rate apps and user experiences',
      icon: Smartphone,
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/review/${categoryId}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-bold gradient-text mb-6 animate-gradient-shift">
            Flash Feedback
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            The most visually engaging platform for discovering, sharing, and analyzing reviews across diverse content categories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className="btn-neon text-lg px-8 py-3 rounded-xl font-semibold"
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start Rating
            </Button>
            <Button 
              variant="outline" 
              className="glow-border text-lg px-8 py-3 rounded-xl font-semibold"
              onClick={() => navigate('/community')}
            >
              Explore Community
            </Button>
          </div>
        </div>

        {/* Categories Section */}
        <div id="categories" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Choose Your Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div 
                key={category.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CategoryCard
                  title={category.title}
                  description={category.description}
                  icon={category.icon}
                  gradient={category.gradient}
                  onClick={() => handleCategorySelect(category.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="glass rounded-3xl p-8 md:p-12 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-4">
              Why Flash Feedback?
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the future of content reviews with stunning visuals and powerful analytics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Film className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Beautiful Design</h3>
              <p className="text-muted-foreground">Dark theme with neon accents and smooth animations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Trophy className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">Detailed insights into your rating patterns and preferences</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-muted-foreground">Discover new content through collective user feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;