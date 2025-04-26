
import React from 'react';
import { Card } from '@/components/ui/card';
import { useMovies } from '@/contexts/MovieContext';
import { Check, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { AddToListButton } from './AddToListButton';
import { Button } from './ui/button';

type MovieCardProps = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  poster: string;
  type: 'movie' | 'series';
};

export const MovieCard: React.FC<MovieCardProps> = ({ 
  id, title, year, genres, poster, type
}) => {
  const { toggleWatched, isWatched, toggleFavorite, isFavorite } = useMovies();
  const { user } = useAuth();
  const watched = isWatched(id);
  const favorite = isFavorite(id);
  
  const handleToggleWatched = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatched(id);
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };
  
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer",
        "flex flex-col items-center justify-center"
      )}
      onClick={handleToggleWatched}
    >
      <div className="w-full relative">
        <AspectRatio ratio={2/3}>
          <img
            src={poster}
            alt={title}
            className={cn(
              "h-full w-full object-cover transition-all duration-300",
              watched ? "poster-watched" : "poster-unwatched"
            )}
          />
        </AspectRatio>
        
        {/* Actions dropdown - Watch, Favorite, Add to list */}
        {user && (
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-0">

            
            {/* Favorite button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80"
              onClick={handleToggleFavorite}
            >
              <Heart 
                size={16} 
                className={cn(
                  "transition-all duration-300",
                  favorite ? "fill-red-500 text-red-500" : "text-white"
                )} 
              />
            </Button>
            
            {/* Add to list button */}
            <AddToListButton 
              movieId={id} 
              movieTitle={title} 
              variant="ghost" 
              size="icon"
            />
          </div>
        )}
        
        {/* Info overlay on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "flex flex-col justify-end p-4"
          )}
        >
          <div className="text-white">
            <h3 className="font-bold truncate">{title}</h3>
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>{year}</span>
              <span className="px-2 py-0.5 bg-secondary/80 rounded-full text-xs">
                {type === 'movie' ? 'Movie' : 'Series'}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2 py-0.5 bg-muted/20 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
