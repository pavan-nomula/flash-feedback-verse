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

export const MovieSuggestions = ({ value, onChange, placeholder, className }: MovieSuggestionsProps) => {
  const [open, setOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fallback movie suggestions while API key is not configured
  const fallbackMovies = [
    "The Shawshank Redemption", "The Godfather", "The Dark Knight", "Pulp Fiction",
    "Forrest Gump", "Inception", "The Matrix", "Goodfellas", "Star Wars", "Avatar",
    "Titanic", "Avengers", "Spider-Man", "Batman", "Iron Man", "Jurassic Park"
  ];

  const searchMovies = async (query: string) => {
    if (query.length < 2) {
      setFilteredSuggestions([]);
      return;
    }

    setLoading(true);
    console.log('Searching for movies:', query);

    try {
      const response = await fetch('/functions/v1/search-movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        console.log('API not available, using fallback suggestions');
        // Fallback to local filtering
        const filtered = fallbackMovies.filter(movie =>
          movie.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        setFilteredSuggestions(filtered);
        setOpen(filtered.length > 0);
        return;
      }

      const data = await response.json();
      console.log('API response:', data);

      if (data.movies && Array.isArray(data.movies)) {
        setFilteredSuggestions(data.movies);
        setOpen(data.movies.length > 0);
      } else {
        console.log('Invalid response, using fallback');
        const filtered = fallbackMovies.filter(movie =>
          movie.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 10);
        setFilteredSuggestions(filtered);
        setOpen(filtered.length > 0);
      }
    } catch (error) {
      console.log('API error, using fallback suggestions:', error);
      // Fallback to local filtering
      const filtered = fallbackMovies.filter(movie =>
        movie.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      setFilteredSuggestions(filtered);
      setOpen(filtered.length > 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMovies(value);
    }, 300); // Debounce API calls

    return () => clearTimeout(timeoutId);
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
            {loading ? (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                Searching for movies...
              </CommandEmpty>
            ) : filteredSuggestions.length === 0 ? (
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