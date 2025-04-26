
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLists } from '@/contexts/ListContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ListPlus, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type AddToListButtonProps = {
  movieId: string;
  movieTitle: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

export const AddToListButton: React.FC<AddToListButtonProps> = ({ 
  movieId, 
  movieTitle,
  variant = 'outline',
  size = 'sm'
}) => {
  const { user } = useAuth();
  const { lists, addMovieToList, removeMovieFromList, isInList } = useLists();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleToggleInList = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    const alreadyInList = isInList(listId, movieId);
    
    if (alreadyInList) {
      removeMovieFromList(listId, movieId);
    } else {
      addMovieToList(listId, movieId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lists.length === 0) {
      setIsDialogOpen(true);
      toast({
        title: 'No lists available',
        description: 'Create a list first to add movies to it.',
      });
      return;
    }
  };

  return (
    <>
      {size === 'icon' ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={variant as any} 
              size="icon" 
              className="h-8 w-8 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80" 
              onClick={(e) => e.stopPropagation()}
              title="Add to list"
            >
              <ListPlus size={16} className="text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {lists.length === 0 ? (
              <DropdownMenuItem disabled>No lists available</DropdownMenuItem>
            ) : (
              lists.map(list => {
                const inList = isInList(list.id, movieId);
                return (
                  <DropdownMenuItem 
                    key={list.id}
                    onClick={(e) => handleToggleInList(e, list.id)}
                    className="flex items-center justify-between"
                  >
                    <span>{list.name}</span>
                    {inList ? (
                      <Check size={16} className="ml-2 text-primary" />
                    ) : null}
                  </DropdownMenuItem>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant={variant as any} 
              size={size} 
              className="flex items-center gap-1"
              onClick={handleClick}
            >
              <ListPlus size={16} />
              <span className={size === 'sm' ? 'hidden md:inline' : ''}>Add to list</span>
            </Button>
          </DialogTrigger>
          <DialogContent onClick={(e) => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Add "{movieTitle}" to List</DialogTitle>
              <DialogDescription>Choose a list to add this movie to</DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {lists.map(list => {
                const inList = isInList(list.id, movieId);
                return (
                  <div 
                    key={list.id}
                    className="flex items-center justify-between p-3 bg-card rounded-md hover:bg-muted cursor-pointer"
                    onClick={(e) => handleToggleInList(e, list.id)}
                  >
                    <div>
                      <h4 className="font-medium">{list.name}</h4>
                      {list.description && (
                        <p className="text-sm text-muted-foreground">{list.description}</p>
                      )}
                    </div>
                    <Button variant={inList ? "destructive" : "outline"} size="sm" className="flex items-center gap-1">
                      {inList ? (
                        <>
                          <X size={14} />
                          <span>Remove</span>
                        </>
                      ) : (
                        <>
                          <Check size={14} />
                          <span>Add</span>
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
