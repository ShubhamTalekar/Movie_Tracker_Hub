
import React from 'react';
import { MovieGrid } from '@/components/MovieGrid';
import { MovieFilters } from '@/components/MovieFilters';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6 p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight">Track your watched movies</h1>
          <p className="text-xl text-muted-foreground">
            Keep track of movies you've watched, discover new ones, and never forget what you've seen.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button onClick={() => navigate('/login')} size="lg">
              Get Started
            </Button>
            <Button onClick={() => navigate('/register')} variant="outline" size="lg">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-background z-10 pt-4 pb-4 border-b">
        <MovieFilters />
      </div>
      <MovieGrid />
    </div>
  );
};

export default Home;
