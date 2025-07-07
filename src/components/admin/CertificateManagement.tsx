import React, { useState } from 'react';
import { Users, Building, Award, Download, Search, Filter, CheckCircle, Clock, Send } from 'lucide-react';

const CertificateManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'student', label: 'Pelajar', icon: <Users className="w-4 h-4" /> },
    { id: 'general', label: 'Masyarakat/Dinas', icon: <Building className="w-4 h-4" /> }
  ];

  const certificatesData = {
    student: [
      {
        id: 1,
        nama: 'Michael Chen',
        instansi: 'Universitas Gadjah Mada',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        tanggalMulai: '2024-11-01',
        tanggalSelesai: '2025-01-01',
        status: 'siap_terbit',
        nilaiAkhir: 85,
        kehadiran: 95,
        laporanStatus: 'diterima'
      },
      {
        id: 2,
        nama: 'Lisa Anderson',
        instansi: 'Universitas Brawijaya',
        penempatan: 'LAB KUALITAS AIR',
        tanggalMulai: '2024-10-15',
        tanggalSelesai: '2024-12-15',
        status: 'diterbitkan',
        nilaiAkhir: 88,
        kehadiran: 92,
        laporanStatus: 'diterima',
        nomorSertifikat: 'BBPBAT/CERT/2024/001',
        tanggalTerbit: '2024-12-20'
      },
      {
        id: 3,
        nama: 'John Doe',
        instansi: 'Universitas Padjadjaran',
        penempatan: 'BIOFLOK NILA',
        tanggalMulai: '2025-01-20',
        tanggalSelesai: '2025-03-20',
        status: 'belum_memenuhi',
        nilaiAkhir: 0,
        kehadiran: 85,
        laporanStatus: 'belum_submit'
      }
    ],
    general: [
      {
        id: 1,
        nama: 'Siti Nurhaliza',
        instansi: 'PT Aqua Nusantara',
        penempatan: 'LAB KUALITAS AIR',
        tanggalMulai: '2024-11-01',
        tanggalSelesai: '2025-01-01',
        status: 'diterbitkan',
        nilaiAkhir: 90,
        kehadiran: 98,
        laporanStatus: 'diterima',
        nomorSertifikat: 'BBPBAT/CERT/2024/002',
        tanggalTerbit: '2025-01-05'
      },
      {
        id: 2,
        nama: 'Ahmad Rahman',
        instansi: 'Dinas Perikanan Jawa Barat',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        tanggalMulai: '2025-01-15',
        tanggalSelesai: '2025-03-15',
        status: 'belum_memenuhi',
        nilaiAkhir: 0,
        kehadiran: 88,
        laporanStatus: 'direview'
      }
    ]
  };

  const currentData = certificatesData[activeTab as keyof typeof certificatesData];

  const filteredData = currentData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.penempatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'siap_terbit':
        return 'bg-blue-100 text-blue-800';
      case 'diterbitkan':
        return 'bg-green-100 text-green-800';
      case 'belum_memenuhi':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'siap_terbit':
        return 'Siap Terbit';
      case 'diterbitkan':
        return 'Diterbitkan';
      case 'belum_memenuhi':
        return 'Belum Memenuhi Syarat';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'siap_terbit':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'diterbitkan':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'belum_memenuhi':
        return <Clock className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleIssueCertificate = (participantId: number) => {
    const nomorSertifikat = `BBPBAT/CERT/2025/${String(participantId).padStart(3, '0')}`;
    alert(`Sertifikat berhasil diterbitkan!\nNomor Sertifikat: ${nomorSertifikat}\n\nSertifikat akan dikirim ke email peserta.`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const checkEligibility = (participant: any) => {
    const minKehadiran = 80;
    const minNilai = 75;
    const laporanOk = participant.laporanStatus === 'diterima';
    
    return {
      kehadiranOk: participant.kehadiran >= minKehadiran,
      nilaiOk: participant.nilaiAkhir >= minNilai,
      laporanOk: laporanOk,
      eligible: participant.kehadiran >= minKehadiran && participant.nilaiAkhir >= minNilai && laporanOk
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Sertifikat</h1>
        <p className="text-gray-600">Kelola penerbitan sertifikat peserta bimbingan teknis</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, instansi, atau penempatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="siap_terbit">Siap Terbit</option>
              <option value="diterbitkan">Diterbitkan</option>
              <option value="belum_memenuhi">Belum Memenuhi Syarat</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>

          {/* Certificates Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peserta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penempatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Periode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nilai/Kehadiran
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status Sertifikat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((participant) => {
                    const eligibility = checkEligibility(participant);
                    
                    return (
                      <tr key={participant.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{participant.nama}</div>
                            <div className="text-sm text-gray-500">{participant.instansi}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{participant.penempatan}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(participant.tanggalMulai)} - {formatDate(participant.tanggalSelesai)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className={`${eligibility.nilaiOk ? 'text-green-600' : 'text-red-600'}`}>
                              Nilai: {participant.nilaiAkhir}
                            </div>
                            <div className={`${eligibility.kehadiranOk ? 'text-green-600' : 'text-red-600'}`}>
                              Kehadiran: {participant.kehadiran}%
                            </div>
                            <div className={`${eligibility.laporanOk ? 'text-green-600' : 'text-red-600'}`}>
                              Laporan: {participant.laporanStatus}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(participant.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                              {getStatusLabel(participant.status)}
                            </span>
                          </div>
                          {participant.nomorSertifikat && (
                            <div className="text-xs text-gray-500 mt-1">
                              No: {participant.nomorSertifikat}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            {participant.status === 'siap_terbit' && (
                              <button
                                onClick={() => handleIssueCertificate(participant.id)}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                                title="Terbitkan Sertifikat"
                              >
                                <Send className="w-4 h-4" />
                                Terbitkan
                              </button>
                            )}
                            {participant.status === 'diterbitkan' && (
                              <button className="text-green-600 hover:text-green-900 flex items-center gap-1" title="Unduh Sertifikat">
                                <Download className="w-4 h-4" />
                                Unduh
                              </button>
                            )}
                            {participant.status === 'belum_memenuhi' && (
                              <span className="text-red-600 text-xs">Belum memenuhi syarat</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data sertifikat</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.filter(p => p.status === 'siap_terbit').length}
              </div>
              <div className="text-sm text-blue-800">Siap Terbit</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentData.filter(p => p.status === 'diterbitkan').length}
              </div>
              <div className="text-sm text-green-800">Diterbitkan</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {currentData.filter(p => p.status === 'belum_memenuhi').length}
              </div>
              <div className="text-sm text-red-800">Belum Memenuhi</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">
                {currentData.length}
              </div>
              <div className="text-sm text-gray-800">Total Peserta</div>
            </div>
          </div>

          {/* Requirements Info */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Syarat Penerbitan Sertifikat:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Kehadiran minimal 80%</li>
              <li>• Nilai akhir minimal 75</li>
              <li>• Laporan PKL telah diterima</li>
              <li>• Menyelesaikan seluruh rangkaian kegiatan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateManagement;