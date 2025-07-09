import React from 'react';
import { Award, AlertCircle } from 'lucide-react';

interface CertificateProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    documentsComplete: boolean;
  };
}

const Certificate: React.FC<CertificateProps> = ({ userData }) => {
  // Get user type from localStorage
  const userType = localStorage.getItem('userType') as 'pelajar' | 'umum' || 'pelajar';
  
  // Check if profile and documents are complete
  const canAccess = userType === 'pelajar' 
    ? userData.profileComplete && userData.documentsComplete
    : userData.profileComplete && userData.paymentComplete;
    
  if (!canAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sertifikat</h1>
          <p className="text-gray-600">Unduh sertifikat kelulusan program</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 mb-2">
                Akses Terbatas
              </h3>
              <p className="text-orange-700 mb-4">
                {userType === 'pelajar' 
                  ? 'Untuk mengakses fitur sertifikat, Anda harus melengkapi profil dan mengunggah semua berkas wajib terlebih dahulu.'
                  : 'Untuk mengakses fitur sertifikat, Anda harus melengkapi profil dan mengunggah bukti pembayaran terlebih dahulu.'
                }
              </p>
              <div className="flex gap-2">
                {!userData.profileComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Profil Belum Lengkap
                  </span>
                )}
                {userType === 'pelajar' && !userData.documentsComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Berkas Belum Lengkap
                  </span>
                )}
                {userType === 'umum' && !userData.paymentComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Bukti Pembayaran Belum Upload
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sertifikat</h1>
        <p className="text-gray-600">Unduh sertifikat kelulusan program</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Sertifikat Belum Tersedia
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Sertifikat akan tersedia setelah Anda menyelesaikan seluruh program bimbingan teknis 
            dan memenuhi semua persyaratan kelulusan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;