import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMovies, Movie } from '@/contexts/MovieContext';
import { useLists } from '@/contexts/ListContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MovieCard } from '@/components/MovieCard';
import { Loader2 } from 'lucide-react';
import { MovieLists } from '@/components/MovieLists';
import { FriendRequestButton } from '@/components/FriendRequestButton';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const { movies, watchedMovies, favoriteMovies, isWatched, isFavorite } = useMovies();
  
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('watched');
  
  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);
      if (userId) {
        // For demo purposes, we'll create a mock user with the userId
        const mockUser = {
          id: userId,
          name: userId === '1' ? 'Admin User' : 'Regular User',
          email: userId === '1' ? 'admin@example.com' : 'user@example.com',
          createdAt: new Date().toISOString()
        };
        setUser(mockUser);
      }
      setLoading(false);
    }
    
    fetchUserProfile();
  }, [userId]);
  
  const isOwnProfile = currentUser?.id === userId;
  
  // Get movies for the user based on the type (watched/favorites)
  const getMoviesForUser = (type: 'watched' | 'favorites') => {
    if (isOwnProfile) {
      // For the current user, use their own movie lists
      return movies.filter(movie => 
        type === 'watched' ? isWatched(movie.id) : isFavorite(movie.id)
      );
    } else if (isUserFriend) {
      // For a friend, filter based on their movie list
      // In a real app, this would be fetched from the backend
      // For our demo, we'll show random movies as watched/favorited by friends
      return movies.filter((movie, index) => 
        type === 'watched' 
          ? index % 3 === 0  // Every 3rd movie is "watched"
          : index % 4 === 0  // Every 4th movie is "favorite"
      );
    }
    return [];
  };
  
  const watchedMoviesList = getMoviesForUser('watched');
  const favoriteMoviesList = getMoviesForUser('favorites');
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">User not found</h2>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            
            {!isOwnProfile && currentUser && (
              <FriendRequestButton 
                userId={user.id} 
                userEmail={user.email}
                userName={user.name}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p>Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          <div className="flex gap-4 mt-2">
            <p>{watchedMoviesList.length} movies watched</p>
            <p>{favoriteMoviesList.length} movies favorited</p>
          </div>
        </CardContent>
      </Card>
      
      {(isOwnProfile || isUserFriend) && (
        <Tabs defaultValue="watched" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="watched">Watched Movies</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Movies</TabsTrigger>
            <TabsTrigger value="lists">Custom Lists</TabsTrigger>
            {isOwnProfile && <TabsTrigger value="watchlist">Watchlist</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="watched" className="pt-4">
            {watchedMoviesList.length > 0 ? (
              <div className="poster-grid">
                {watchedMoviesList.map((movie: Movie) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No watched movies yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="pt-4">
            {favoriteMoviesList.length > 0 ? (
              <div className="poster-grid">
                {favoriteMoviesList.map((movie: Movie) => (
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No favorite movies yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="lists" className="pt-4">
            <MovieLists isOwner={isOwnProfile} />
          </TabsContent>
          
          {isOwnProfile && (
            <TabsContent value="watchlist" className="pt-4">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Watchlist feature coming soon.</p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default UserProfile;
