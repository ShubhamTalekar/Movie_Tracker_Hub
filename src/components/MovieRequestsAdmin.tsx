
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Film } from 'lucide-react';
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

export const MovieRequestsAdmin: React.FC = () => {
  const [requests, setRequests] = useState<MovieRequest[]>([]);
  const [activeTab, setActiveTab] = useState<string>('pending');

  // Load requests from localStorage
  useEffect(() => {
    const savedRequests = localStorage.getItem('movie-requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  }, []);

  // Save requests to localStorage when they change
  useEffect(() => {
    localStorage.setItem('movie-requests', JSON.stringify(requests));
  }, [requests]);

  const handleUpdateStatus = (requestId: string, newStatus: 'approved' | 'rejected') => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    toast({
      title: `Request ${newStatus}`,
      description: `The movie request has been ${newStatus}.`,
    });
  };

  // Filter requests based on the active tab
  const filteredRequests = requests.filter(req => 
    activeTab === 'all' ? true : req.status === activeTab
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Movie Requests</h2>
        <Badge variant={activeTab === 'pending' ? "default" : "outline"}>
          {requests.filter(req => req.status === 'pending').length} pending
        </Badge>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="pt-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No {activeTab === 'all' ? '' : activeTab} requests found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {request.title}
                          <Badge variant={request.type === 'movie' ? "default" : "secondary"} className="text-xs">
                            {request.type}
                          </Badge>
                          {request.year && (
                            <span className="text-sm text-muted-foreground">({request.year})</span>
                          )}
                        </CardTitle>
                        <CardDescription>
                          Requested by {request.requestedBy.name} on {new Date(request.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        request.status === 'approved' ? "secondary" : 
                        request.status === 'rejected' ? "destructive" : 
                        "outline"
                      }>
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {request.description ? (
                      <p className="text-sm mb-4">{request.description}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground mb-4">No additional information provided.</p>
                    )}
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleUpdateStatus(request.id, 'rejected')}
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleUpdateStatus(request.id, 'approved')}
                        >
                          <Check size={16} />
                          <span>Approve</span>
                        </Button>
                      </div>
                    )}
                    
                    {request.status === 'approved' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                        >
                          <Film size={16} />
                          <span>Add to Database</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MovieRequestsAdmin;
