import { apiService } from './api';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'normal' | 'high' | 'urgent';
  createdBy: number;
  createdAt: string;
}

class AnnouncementsService {
  async getAnnouncements() {
    return await apiService.get<Announcement[]>('/announcements');
  }
}

export const announcementsService = new AnnouncementsService();