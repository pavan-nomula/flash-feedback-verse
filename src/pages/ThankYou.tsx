import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-primary rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto glass rounded-3xl p-8 animate-slide-up">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto flex items-center justify-center mb-4 animate-pulse-glow">
              <CheckCircle size={40} className="text-white" />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="text-accent animate-spin" size={20} />
              <h1 className="text-3xl font-bold gradient-text">
                Thank You!
              </h1>
              <Sparkles className="text-accent animate-spin" size={20} />
            </div>
            <p className="text-muted-foreground">
              Your review has been saved successfully!
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/")}
              className="btn-neon w-full"
            >
              Review Another
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="glow-border w-full"
            >
              View My Reviews
            </Button>
          </div>
        </div>

        {/* Fun stats */}
        <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-muted-foreground">
            🎉 You're helping build an amazing community of reviewers!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;