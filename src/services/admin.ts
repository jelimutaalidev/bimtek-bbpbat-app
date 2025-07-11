import { apiService } from './api';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export interface AdminRegistration {
  id: number;
  userId: number;
  type: string;
  eventName: string;
  participantData: any;
  status: string;
  createdAt: string;
  email: string;
  fullName: string;
}

export interface UpdateRegistrationStatusData {
  status: 'approved' | 'rejected';
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
}

class AdminService {
  async getUsers() {
    return await apiService.get<AdminUser[]>('/admin/users');
  }

  async getRegistrations() {
    return await apiService.get<AdminRegistration[]>('/admin/registrations');
  }

  async updateRegistrationStatus(registrationId: number, data: UpdateRegistrationStatusData) {
    return await apiService.put(`/admin/registrations/${registrationId}/status`, data);
  }

  async createAnnouncement(data: CreateAnnouncementData) {
    return await apiService.post('/admin/announcements', data);
  }
}

export const adminService = new AdminService();