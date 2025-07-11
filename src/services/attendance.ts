import { apiService } from './api';

export interface AttendanceRecord {
  id: number;
  userId: number;
  sessionName: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late';
  date: string;
}

export interface MarkAttendanceData {
  eventId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

class AttendanceService {
  async getAttendanceRecords() {
    return await apiService.get<AttendanceRecord[]>('/attendance');
  }

  async markAttendance(data: MarkAttendanceData) {
    return await apiService.post<AttendanceRecord>('/attendance', data);
  }
}

export const attendanceService = new AttendanceService();