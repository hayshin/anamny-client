import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual API URL

export interface User {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  full_name?: string;
  age?: number;
  gender?: string;
  blood_type?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';

  // Token management
  async getToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        return localStorage.getItem(AuthService.TOKEN_KEY);
      } else {
        // Use SecureStore for mobile
        return await SecureStore.getItemAsync(AuthService.TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  async setToken(token: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        localStorage.setItem(AuthService.TOKEN_KEY, token);
      } else {
        // Use SecureStore for mobile
        await SecureStore.setItemAsync(AuthService.TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error setting token:', error);
    }
  }

  async removeToken(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        // Use localStorage for web
        localStorage.removeItem(AuthService.TOKEN_KEY);
      } else {
        // Use SecureStore for mobile
        await SecureStore.deleteItemAsync(AuthService.TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }

  // User data management
  async getUser(): Promise<User | null> {
    try {
      let userData: string | null;
      if (Platform.OS === 'web') {
        userData = localStorage.getItem(AuthService.USER_KEY);
      } else {
        userData = await AsyncStorage.getItem(AuthService.USER_KEY);
      }
      
      if (!userData) {
        return null;
      }
      
      try {
        return JSON.parse(userData);
      } catch (parseError) {
        console.error('Error parsing user data, clearing corrupted data:', parseError);
        // Clear corrupted data
        await this.removeUser();
        return null;
      }
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async setUser(user: User): Promise<void> {
    try {
      const userData = JSON.stringify(user);
      if (Platform.OS === 'web') {
        localStorage.setItem(AuthService.USER_KEY, userData);
      } else {
        await AsyncStorage.setItem(AuthService.USER_KEY, userData);
      }
    } catch (error) {
      console.error('Error setting user:', error);
    }
  }

  async removeUser(): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(AuthService.USER_KEY);
      } else {
        await AsyncStorage.removeItem(AuthService.USER_KEY);
      }
    } catch (error) {
      console.error('Error removing user:', error);
    }
  }

  // API calls
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async getProfile(): Promise<User> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to get profile');
    }

    return response.json();
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to update profile');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    await this.removeToken();
    await this.removeUser();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
