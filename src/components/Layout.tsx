
import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const Layout: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};
