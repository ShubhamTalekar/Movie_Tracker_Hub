import React, { useState } from 'react';
import { useLists, MovieList } from '@/contexts/ListContext';
import { useMovies, Movie } from '@/contexts/MovieContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MovieCard } from '@/components/MovieCard';
import { Plus, Trash2, Pencil } from 'lucide-react';

type ListFormProps = {
  onSubmit: (name: string, description: string) => void;
  initialName?: string;
  initialDescription?: string;
  buttonText: string;
};

const ListForm: React.FC<ListFormProps> = ({
  onSubmit,
  initialName = '',
  initialDescription = '',
  buttonText,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, description);
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="List Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <Button type="submit" disabled={!name.trim()}>
        {buttonText}
      </Button>
    </form>
  );
};

type MovieListCardProps = {
  list: MovieList;
  isEditable?: boolean;
  showMovies?: boolean;
};

export const MovieListCard: React.FC<MovieListCardProps> = ({
  list,
  isEditable = true,
  showMovies = false,
}) => {
  const { deleteList, updateList } = useLists();
  const { movies } = useMovies();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'movie' | 'series'>('all');

  const handleUpdate = (name: string, description: string) => {
    updateList(list.id, { name, description });
    setIsEditDialogOpen(false);
  };

  const moviesInList = movies.filter((movie) => {
    const isInList = list.movies.includes(movie.id);
    const matchesType = typeFilter === 'all' || movie.type === typeFilter;
    return isInList && matchesType;
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{list.name}</CardTitle>
            {list.description && (
              <CardDescription className="mt-1">{list.description}</CardDescription>
            )}
          </div>
          {isEditable && (
            <div className="flex gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Pencil size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit List</DialogTitle>
                    <DialogDescription>Make changes to your list details</DialogDescription>
                  </DialogHeader>
                  <ListForm
                    onSubmit={handleUpdate}
                    initialName={list.name}
                    initialDescription={list.description}
                    buttonText="Save Changes"
                  />
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={() => deleteList(list.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{list.movies.length} {list.movies.length === 1 ? 'movie' : 'movies'}</span>
          <span>Created on {new Date(list.createdAt).toLocaleDateString()}</span>
        </div>

        {showMovies && (
          <div className="mt-4 space-y-4">
            <div className="flex gap-2">
              <Button onClick={() => setTypeFilter('all')} variant={typeFilter === 'all' ? 'default' : 'outline'}>All</Button>
              <Button onClick={() => setTypeFilter('movie')} variant={typeFilter === 'movie' ? 'default' : 'outline'}>Movies</Button>
              <Button onClick={() => setTypeFilter('series')} variant={typeFilter === 'series' ? 'default' : 'outline'}>Series</Button>
            </div>

            {moviesInList.length > 0 ? (
              <div className="poster-grid">
                {moviesInList.map((movie: Movie) => (
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
              <p className="text-sm text-muted-foreground">No {typeFilter !== 'all' ? typeFilter + 's' : 'movies or series'} found in this list.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const MovieLists: React.FC<{ isOwner?: boolean }> = ({ isOwner = true }) => {
  const { lists, createList } = useLists();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreate = (name: string, description: string) => {
    createList(name, description);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Movie Lists</h2>
        {isOwner && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus size={18} />
                <span>Create List</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New List</DialogTitle>
                <DialogDescription>Create a custom list to organize your favorite movies</DialogDescription>
              </DialogHeader>
              <ListForm onSubmit={handleCreate} buttonText="Create List" />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-md">
          {isOwner ? (
            <p className="text-muted-foreground">You haven't created any lists yet.</p>
          ) : (
            <p className="text-muted-foreground">This user hasn't created any lists yet.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {lists.map((list) => (
            <MovieListCard key={list.id} list={list} isEditable={isOwner} showMovies />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieLists;
