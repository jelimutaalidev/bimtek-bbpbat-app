import React from 'react';
import { CheckCircle, Clock, Calendar, Download, MessageCircle, ArrowLeft } from 'lucide-react';
import { NavigationState } from '../App';

interface HomePageProps {
  onNavigate: (page: NavigationState) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  // Mock data - in real app this would come from API
  const registrationData = {
    status: 'submitted',
    submittedAt: '2025-01-15T10:30:00Z',
    registrationNumber: 'BBPBAT-2025-001234',
    name: 'John Doe',
    type: 'student',
    placement: 'Teknologi Budidaya Ikan Air Tawar',
    institution: 'Universitas Padjadjaran'
  };

  const statusConfig = {
    submitted: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: <Clock className="w-5 h-5" />,
      title: 'Menunggu Verifikasi',
      description: 'Pendaftaran Anda sedang dalam proses verifikasi oleh tim BBPBAT'
    },
    verified: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Terverifikasi',
      description: 'Pendaftaran Anda telah diverifikasi dan akan diproses lebih lanjut'
    },
    approved: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Diterima',
      description: 'Selamat! Pendaftaran Anda telah diterima'
    }
  };

  const currentStatus = statusConfig[registrationData.status as keyof typeof statusConfig];

  const nextSteps = [
    {
      title: 'Verifikasi Dokumen',
      description: 'Tim BBPBAT akan memverifikasi dokumen yang Anda kirim',
      status: 'in-progress',
      estimatedTime: '1-3 hari kerja'
    },
    {
      title: 'Konfirmasi Penerimaan',
      description: 'Anda akan dihubungi via WhatsApp untuk konfirmasi',
      status: 'pending',
      estimatedTime: '4-5 hari kerja'
    },
    {
      title: 'Informasi Jadwal',
      description: 'Detail jadwal dan persiapan pelatihan akan dikirimkan',
      status: 'pending',
      estimatedTime: '1 minggu sebelum pelatihan'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Beranda
            </button>
            <div className="text-sm text-gray-600">
              No. Pendaftaran: <span className="font-mono font-medium">{registrationData.registrationNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Selamat Datang, {registrationData.name}!
            </h1>
            <p className="text-gray-600">
              Terima kasih telah mendaftar program Bimbingan Teknis BBPBAT
            </p>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 border ${currentStatus.color}`}>
                {currentStatus.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Status Pendaftaran: {currentStatus.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {currentStatus.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tanggal Pendaftaran:</span>
                    <p className="font-medium">{formatDate(registrationData.submittedAt)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Jenis Pendaftaran:</span>
                    <p className="font-medium">
                      {registrationData.type === 'student' ? 'Pelajar' : 'Masyarakat Umum/Dinas'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bidang Penempatan:</span>
                    <p className="font-medium">{registrationData.placement}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Instansi:</span>
                    <p className="font-medium">{registrationData.institution}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Langkah Selanjutnya
            </h3>
            <div className="space-y-4">
              {nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.status === 'in-progress' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{step.title}</h4>
                    <p className="text-gray-600 text-sm mb-1">{step.description}</p>
                    <span className="text-xs text-gray-500">Estimasi: {step.estimatedTime}</span>
                  </div>
                  {step.status === 'in-progress' && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <button className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-800">Unduh Berkas</span>
              </div>
              <p className="text-sm text-gray-600">
                Unduh salinan formulir pendaftaran dan dokumen pendukung
              </p>
            </button>

            <button className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-800">Hubungi Admin</span>
              </div>
              <p className="text-sm text-gray-600">
                Ada pertanyaan? Hubungi admin melalui WhatsApp
              </p>
            </button>

            <button className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-orange-100 rounded-lg p-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <span className="font-medium text-gray-800">Jadwal Pelatihan</span>
              </div>
              <p className="text-sm text-gray-600">
                Lihat jadwal dan informasi lengkap pelatihan
              </p>
            </button>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Butuh Bantuan?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">WhatsApp Admin:</span>
                <p className="text-blue-800">+62 812 3456 7890</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Email:</span>
                <p className="text-blue-800">info@bbpbat.go.id</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Jam Operasional:</span>
                <p className="text-blue-800">Senin - Jumat, 08:00 - 16:00 WIB</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Respon Time:</span>
                <p className="text-blue-800">Maksimal 24 jam (hari kerja)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;