
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';
import { Movie } from './MovieContext';

export type MovieList = {
  id: string;
  name: string;
  description: string;
  movies: string[]; // Array of movie IDs
  createdAt: string;
};

type MovieListsMap = Record<string, MovieList>;

type ListContextType = {
  lists: MovieList[];
  createList: (name: string, description: string) => void;
  deleteList: (listId: string) => void;
  updateList: (listId: string, updates: Partial<Omit<MovieList, 'id' | 'createdAt'>>) => void;
  addMovieToList: (listId: string, movieId: string) => void;
  removeMovieFromList: (listId: string, movieId: string) => void;
  isInList: (listId: string, movieId: string) => boolean;
  getListById: (listId: string) => MovieList | undefined;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const ListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [listsMap, setListsMap] = useState<MovieListsMap>({});

  // Load lists from localStorage
  useEffect(() => {
    if (user) {
      const savedLists = localStorage.getItem('movie-lists');
      if (savedLists) {
        setListsMap(JSON.parse(savedLists));
      }
    } else {
      setListsMap({});
    }
  }, [user]);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('movie-lists', JSON.stringify(listsMap));
    }
  }, [listsMap, user]);

  // Convert map to array for easier consumption by components
  const lists = Object.values(listsMap);

  const createList = (name: string, description: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create custom lists.',
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: 'Invalid list name',
        description: 'Please provide a name for your list.',
        variant: 'destructive',
      });
      return;
    }

    const newList: MovieList = {
      id: `list-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      movies: [],
      createdAt: new Date().toISOString(),
    };

    setListsMap(prev => ({
      ...prev,
      [newList.id]: newList
    }));

    toast({
      title: 'List created',
      description: `"${name}" has been created successfully.`,
    });
  };

  const deleteList = (listId: string) => {
    if (!listsMap[listId]) return;

    const listName = listsMap[listId].name;

    setListsMap(prev => {
      const newMap = { ...prev };
      delete newMap[listId];
      return newMap;
    });

    toast({
      title: 'List deleted',
      description: `"${listName}" has been deleted.`,
    });
  };

  const updateList = (listId: string, updates: Partial<Omit<MovieList, 'id' | 'createdAt'>>) => {
    if (!listsMap[listId]) return;

    setListsMap(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        ...updates,
      }
    }));

    toast({
      title: 'List updated',
      description: `"${updates.name || listsMap[listId].name}" has been updated.`,
    });
  };

  const addMovieToList = (listId: string, movieId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add movies to lists.',
        variant: 'destructive',
      });
      return;
    }

    if (!listsMap[listId]) return;

    // Check if movie is already in the list
    if (listsMap[listId].movies.includes(movieId)) {
      toast({
        title: 'Already in list',
        description: 'This movie is already in the selected list.',
        variant: 'destructive',
      });
      return;
    }

    setListsMap(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        movies: [...prev[listId].movies, movieId]
      }
    }));

    toast({
      title: 'Movie added to list',
      description: `Movie has been added to "${listsMap[listId].name}".`,
    });
  };

  const removeMovieFromList = (listId: string, movieId: string) => {
    if (!listsMap[listId]) return;

    setListsMap(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        movies: prev[listId].movies.filter(id => id !== movieId)
      }
    }));

    toast({
      title: 'Movie removed from list',
      description: `Movie has been removed from "${listsMap[listId].name}".`,
    });
  };

  const isInList = (listId: string, movieId: string): boolean => {
    return !!listsMap[listId]?.movies.includes(movieId);
  };

  const getListById = (listId: string): MovieList | undefined => {
    return listsMap[listId];
  };

  return (
    <ListContext.Provider
      value={{
        lists,
        createList,
        deleteList,
        updateList,
        addMovieToList,
        removeMovieFromList,
        isInList,
        getListById,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export const useLists = () => {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error('useLists must be used within a ListProvider');
  }
  return context;
};
