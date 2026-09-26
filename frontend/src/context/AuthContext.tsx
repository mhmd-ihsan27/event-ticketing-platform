import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import type { User, AuthResponse, RegisterPendingResponse, VerifyEmailResponse } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ email: string }>;
  verifyOtp: (email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch current user profile on initial load if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          const response = await api.get<AuthResponse>('/auth/me');
          if (response.data.data?.user) {
            setUser(response.data.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
          }
        } catch {
          // Token expired or invalid
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setUser(null);
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    if (response.data.data) {
      const { user: userData, accessToken: token } = response.data.data;
      setUser(userData);
      setAccessToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await api.post<RegisterPendingResponse>('/auth/register', { name, email, password });
    return { email: response.data.data?.email || email };
  };

  const verifyOtp = async (email: string, code: string) => {
    const response = await api.post<VerifyEmailResponse>('/auth/verify-email', { email, code });
    if (response.data.data) {
      const { user: userData, accessToken: token } = response.data.data;
      setUser(userData);
      setAccessToken(token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', token);
    }
  };

  const resendOtp = async (email: string) => {
    await api.post('/auth/resend-otp', { email });
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
