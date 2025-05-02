import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const API = import.meta.env.VITE_API_URL;

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API}/api/auth/register`, {
        username: name,
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.data) {
        setUser(response.data);
        console.log("Registration successful:", response.data);
      }
    } catch (error: any) {
      console.error("Registration error:", error.response?.data || error.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.data) {
        setUser(response.data);
        console.log("Login successful:", response.data);
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
