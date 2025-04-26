
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Film, Mail, Settings, Users, List } from 'lucide-react';
import MovieRequestsAdmin from '@/components/MovieRequestsAdmin';

const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Redirect non-admin users
  if (!user || !isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
        <p className="text-muted-foreground mb-6">
          You need to be logged in with admin privileges to access this page.
        </p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background">
      {/* Admin Header */}
      <div className="bg-primary text-primary-foreground p-6 mb-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="opacity-90">Manage your movie database and user content</p>
      </div>
      
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-card p-1 rounded-lg shadow-sm">
          <TabsList className="w-full grid grid-cols-1 md:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Settings size={18} />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film size={18} />
              <span>Movies</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Mail size={18} />
              <span>Requests</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users size={18} />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className="flex items-center gap-2">
              <List size={18} />
              <span>Lists</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dashboard">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Movies</CardTitle>
                <CardDescription>Movie database statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">8</p>
                <p className="text-muted-foreground">Total movies in database</p>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/admin/add">
                    <Plus size={16} className="mr-2" />
                    Add New Movie
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>User management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">2</p>
                <p className="text-muted-foreground">Registered users</p>
                <Button variant="outline" className="w-full mt-4" disabled>
                  <Users size={16} className="mr-2" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Requests</CardTitle>
                <CardDescription>Movie addition requests</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">0</p>
                <p className="text-muted-foreground">Pending requests</p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => setActiveTab('requests')}
                >
                  <Mail size={16} className="mr-2" />
                  View Requests
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="movies">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Movie Database</CardTitle>
                  <CardDescription>Manage your movies and series collection</CardDescription>
                </div>
                <Button asChild>
                  <Link to="/admin/add">
                    <Plus size={16} className="mr-2" />
                    Add New Movie
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Visit the main page to view and manage all movies in the database.
              </p>
              <div className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link to="/">View All Movies</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests">
          <MovieRequestsAdmin />
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                User management functionality will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="lists">
          <Card>
            <CardHeader>
              <CardTitle>Custom Lists</CardTitle>
              <CardDescription>Browse user-created movie lists</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Custom list management will be available in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
