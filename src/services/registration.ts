import { apiService, Registration } from './api';

export interface StudentRegistrationData {
  nama: string;
  instansi: string;
  nomerWA: string;
  pembimbing: string;
  nomerWAPembimbing: string;
  pilihanPenempatan: string;
  suratPengajuan?: File;
}

export interface GeneralRegistrationData {
  nama: string;
  instansi: string;
  nomerWA: string;
  pilihanPenempatan: string;
  suratPengajuan?: File;
}

class RegistrationService {
  async submitStudentRegistration(data: StudentRegistrationData) {
    const registrationData = {
      registrationType: 'student',
      participantData: {
        nama: data.nama,
        instansi: data.instansi,
        nomerWA: data.nomerWA,
        pembimbing: data.pembimbing,
        nomerWAPembimbing: data.nomerWAPembimbing,
        pilihanPenempatan: data.pilihanPenempatan
      }
    };

    return await apiService.post<Registration>('/registrations', registrationData);
  }

  async submitGeneralRegistration(data: GeneralRegistrationData) {
    const registrationData = {
      registrationType: 'general',
      participantData: {
        nama: data.nama,
        instansi: data.instansi,
        nomerWA: data.nomerWA,
        pilihanPenempatan: data.pilihanPenempatan
      }
    };

    return await apiService.post<Registration>('/registrations', registrationData);
  }

  async getUserRegistrations() {
    return await apiService.get<Registration[]>('/registrations');
  }

  async uploadDocument(file: File, documentType: string) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', documentType);

    return await apiService.uploadFile('/registrations/documents', formData);
  }
}

export const registrationService = new RegistrationService();