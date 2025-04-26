
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMovies } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { AddToListButton } from '@/components/AddToListButton';
import { Heart, Eye } from 'lucide-react';

type MovieCardActionsProps = {
  movieId: string;
  movieTitle: string;
};

export const MovieCardActions: React.FC<MovieCardActionsProps> = ({ movieId, movieTitle }) => {
  const { user } = useAuth();
  const { toggleWatched, toggleFavorite, isWatched, isFavorite } = useMovies();
  
  if (!user) return null;
  
  return (
    <div className="flex gap-1 absolute top-2 right-2 z-10 bg-black/60 p-1 rounded backdrop-blur-md">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:text-primary hover:bg-background/20"
        onClick={() => toggleWatched(movieId)}
        title={isWatched(movieId) ? "Remove from watched" : "Mark as watched"}
      >
        <Eye size={16} className={isWatched(movieId) ? "fill-primary text-primary" : ""} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-white hover:text-primary hover:bg-background/20"
        onClick={() => toggleFavorite(movieId)}
        title={isFavorite(movieId) ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart size={16} className={isFavorite(movieId) ? "fill-primary text-primary" : ""} />
      </Button>
      
      <AddToListButton movieId={movieId} movieTitle={movieTitle} variant="ghost" size="icon" />
    </div>
  );
};
