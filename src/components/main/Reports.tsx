import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

interface ReportsProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    documentsComplete: boolean;
  };
}

const Reports: React.FC<ReportsProps> = ({ userData }) => {
  // Check if profile and documents are complete
  if (!userData.profileComplete || !userData.documentsComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>
          <p className="text-gray-600">Kelola laporan kegiatan PKL Anda</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 mb-2">
                Akses Terbatas
              </h3>
              <p className="text-orange-700 mb-4">
                Untuk mengakses fitur laporan, Anda harus melengkapi profil dan mengunggah semua berkas wajib terlebih dahulu.
              </p>
              <div className="flex gap-2">
                {!userData.profileComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Profil Belum Lengkap
                  </span>
                )}
                {!userData.documentsComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Berkas Belum Lengkap
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
        <h1 className="text-2xl font-bold text-gray-800">Laporan</h1>
        <p className="text-gray-600">Kelola laporan kegiatan PKL Anda</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Fitur Laporan Segera Hadir
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Fitur untuk mengelola laporan kegiatan PKL sedang dalam pengembangan. 
            Anda akan dapat mengupload, mengedit, dan mengelola laporan harian serta laporan akhir di sini.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;