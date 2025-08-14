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

const ReviewForm = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    itemName: "",
    rating: [3],
    reviewText: "",
  });

  const categoryTitles = {
    movies: "Movie",
    "tv-series": "TV Series",
    cricket: "Cricket Match/Player",
    "mobile-apps": "Mobile App",
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
        itemName: formData.itemName.trim(),
        rating: formData.rating[0],
        reviewText: formData.reviewText.trim(),
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

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-bold gradient-text mb-2 capitalize">
            Review a {categoryTitle}
          </h1>
          <p className="text-muted-foreground">
            Share your thoughts and help others discover great content
          </p>
        </div>

        <Card className="glass p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Item Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {categoryTitle} Name *
              </label>
              <Input
                placeholder={`Enter the ${categoryTitle.toLowerCase()} name`}
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                className="glow-border"
              />
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
                onClick={() => navigate("/")}
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