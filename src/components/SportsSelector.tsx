import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { sportsCategories, SportCategory, SportSubcategory, ReviewType } from '@/data/sportsCategories';

interface SportsSelectorProps {
  onSelect: (sport: string, subcategory: string, reviewType: string, data: any) => void;
  onBack: () => void;
}

const SportsSelector = ({ onSelect, onBack }: SportsSelectorProps) => {
  const [selectedSport, setSelectedSport] = useState<SportCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SportSubcategory | null>(null);

  if (selectedSport && selectedSubcategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSubcategory(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to {selectedSport.name}
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSport.icon}</span>
            <h2 className="text-xl font-semibold">{selectedSport.name} - {selectedSubcategory.name}</h2>
          </div>
        </div>

        <div className="grid gap-4">
          {selectedSubcategory.reviewTypes.map((reviewType) => (
            <Card key={reviewType.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{reviewType.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{reviewType.description}</p>
                </div>
                <Button 
                  onClick={() => onSelect(selectedSport.id, selectedSubcategory.id, reviewType.id, {
                    sportName: selectedSport.name,
                    subcategoryName: selectedSubcategory.name,
                    reviewTypeName: reviewType.name,
                    fields: reviewType.fields
                  })}
                  className="ml-4"
                >
                  Start Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (selectedSport) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSport(null)}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to Sports
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedSport.icon}</span>
            <h2 className="text-xl font-semibold">{selectedSport.name}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {selectedSport.subcategories.map((subcategory) => (
            <Card 
              key={subcategory.id} 
              className="p-6 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedSubcategory(subcategory)}
            >
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {subcategory.name}
                </h3>
                <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {subcategory.reviewTypes.length} review type{subcategory.reviewTypes.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ChevronLeft size={16} />
          Back to Categories
        </Button>
        <h2 className="text-xl font-semibold">Choose a Sport</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sportsCategories.map((sport) => (
          <Card 
            key={sport.id} 
            className="p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setSelectedSport(sport)}
          >
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-br ${sport.gradient} flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-2xl">{sport.icon}</span>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {sport.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{sport.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {sport.subcategories.length} categor{sport.subcategories.length !== 1 ? 'ies' : 'y'}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SportsSelector;