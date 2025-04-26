
import React from 'react';
import { MovieCard } from './MovieCard';
import { useMovies } from '@/contexts/MovieContext';

export const MovieGrid: React.FC = () => {
  const { filteredMovies } = useMovies();
  
  if (filteredMovies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-lg text-muted-foreground">No movies found.</p>
      </div>
    );
  }
  
  return (
    <div className="poster-grid z-0">
      {filteredMovies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          year={movie.year}
          genres={movie.genres}
          poster={movie.poster}
          type={movie.type}
        />
      ))}
    </div>
  );
};
