import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";

interface MovieSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Popular movie suggestions for better UX
const MOVIE_SUGGESTIONS = [
  "The Shawshank Redemption",
  "The Godfather",
  "The Dark Knight",
  "Pulp Fiction",
  "Forrest Gump",
  "Inception",
  "The Matrix",
  "Goodfellas",
  "The Lord of the Rings",
  "Star Wars",
  "Avatar",
  "Titanic",
  "Avengers",
  "Spider-Man",
  "Batman",
  "Iron Man",
  "Jurassic Park",
  "The Lion King",
  "Frozen",
  "Toy Story",
  "Finding Nemo",
  "The Incredibles",
  "Shrek",
  "Moana",
  "Encanto",
  "Black Panther",
  "Wonder Woman",
  "Guardians of the Galaxy",
  "Deadpool",
  "John Wick",
  "Mission Impossible",
  "Fast and Furious",
  "Transformers",
  "Pirates of the Caribbean",
  "Harry Potter",
  "The Hobbit",
  "Mad Max",
  "Blade Runner",
  "Alien",
  "Terminator",
  "Back to the Future",
  "Ghostbusters",
  "Indiana Jones",
  "Rocky",
  "Top Gun",
  "Interstellar",
  "Gravity",
  "La La Land",
  "Joker",
  "Parasite",
  "Nomadland",
  "Dune",
  "Spider-Man: No Way Home",
  "Doctor Strange",
  "Thor",
  "Captain America",
  "Ant-Man",
  "Captain Marvel",
  "The Eternals",
  "Shang-Chi",
  "Black Widow",
  "Loki",
  "WandaVision",
  "The Falcon and the Winter Soldier",
  "Squid Game",
  "Stranger Things",
  "The Crown",
  "Bridgerton",
  "Money Heist",
  "Breaking Bad",
  "Game of Thrones",
  "Friends",
  "The Office",
  "Brooklyn Nine-Nine",
  "How I Met Your Mother",
  "The Big Bang Theory",
  "Sherlock",
  "Peaky Blinders",
  "Vikings",
  "The Witcher",
  "House of Cards",
  "Narcos",
  "Orange Is the New Black",
  "Ozark",
  "Better Call Saul",
  "The Walking Dead",
  "Lost",
  "Prison Break",
  "24",
  "Homeland",
  "Suits",
  "Mad Men",
  "Westworld",
  "True Detective",
  "Fargo",
  "The Mandalorian",
  "House of the Dragon",
  "The Boys",
  "Euphoria",
  "Wednesday",
  "The Bear",
  "Ted Lasso",
  "Succession",
  "The White Lotus",
  "Mare of Easttown",
  "Queen's Gambit",
  "Bridgerton",
  "Emily in Paris",
  "Ginny & Georgia",
  "13 Reasons Why",
  "Riverdale",
  "Elite",
  "Sex Education",
  "Never Have I Ever",
  "To All the Boys",
  "The Kissing Booth",
  "After",
  "The Fault in Our Stars",
  "Me Before You",
  "A Star is Born",
  "Bohemian Rhapsody",
  "Rocketman",
  "Greatest Showman",
  "Mamma Mia",
  "High School Musical",
  "Grease",
  "Chicago",
  "Moulin Rouge",
  "Les Misérables"
];

export const MovieSuggestions = ({ value, onChange, placeholder, className }: MovieSuggestionsProps) => {
  const [open, setOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = MOVIE_SUGGESTIONS.filter(movie =>
        movie.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limit to 10 suggestions for better UX
      setFilteredSuggestions(filtered);
      setOpen(filtered.length > 0 && value.length > 1);
    } else {
      setFilteredSuggestions([]);
      setOpen(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    onChange(suggestion);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={`glow-border pr-10 ${className}`}
            onFocus={() => {
              if (value.length > 1 && filteredSuggestions.length > 0) {
                setOpen(true);
              }
            }}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 bg-card/95 backdrop-blur-sm border-primary/20" 
        align="start"
        sideOffset={4}
      >
        <Command>
          <CommandList>
            {filteredSuggestions.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                No movies found. Keep typing to add your own.
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredSuggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => handleSuggestionSelect(suggestion)}
                    className="cursor-pointer hover:bg-primary/10 transition-colors"
                  >
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};