import { apiService, User } from './api';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  organization?: string;
  role: string;
  createdAt: string;
}

export interface UpdateProfileData {
  fullName: string;
  phone?: string;
  organization?: string;
}

class UserService {
  async getProfile() {
    return await apiService.get<UserProfile>('/users/profile');
  }

  async updateProfile(data: UpdateProfileData) {
    return await apiService.put<UserProfile>('/users/profile', data);
  }
}

export const userService = new UserService();