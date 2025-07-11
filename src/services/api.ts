// API Configuration and Base Service
const API_BASE_URL = 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'participant' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Registration {
  id: number;
  userId: number;
  registrationType: 'student' | 'general';
  status: 'pending' | 'approved' | 'rejected';
  participantData: any;
  createdAt: string;
}

// Base API Class
class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data: data,
        message: data.message
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error or invalid response'
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: data ? JSON.stringify(data) : undefined
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        success: false,
        error: 'Network error'
      };
    }
  }
}

export const apiService = new ApiService();