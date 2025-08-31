import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { reviewStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { MovieSuggestions } from "@/components/MovieSuggestions";
import SportsSelector from "@/components/SportsSelector";
import { ReviewField } from "@/data/sportsCategories";

const ReviewForm = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    itemName: "",
    rating: [3],
    reviewText: "",
    subcategory: "",
    reviewType: "",
    additionalFields: {} as Record<string, any>
  });
  const [sportsFormData, setSportsFormData] = useState<any>(null);
  const [showSportsSelector, setShowSportsSelector] = useState(category === 'sports');

  const categoryTitles = {
    movies: "Movie",
    "tv-series": "TV Series",
    sports: "Sport/Game",
    "mobile-apps": "Mobile App",
  };

  const handleSportsSelection = (sport: string, subcategory: string, reviewType: string, data: any) => {
    setSportsFormData(data);
    setFormData(prev => ({
      ...prev,
      subcategory,
      reviewType,
      itemName: "" // Reset item name for the specific review
    }));
    setShowSportsSelector(false);
  };

  const categoryTitle = categoryTitles[category as keyof typeof categoryTitles] || "Item";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.itemName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter the item name",
        variant: "destructive",
      });
      return;
    }

    if (!formData.reviewText.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please write a review",
        variant: "destructive",
      });
      return;
    }

    try {
      reviewStorage.addReview({
        category: category as any,
        subcategory: formData.subcategory || undefined,
        itemName: formData.itemName.trim(),
        rating: formData.rating[0],
        reviewText: formData.reviewText.trim(),
        ...formData.additionalFields
      });

      toast({
        title: "Review Submitted!",
        description: "Thank you for your genuine feedback.",
      });

      navigate("/thank-you");
    } catch (error) {
      toast({
        title: "Review Already Exists",
        description: error instanceof Error ? error.message : "You can only submit one review per item to ensure genuine feedback.",
        variant: "destructive",
      });
    }
  };

  if (category === 'sports' && showSportsSelector) {
    return (
      <div className="min-h-screen pt-20 pb-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <SportsSelector
            onSelect={handleSportsSelection}
            onBack={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  const renderDynamicFields = () => {
    if (!sportsFormData?.fields) return null;

    return sportsFormData.fields.map((field: ReviewField) => (
      <div key={field.id}>
        <label className="block text-sm font-medium mb-2">
          {field.name} {field.required && '*'}
        </label>
        {field.type === 'text' && (
          <Input
            placeholder={field.placeholder}
            value={formData.additionalFields[field.id] || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              additionalFields: { ...prev.additionalFields, [field.id]: e.target.value }
            }))}
            className="glow-border"
          />
        )}
        {field.type === 'select' && field.options && (
          <select 
            className="w-full p-2 border rounded-md bg-card"
            value={formData.additionalFields[field.id] || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              additionalFields: { ...prev.additionalFields, [field.id]: e.target.value }
            }))}
          >
            <option value="">Select...</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}
        {field.type === 'date' && (
          <Input
            type="date"
            value={formData.additionalFields[field.id] || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              additionalFields: { ...prev.additionalFields, [field.id]: e.target.value }
            }))}
            className="glow-border"
          />
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              if (category === 'sports' && sportsFormData) {
                setShowSportsSelector(true);
              } else {
                navigate("/");
              }
            }}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2" size={16} />
            {category === 'sports' && sportsFormData ? 'Back to Sports Selection' : 'Back to Home'}
          </Button>
          
          <h1 className="text-4xl font-bold gradient-text mb-2 capitalize">
            {sportsFormData ? `${sportsFormData.reviewTypeName} - ${sportsFormData.sportName}` : `Review a ${categoryTitle}`}
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts and help others discover great content
          </p>
        </div>

        <Card className="glass p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dynamic fields for sports */}
            {renderDynamicFields()}

            {/* Item Name for non-sports or final item name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {sportsFormData?.fields?.find((f: ReviewField) => f.id.includes('Name'))?.name || `${categoryTitle} Name`} *
              </label>
              {category === 'movies' ? (
                <MovieSuggestions
                  value={formData.itemName}
                  onChange={(value) => setFormData({ ...formData, itemName: value })}
                  placeholder="Start typing a movie name..."
                />
              ) : (
                <Input
                  placeholder={`Enter the ${categoryTitle.toLowerCase()} name`}
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="glow-border"
                />
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-4">
                Rating: {formData.rating[0]}/5
              </label>
              <div className="space-y-4">
                <Slider
                  value={formData.rating}
                  onValueChange={(value) => setFormData({ ...formData, rating: value })}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Great</span>
                  <span>Excellent</span>
                </div>
                <div className="flex justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`${
                        star <= formData.rating[0]
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      } transition-colors duration-200`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review *
              </label>
              <Textarea
                placeholder="Share your detailed thoughts..."
                value={formData.reviewText}
                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                className="glow-border min-h-[120px]"
                rows={6}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (category === 'sports' && sportsFormData) {
                    setShowSportsSelector(true);
                  } else {
                    navigate("/");
                  }
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="btn-neon flex-1"
              >
                Submit Review
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ReviewForm;