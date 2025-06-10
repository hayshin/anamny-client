import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('checkAuthStatus: Starting auth check...');
      setIsLoading(true);
      const token = await authService.getToken();
      console.log('checkAuthStatus: Token found:', !!token);
      
      if (token) {
        const userData = await authService.getUser();
        console.log('checkAuthStatus: User data found:', !!userData);
        
        if (userData) {
          console.log('checkAuthStatus: Setting user from stored data:', userData.email);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data, try to fetch from API
          try {
            console.log('checkAuthStatus: Fetching profile from API...');
            const profile = await authService.getProfile();
            console.log('checkAuthStatus: Profile fetched successfully:', profile.email);
            setUser(profile);
            await authService.setUser(profile);
            setIsAuthenticated(true);
          } catch (error) {
            // Invalid token, clear everything
            console.log('checkAuthStatus: Failed to fetch profile, clearing auth:', error);
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } else {
        console.log('checkAuthStatus: No token found, user not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('checkAuthStatus: Error during auth check:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('checkAuthStatus: Auth check completed');
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      await authService.setToken(response.access_token);
      await authService.setUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      await authService.setToken(response.access_token);
      await authService.setUser(response.user);
      
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(updates);
      await authService.setUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
