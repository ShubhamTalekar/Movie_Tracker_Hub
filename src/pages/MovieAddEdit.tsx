
import React, { useEffect } from 'react';
import { MovieForm } from '@/components/MovieForm';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMovies, Movie } from '@/contexts/MovieContext';
import { useAuth } from '@/contexts/AuthContext';

const MovieAddEdit: React.FC = () => {
  const { movieId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { movies } = useMovies();
  const { isAdmin } = useAuth();
  
  // Find the movie if we're editing
  const movie = movieId 
    ? state?.movie || movies.find(m => m.id === movieId) 
    : undefined;
  
  const isEditing = !!movieId;
  
  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // If editing but movie not found, redirect to admin
    if (isEditing && !movie) {
      navigate('/admin');
    }
  }, [isAdmin, navigate, isEditing, movie]);
  
  const handleCancel = () => {
    navigate('/admin');
  };
  
  if (!isAdmin) return null;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isEditing ? `Edit Movie: ${movie?.title}` : 'Add New Movie'}
      </h1>
      
      <MovieForm 
        movie={movie as Movie} 
        onCancel={handleCancel}
      />
    </div>
  );
};

export default MovieAddEdit;
