import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000' 
  : 'http://10.0.2.2:8000'; // Android emulator

// Types
export interface ChatMessage {
  id: number;
  session_id: number;
  content: string;
  is_user_message: boolean;
  created_at: string;
  ai_model?: string;
  processing_time?: number;
}

export interface ChatSession {
  id: number;
  user_id: number;
  title?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  message_count?: number;
}

export interface ChatRequest {
  message: string;
  session_id?: number;
}

export interface ChatResponse {
  user_message: ChatMessage;
  ai_message: ChatMessage;
  session: ChatSession;
}

export interface SessionListResponse {
  sessions: ChatSession[];
  total: number;
}

export interface SessionHistoryResponse {
  session: ChatSession;
  messages: ChatMessage[];
}

export class ChatService {
  private async getAuthToken(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem('auth_token');
      } else {
        return await SecureStore.getItemAsync('auth_token');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async sendMessage(message: string, sessionId?: number): Promise<ChatResponse> {
    const requestBody: ChatRequest = {
      message,
      ...(sessionId && { session_id: sessionId }),
    };

    return this.makeRequest<ChatResponse>('/chat/message', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  }

  async getSessions(skip: number = 0, limit: number = 20): Promise<SessionListResponse> {
    return this.makeRequest<SessionListResponse>(
      `/chat/sessions?skip=${skip}&limit=${limit}`
    );
  }

  async getSessionHistory(sessionId: number): Promise<SessionHistoryResponse> {
    return this.makeRequest<SessionHistoryResponse>(`/chat/sessions/${sessionId}`);
  }

  async createSession(title?: string): Promise<ChatSession> {
    return this.makeRequest<ChatSession>('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteSession(sessionId: number): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }
}

export const chatService = new ChatService();
