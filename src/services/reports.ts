import { apiService } from './api';

export interface Report {
  id: number;
  userId: number;
  title: string;
  description?: string;
  filePath: string;
  fileName: string;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
  createdAt: string;
}

export interface UploadReportData {
  title: string;
  description?: string;
  file: File;
}

class ReportsService {
  async getReports() {
    return await apiService.get<Report[]>('/reports');
  }

  async uploadReport(data: UploadReportData) {
    const formData = new FormData();
    formData.append('report', data.file);
    formData.append('title', data.title);
    if (data.description) {
      formData.append('description', data.description);
    }

    return await apiService.uploadFile<Report>('/reports/upload', formData);
  }
}

export const reportsService = new ReportsService();