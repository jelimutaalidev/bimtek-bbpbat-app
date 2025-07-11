import { apiService } from './api';

export interface Certificate {
  id: number;
  userId: number;
  eventId: string;
  eventName: string;
  status: 'pending' | 'issued' | 'downloaded';
  issuedDate?: string;
  certificatePath?: string;
  createdAt: string;
}

export interface RequestCertificateData {
  eventId: string;
  eventName: string;
}

class CertificatesService {
  async getCertificates() {
    return await apiService.get<Certificate[]>('/certificates');
  }

  async requestCertificate(data: RequestCertificateData) {
    return await apiService.post<Certificate>('/certificates/request', data);
  }
}

export const certificatesService = new CertificatesService();