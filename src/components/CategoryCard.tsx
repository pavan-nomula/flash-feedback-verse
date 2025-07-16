import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  onClick: () => void;
}

const CategoryCard = ({ title, description, icon: Icon, gradient, onClick }: CategoryCardProps) => {
  return (
    <div
      onClick={onClick}
      className="category-card group cursor-pointer p-6 rounded-2xl animate-float hover:animate-pulse-glow"
      style={{ animationDelay: `${Math.random() * 2}s` }}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={32} className="text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 group-hover:text-foreground transition-colors duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;