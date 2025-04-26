
import React from 'react';
import MovieRequestForm from '@/components/MovieRequestForm';

const MovieRequest: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Request a Movie</h1>
      <MovieRequestForm />
    </div>
  );
};

export default MovieRequest;
