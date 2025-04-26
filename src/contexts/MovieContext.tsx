import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export type Movie = {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year: number;
  genres: string[];
  poster: string;
  description: string;
};

type WatchedMovies = Record<string, boolean>;
type FavoriteMovies = Record<string, boolean>;

type MovieContextType = {
  movies: Movie[];
  watchedMovies: WatchedMovies;
  favoriteMovies: FavoriteMovies;
  watchedCount: number;
  favoriteCount: number;
  toggleWatched: (movieId: string) => void;
  toggleFavorite: (movieId: string) => void;
  isWatched: (movieId: string) => boolean;
  isFavorite: (movieId: string) => boolean;
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  updateMovie: (movie: Movie) => void;
  deleteMovie: (movieId: string) => void;
  filteredMovies: Movie[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  selectedType: 'all' | 'movie' | 'series';
  setSelectedType: (type: 'all' | 'movie' | 'series') => void;
  yearRange: [number, number];
  setYearRange: (range: [number, number]) => void;
};

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovies>({});
  const [favoriteMovies, setFavoriteMovies] = useState<FavoriteMovies>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [yearRange, setYearRange] = useState<[number, number]>([1900, 2100]);

  // ✅ Fetch movies from backend on load
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/movies');
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formatted = data.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          description: m.description,
          genres: m.genre.split(',').map((g: string) => g.trim()),
          year: m.release_year,
          poster: m.poster_url,
          type: m.type === 'series' ? 'series' : 'movie',
        }));
        setMovies(formatted);
  
        // Update year range from fetched movies
        const years = formatted.map((m: Movie) => m.year);
        const min = Math.min(...years);
        const max = Math.max(...years);
        setYearRange([min, max]);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Failed to load movies',
          description: 'Please check your server connection.',
          variant: 'destructive',
        });
      }
    };
  
    fetchMovies(); // initial load
  
    const interval = setInterval(() => {
      console.log('⏳ Refreshing movie list...');
      fetchMovies();
    }, 30 * 60 * 1000); // 30 minutes in ms
    toast({ title: 'Movie list refreshed' });
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  

  useEffect(() => {
    if (user) {
      const savedWatchedMovies = localStorage.getItem('watched-movies');
      const savedFavoriteMovies = localStorage.getItem('favorite-movies');

      setWatchedMovies(savedWatchedMovies ? JSON.parse(savedWatchedMovies) : {});
      setFavoriteMovies(savedFavoriteMovies ? JSON.parse(savedFavoriteMovies) : {});
    } else {
      setWatchedMovies({});
      setFavoriteMovies({});
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('watched-movies', JSON.stringify(watchedMovies));
    }
  }, [watchedMovies, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('favorite-movies', JSON.stringify(favoriteMovies));
    }
  }, [favoriteMovies, user]);

  const toggleWatched = (movieId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to track watched movies.',
        variant: 'destructive',
      });
      return;
    }

    setWatchedMovies(prev => {
      const updated = { ...prev };
      if (updated[movieId]) delete updated[movieId];
      else updated[movieId] = true;
      return updated;
    });
  };

  const toggleFavorite = (movieId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add favorites.',
        variant: 'destructive',
      });
      return;
    }

    setFavoriteMovies(prev => {
      const updated = { ...prev };
      if (updated[movieId]) {
        delete updated[movieId];
        toast({ title: 'Removed from favorites' });
      } else {
        updated[movieId] = true;
        toast({ title: 'Added to favorites' });
      }
      return updated;
    });
  };

  const isWatched = (movieId: string) => !!watchedMovies[movieId];
  const isFavorite = (movieId: string) => !!favoriteMovies[movieId];
  const watchedCount = Object.keys(watchedMovies).length;
  const favoriteCount = Object.keys(favoriteMovies).length;

  const addMovie = async (movieData: Omit<Movie, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: movieData.title,
          description: movieData.description,
          release_year: movieData.year,
          genre: movieData.genres.join(', '),
          poster_url: movieData.poster,
          type: movieData.type,
        }),
      });

      if (!response.ok) throw new Error('Failed to add movie');

      const newMovie = await response.json();
      const formatted: Movie = {
        id: newMovie.id.toString(),
        title: newMovie.title,
        description: newMovie.description,
        genres: newMovie.genre.split(',').map((g: string) => g.trim()),
        year: newMovie.release_year,
        poster: newMovie.poster_url,
        type: 'movie',
      };

      setMovies(prev => [formatted, ...prev]);

      toast({
        title: 'Movie added',
        description: `${formatted.title} has been added.`,
      });
    } catch (error) {
      console.error('Error adding movie:', error);
      toast({
        title: 'Error adding movie',
        description: 'There was a problem while adding the movie.',
        variant: 'destructive',
      });
    }
  };

  const updateMovie = (movie: Movie) => {
    setMovies(prev => prev.map(m => (m.id === movie.id ? movie : m)));
    toast({ title: 'Movie updated', description: `${movie.title} has been updated.` });
  };

  const deleteMovie = (movieId: string) => {
    const movieToDelete = movies.find(m => m.id === movieId);
    if (!movieToDelete) return;

    setMovies(prev => prev.filter(m => m.id !== movieId));
    setWatchedMovies(prev => {
      const updated = { ...prev };
      delete updated[movieId];
      return updated;
    });
    setFavoriteMovies(prev => {
      const updated = { ...prev };
      delete updated[movieId];
      return updated;
    });

    toast({ title: 'Movie deleted', description: `${movieToDelete.title} has been removed.` });
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenres =
      selectedGenres.length === 0 || movie.genres.some(g => selectedGenres.includes(g));
    const matchesType = selectedType === 'all' || movie.type === selectedType;
    const matchesYear = movie.year >= yearRange[0] && movie.year <= yearRange[1];

    return matchesSearch && matchesGenres && matchesType && matchesYear;
  });

  return (
    <MovieContext.Provider
      value={{
        movies,
        watchedMovies,
        favoriteMovies,
        watchedCount,
        favoriteCount,
        toggleWatched,
        toggleFavorite,
        isWatched,
        isFavorite,
        addMovie,
        updateMovie,
        deleteMovie,
        filteredMovies,
        searchTerm,
        setSearchTerm,
        selectedGenres,
        setSelectedGenres,
        selectedType,
        setSelectedType,
        yearRange,
        setYearRange,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within a MovieProvider');
  return context;
};
