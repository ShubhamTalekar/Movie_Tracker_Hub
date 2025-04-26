
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MovieProvider } from "@/contexts/MovieContext";
import { FriendProvider } from "@/contexts/FriendContext";
import { ListProvider } from "@/contexts/ListContext";
import { Layout } from "@/components/Layout";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Admin from "@/pages/Admin";
import MovieAddEdit from "@/pages/MovieAddEdit";
import UserProfile from "@/pages/UserProfile";
import MovieRequest from "@/pages/MovieRequest";
import NotFound from "@/pages/NotFound";

// Create a query client instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <MovieProvider>
                <FriendProvider>
                  <ListProvider>
                    <BrowserRouter>
                      <Toaster />
                      <Sonner />
                      <Routes>
                        <Route element={<Layout />}>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/register" element={<Register />} />
                          <Route path="/profile/:userId" element={<UserProfile />} />
                          <Route path="/request" element={<MovieRequest />} />
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/admin/add" element={<MovieAddEdit />} />
                          <Route path="/admin/edit/:movieId" element={<MovieAddEdit />} />
                          <Route path="*" element={<NotFound />} />
                        </Route>
                      </Routes>
                    </BrowserRouter>
                  </ListProvider>
                </FriendProvider>
              </MovieProvider>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
