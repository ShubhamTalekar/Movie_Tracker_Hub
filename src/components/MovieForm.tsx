
import React, { useState } from 'react';
import { useMovies, Movie } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type MovieFormProps = {
  movie?: Movie;
  onCancel: () => void;
};

export const MovieForm: React.FC<MovieFormProps> = ({ movie, onCancel }) => {
  const { addMovie, updateMovie } = useMovies();
  const isEditing = !!movie;
  
  const [title, setTitle] = useState(movie?.title || '');
  const [type, setType] = useState<'movie' | 'series'>(movie?.type || 'movie');
  const [year, setYear] = useState<number>(movie?.year || new Date().getFullYear());
  const [poster, setPoster] = useState(movie?.poster || '');
  const [description, setDescription] = useState(movie?.description || '');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState<string[]>(movie?.genres || []);
  
  const [posterPreview, setPosterPreview] = useState(movie?.poster || '');
  const [showPosterPreview, setShowPosterPreview] = useState(!!movie?.poster);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGenreAdd = () => {
    if (!genre) return;
    if (!genres.includes(genre)) {
      setGenres([...genres, genre]);
    }
    setGenre('');
  };

  const handleGenreRemove = (genreToRemove: string) => {
    setGenres(genres.filter(g => g !== genreToRemove));
  };
  
  const handlePosterUrlChange = (url: string) => {
    setPoster(url);
    if (url) {
      setPosterPreview(url);
      setShowPosterPreview(true);
    } else {
      setShowPosterPreview(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!poster.trim()) newErrors.poster = 'Poster URL is required';
    if (genres.length === 0) newErrors.genres = 'At least one genre is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const movieData = {
      title,
      type,
      year,
      poster,
      description,
      genres,
    };
    
    if (isEditing && movie) {
      updateMovie({ ...movieData, id: movie.id });
    } else {
      addMovie(movieData);
    }
    
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter movie title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(val: 'movie' | 'series') => setType(val)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="movie">Movie</SelectItem>
                  <SelectItem value="series">Series</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Release Year</Label>
              <Input
                id="year"
                type="number"
                min={1900}
                max={new Date().getFullYear() + 5}
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="poster">Poster URL</Label>
            <Input
              id="poster"
              value={poster}
              onChange={(e) => handlePosterUrlChange(e.target.value)}
              placeholder="https://example.com/poster.jpg"
              className={errors.poster ? 'border-destructive' : ''}
            />
            {errors.poster && <p className="text-destructive text-sm">{errors.poster}</p>}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <Label htmlFor="genres">Genres</Label>
              {errors.genres && <p className="text-destructive text-sm">{errors.genres}</p>}
            </div>
            <div className="flex gap-2">
              <Input
                id="genres"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Add a genre"
                className="flex-1"
              />
              <Button type="button" onClick={handleGenreAdd} size="sm">
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {genres.map((g) => (
                <Badge key={g} variant="secondary" className="px-2 py-1">
                  {g}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleGenreRemove(g)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {showPosterPreview && (
            <Card className="p-2 h-80 overflow-hidden">
              <img
                src={posterPreview}
                alt="Poster preview"
                className="w-full h-full object-cover rounded-sm"
                onError={() => setShowPosterPreview(false)}
              />
            </Card>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter movie description"
              className={`min-h-[150px] ${errors.description ? 'border-destructive' : ''}`}
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Movie' : 'Add Movie'}
        </Button>
      </div>
    </form>
  );
};
