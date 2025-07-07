import React from 'react';
import { ArrowLeft, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { NavigationState } from '../App';

interface RegistrationMenuProps {
  onNavigate: (page: NavigationState) => void;
}

const RegistrationMenu: React.FC<RegistrationMenuProps> = ({ onNavigate }) => {
  const registrationTypes = [
    {
      type: 'student',
      title: 'Daftar sebagai Pelajar',
      description: 'Untuk mahasiswa, siswa, atau pelajar yang ingin mengikuti program bimbingan teknis',
      icon: <GraduationCap className="w-12 h-12 text-blue-600" />,
      features: [
        'Surat rekomendasi dari institusi',
        'Pembimbing dari institusi',
        'Biaya pelatihan ditanggung institusi',
        'Sertifikat untuk keperluan akademik'
      ],
      color: 'border-blue-200 hover:border-blue-300 hover:bg-blue-50'
    },
    {
      type: 'general',
      title: 'Daftar sebagai Masyarakat Umum/Dinas',
      description: 'Untuk masyarakat umum, karyawan dinas, atau profesional yang ingin meningkatkan kompetensi',
      icon: <Users className="w-12 h-12 text-teal-600" />,
      features: [
        'Pendaftaran individu atau institusi',
        'Fleksibilitas waktu pelatihan',
        'Sertifikat untuk pengembangan karir',
        'Akses ke materi pelatihan lanjutan'
      ],
      color: 'border-teal-200 hover:border-teal-300 hover:bg-teal-50'
    }
  ];

  const handleRegistrationSelect = (type: string) => {
    if (type === 'student') {
      onNavigate('student-registration');
    } else {
      onNavigate('general-registration');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Pilih Jenis Pendaftaran
            </h1>
            <p className="text-lg text-gray-600">
              Silakan pilih kategori pendaftaran yang sesuai dengan status Anda
            </p>
          </div>

          {/* Registration Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {registrationTypes.map((option, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg p-8 border-2 transition-all duration-200 cursor-pointer ${option.color}`}
                onClick={() => handleRegistrationSelect(option.type)}
              >
                <div className="text-center mb-6">
                  <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    {option.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {option.title}
                  </h2>
                  <p className="text-gray-600">
                    {option.description}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {option.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegistrationSelect(option.type);
                  }}
                >
                  Pilih Pendaftaran Ini
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Penting
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Untuk Pelajar:</h4>
                <ul className="space-y-1">
                  <li>• Harus memiliki surat rekomendasi dari institusi</li>
                  <li>• Wajib mencantumkan data pembimbing</li>
                  <li>• Mengikuti seluruh rangkaian kegiatan</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Untuk Masyarakat Umum/Dinas:</h4>
                <ul className="space-y-1">
                  <li>• Melengkapi bukti pembayaran</li>
                  <li>• Menyertakan surat rekomendasi (jika dari dinas)</li>
                  <li>• Memiliki komitmen mengikuti pelatihan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationMenu;