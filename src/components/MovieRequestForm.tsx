
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

type MovieRequest = {
  id: string;
  title: string;
  type: 'movie' | 'series';
  year?: number;
  description: string;
  requestedBy: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export const MovieRequestForm: React.FC = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'movie' | 'series'>('movie');
  const [year, setYear] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a movie request.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    
    // In a real app, this would be sent to a backend API
    // For demo, we'll simulate the request and store in localStorage
    const newRequest: MovieRequest = {
      id: `req-${Date.now()}`,
      title: title.trim(),
      type,
      year: year ? parseInt(year) : undefined,
      description: description.trim(),
      requestedBy: {
        id: user.id,
        name: user.name,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Get existing requests from localStorage
    const existingRequestsJson = localStorage.getItem('movie-requests');
    const existingRequests = existingRequestsJson ? JSON.parse(existingRequestsJson) : [];
    
    // Add the new request
    const updatedRequests = [...existingRequests, newRequest];
    localStorage.setItem('movie-requests', JSON.stringify(updatedRequests));

    toast({
      title: 'Request submitted',
      description: 'Your movie request has been sent to the admins for review.',
    });

    // Reset form
    setTitle('');
    setType('movie');
    setYear('');
    setDescription('');
    setSubmitting(false);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request a Movie</CardTitle>
          <CardDescription>Please log in to request movies to be added to our database.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Movie</CardTitle>
        <CardDescription>
          Can't find a movie in our database? Submit a request to have it added.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Movie Title *</Label>
            <Input
              id="title"
              placeholder="Enter movie title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type *</Label>
            <RadioGroup
              defaultValue="movie"
              value={type}
              onValueChange={(value) => setType(value as 'movie' | 'series')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="movie" id="movie" />
                <Label htmlFor="movie">Movie</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="series" id="series" />
                <Label htmlFor="series">TV Series</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Release Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="Release year (optional)"
              value={year}
              onChange={(e) => {
                const val = e.target.value;
                if (!val || (parseInt(val) >= 1900 && parseInt(val) <= new Date().getFullYear())) {
                  setYear(val);
                }
              }}
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Additional Information</Label>
            <Textarea
              id="description"
              placeholder="Any details that might help the admins add this movie (actors, director, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={!title.trim() || submitting}>
            {submitting ? 'Submitting...' : 'Submit Request'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MovieRequestForm;
