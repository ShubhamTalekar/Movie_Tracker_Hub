import React from 'react';
import { useMovies } from '@/contexts/MovieContext';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, Film, Tv, Check, FilterX, SlidersHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export const MovieFilters: React.FC = () => {
  const { 
    setSearchTerm, 
    selectedGenres, 
    setSelectedGenres, 
    selectedType, 
    setSelectedType,
    yearRange,
    setYearRange,
    movies
  } = useMovies();

  const [searchValue, setSearchValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const allGenres = React.useMemo(() => {
    const genreSet = new Set<string>();
    movies.forEach(movie => {
      movie.genres.forEach(genre => genreSet.add(genre));
    });
    return Array.from(genreSet).sort();
  }, [movies]);

  const allYears = React.useMemo(() => {
    const years = movies.map(movie => movie.year);
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }, [movies]);

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSelectedGenres([]);
    setSelectedType('all');
    setYearRange([allYears.min, allYears.max]);
  };

  const handleYearRangeChange = (value: number[]) => {
    setYearRange([value[0], value[1]]);
  };

  return (
    <div className="space-y-4">
      <div className="relative z-50">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search movies and series..."
          className="pl-10"
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {selectedGenres.slice(0, 3).map(genre => (
                <Badge key={genre} variant="secondary" className="cursor-pointer" onClick={() => handleGenreToggle(genre)}>
                  {genre}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
              {selectedGenres.length > 3 && (
                <Badge variant="outline">+{selectedGenres.length - 3} more</Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-1 flex justify-center">
          <ToggleGroup
            type="single"
            value={selectedType}
            onValueChange={(value) => value && setSelectedType(value as 'all' | 'movie' | 'series')}
          >
            <ToggleGroupItem value="all" aria-label="Toggle all">All</ToggleGroupItem>
            <ToggleGroupItem value="movie" aria-label="Toggle movies">
              <Film className="h-4 w-4 mr-1" /> Movies
            </ToggleGroupItem>
            <ToggleGroupItem value="series" aria-label="Toggle series">
              <Tv className="h-4 w-4 mr-1" /> Series
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(selectedGenres.length > 0 || yearRange[0] !== allYears.min || yearRange[1] !== allYears.max) && (
                <Badge variant="secondary" className="ml-1">
                  {selectedGenres.length + (yearRange[0] !== allYears.min || yearRange[1] !== allYears.max ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Year Range</h3>
                <div className="flex justify-between mb-2">
                  <span>{yearRange[0]}</span>
                  <span>{yearRange[1]}</span>
                </div>
                <Slider
                  min={allYears.min}
                  max={allYears.max}
                  step={1}
                  value={yearRange}
                  onValueChange={handleYearRangeChange}
                  className="w-full"
                />
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">
                  Genres ({selectedGenres.length} selected)
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {allGenres.map((genre) => (
                    <div 
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={cn(
                        "flex items-center px-2 py-1 rounded-md cursor-pointer text-sm",
                        selectedGenres.includes(genre) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      )}
                    >
                      <div className={cn(
                        "mr-2 h-4 w-4 flex items-center justify-center rounded-sm border",
                        selectedGenres.includes(genre) 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-muted-foreground"
                      )}>
                        {selectedGenres.includes(genre) && <Check className="h-3 w-3" />}
                      </div>
                      {genre}
                    </div>
                  ))}
                </div>
              </div>
              
              {(selectedGenres.length > 0 || yearRange[0] !== allYears.min || yearRange[1] !== allYears.max) && (
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-destructive hover:text-destructive"
                    onClick={() => {
                      handleClearFilters();
                      setOpen(false);
                    }}
                  >
                    <FilterX className="h-4 w-4 mr-2" /> Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
