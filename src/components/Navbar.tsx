
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMovies } from '@/contexts/MovieContext';
import { Moon, Sun, Film, User, LogIn, LogOut, Plus, Settings, ListPlus } from 'lucide-react';
import { FriendRequests } from '@/components/FriendRequests';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { watchedCount } = useMovies();

  return (
    <nav className="sticky top-0 z-30 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MovieTrack</span>
            </Link>
            
            {/* Removed the Movies and Profile links that were here */}
          </div>
          
          {/* Right side links and buttons */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center mr-2">
                <Film size={16} className="text-primary mr-1" />
                <span className="text-sm font-medium">{watchedCount} Watched</span>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                {/* Friend requests notification */}
                <FriendRequests />
                
                <Link to="/request">
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ListPlus size={16} />
                    <span className="hidden md:inline">Request Movie</span>
                  </Button>
                </Link>
                
                {isAdmin && (
                  <Link to="/admin">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Settings size={16} />
                      <span className="hidden md:inline">Admin</span>
                    </Button>
                  </Link>
                )}

                {isAdmin && (
                  <Link to="/admin/add">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Plus size={16} />
                      <span className="hidden md:inline">Add Movie</span>
                    </Button>
                  </Link>
                )}

                <Link to={`/profile/${user.id}`} className="hidden md:flex items-center space-x-1 text-sm font-medium">
                  <User size={16} className="inline" />
                  <span>{user.name}</span>
                </Link>

                <Button size="sm" variant="ghost" onClick={logout} className="flex items-center gap-1">
                  <LogOut size={16} />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button size="sm" variant="secondary" className="flex items-center gap-1">
                    <LogIn size={16} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register" className="hidden md:block">
                  <Button size="sm" variant="outline">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
