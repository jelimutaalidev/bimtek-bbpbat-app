import { apiService, AuthResponse, User } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role?: 'participant' | 'admin';
}

class AuthService {
  async login(credentials: LoginCredentials) {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userType', response.data.user.role === 'admin' ? 'admin' : 'participant');
    }
    
    return response;
  }

  async register(data: RegisterData) {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    
    if (response.success && response.data) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('userType', response.data.user.role === 'admin' ? 'admin' : 'participant');
    }
    
    return response;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export const authService = new AuthService();