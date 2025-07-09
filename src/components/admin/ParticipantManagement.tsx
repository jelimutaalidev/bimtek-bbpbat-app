import React, { useState } from 'react';
import { Users, Building, Eye, Search, Filter, Download, MapPin, Calendar, CheckCircle, Clock, Award } from 'lucide-react';

const ParticipantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [activeDataType, setActiveDataType] = useState('active');
  const [selectedPlacement, setSelectedPlacement] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);

  const placementOptions = [
    'BIOFLOK NILA', 'PEMBENIHAN KOMET', 'PEMBENIHAN GURAME', 'PEMBENIHAN NILA SULTANA',
    'PEMBENIHAN BAUNG', 'PEMBENIHAN LELE SANGKURIANG', 'PEMBENIHAN PATIN', 'PEMBENIHAN MAS MANTAP',
    'PEMBENIHAN NILEM', 'Ikan Wader', 'PEMBENIHAN KOI', 'PEMBENIHAN MANFISH', 'IKAN KOKI',
    'PAKAN MANDIRI (BUATAN)', 'CACING SUTERA', 'MOINA', 'UDANG GALAH (PELABUHAN RATU)',
    'LAB KESEHATAN IKAN', 'LAB NUTRISI DAN RESIDU', 'LAB KUALITAS AIR', 'Pelayanan Publik',
    'Perpustakaan', 'Uji Terap Teknik dan Kerjasama', 'Arsip', 'Kepegawaian', 'Koperasi', 'KODOK LEMBU'
  ];

  const studentParticipants = {
    active: [
      {
        id: 1,
        nama: 'John Doe',
        instansi: 'Universitas Padjadjaran',
        penempatan: 'BIOFLOK NILA',
        status: 'Aktif',
        tanggalMulai: '2025-01-20',
        tanggalSelesai: '2025-03-20',
        progress: 45,
        kehadiran: 85,
        profileComplete: true,
        documentsComplete: true
      },
      {
        id: 2,
        nama: 'Sarah Wilson',
        instansi: 'Institut Teknologi Bandung',
        penempatan: 'LAB KESEHATAN IKAN',
        status: 'Aktif',
        tanggalMulai: '2025-01-22',
        tanggalSelesai: '2025-03-22',
        progress: 30,
        kehadiran: 92,
        profileComplete: false,
        documentsComplete: true
      },
      {
        id: 3,
        nama: 'David Chen',
        instansi: 'Universitas Brawijaya',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        status: 'Aktif',
        tanggalMulai: '2025-01-25',
        tanggalSelesai: '2025-03-25',
        progress: 20,
        kehadiran: 88,
        profileComplete: true,
        documentsComplete: false
      }
    ],
    completed: [
      {
        id: 4,
        nama: 'Michael Chen',
        instansi: 'Universitas Gadjah Mada',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        status: 'Selesai',
        tanggalMulai: '2024-11-01',
        tanggalSelesai: '2025-01-01',
        progress: 100,
        kehadiran: 95,
        nilaiAkhir: 85,
        laporanStatus: 'Diterima',
        profileComplete: true,
        documentsComplete: true
      },
      {
        id: 5,
        nama: 'Lisa Anderson',
        instansi: 'Universitas Brawijaya',
        penempatan: 'LAB KUALITAS AIR',
        status: 'Selesai',
        tanggalMulai: '2024-10-15',
        tanggalSelesai: '2024-12-15',
        progress: 100,
        kehadiran: 90,
        nilaiAkhir: 78,
        laporanStatus: 'Direview',
        profileComplete: true,
        documentsComplete: true
      },
      {
        id: 6,
        nama: 'Robert Kim',
        instansi: 'Institut Pertanian Bogor',
        penempatan: 'BIOFLOK NILA',
        status: 'Selesai',
        tanggalMulai: '2024-09-01',
        tanggalSelesai: '2024-11-01',
        progress: 100,
        kehadiran: 87,
        nilaiAkhir: 82,
        laporanStatus: 'Diterima',
        profileComplete: true,
        documentsComplete: true
      }
    ],
    graduated: [
      {
        id: 7,
        nama: 'Emma Watson',
        instansi: 'Universitas Diponegoro',
        penempatan: 'LAB KESEHATAN IKAN',
        status: 'Lulus',
        tanggalMulai: '2024-08-01',
        tanggalSelesai: '2024-10-01',
        progress: 100,
        kehadiran: 98,
        nilaiAkhir: 90,
        laporanStatus: 'Diterima',
        sertifikatStatus: 'Diterbitkan',
        nomorSertifikat: 'BBPBAT/CERT/2024/001',
        tanggalLulus: '2024-10-15',
        profileComplete: true,
        documentsComplete: true
      },
      {
        id: 8,
        nama: 'James Wilson',
        instansi: 'Universitas Hasanuddin',
        penempatan: 'PEMBENIHAN NILA SULTANA',
        status: 'Lulus',
        tanggalMulai: '2024-07-01',
        tanggalSelesai: '2024-09-01',
        progress: 100,
        kehadiran: 96,
        nilaiAkhir: 88,
        laporanStatus: 'Diterima',
        sertifikatStatus: 'Diterbitkan',
        nomorSertifikat: 'BBPBAT/CERT/2024/002',
        tanggalLulus: '2024-09-15',
        profileComplete: true,
        documentsComplete: true
      }
    ]
  };

  const generalParticipants = {
    active: [
      {
        id: 1,
        nama: 'Ahmad Rahman',
        instansi: 'Dinas Perikanan Jawa Barat',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        status: 'Aktif',
        tanggalMulai: '2025-01-15',
        tanggalSelesai: '2025-03-15',
        progress: 60,
        kehadiran: 94,
        profileComplete: true,
        documentsComplete: true
      },
      {
        id: 2,
        nama: 'Siti Nurhaliza',
        instansi: 'PT Aqua Nusantara',
        penempatan: 'LAB KUALITAS AIR',
        status: 'Aktif',
        tanggalMulai: '2025-01-18',
        tanggalSelesai: '2025-03-18',
        progress: 40,
        kehadiran: 89,
        profileComplete: true,
        documentsComplete: true
      }
    ],
    completed: [
      {
        id: 3,
        nama: 'Budi Santoso',
        instansi: 'Dinas Perikanan Jawa Timur',
        penempatan: 'BIOFLOK NILA',
        status: 'Selesai',
        tanggalMulai: '2024-11-01',
        tanggalSelesai: '2025-01-01',
        progress: 100,
        kehadiran: 92,
        nilaiAkhir: 86,
        laporanStatus: 'Diterima',
        profileComplete: true,
        documentsComplete: true
      }
    ],
    graduated: [
      {
        id: 4,
        nama: 'Dewi Sartika',
        instansi: 'PT Mina Bahari',
        penempatan: 'LAB NUTRISI DAN RESIDU',
        status: 'Lulus',
        tanggalMulai: '2024-08-01',
        tanggalSelesai: '2024-10-01',
        progress: 100,
        kehadiran: 97,
        nilaiAkhir: 91,
        laporanStatus: 'Diterima',
        sertifikatStatus: 'Diterbitkan',
        nomorSertifikat: 'BBPBAT/CERT/2024/003',
        tanggalLulus: '2024-10-20',
        profileComplete: true,
        documentsComplete: true
      }
    ]
  };

  const tabs = [
    { id: 'student', label: 'Pelajar', icon: <Users className="w-4 h-4" /> },
    { id: 'general', label: 'Masyarakat/Dinas', icon: <Building className="w-4 h-4" /> }
  ];

  const dataTypes = [
    { 
      id: 'active', 
      label: 'Data Peserta Aktif', 
      icon: <Clock className="w-4 h-4" />,
      color: 'text-blue-600 border-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'completed', 
      label: 'Data Peserta Selesai', 
      icon: <CheckCircle className="w-4 h-4" />,
      color: 'text-green-600 border-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      id: 'graduated', 
      label: 'Data Peserta Lulus', 
      icon: <Award className="w-4 h-4" />,
      color: 'text-purple-600 border-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const participants = activeTab === 'student' ? studentParticipants : generalParticipants;
  const currentParticipants = participants[activeDataType as keyof typeof participants] || [];

  const filteredParticipants = currentParticipants.filter(participant => {
    const matchesSearch = participant.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.instansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlacement = selectedPlacement === 'all' || participant.penempatan === selectedPlacement;
    return matchesSearch && matchesPlacement;
  });

  const groupedParticipants = placementOptions.reduce((acc, placement) => {
    const participantsInPlacement = filteredParticipants.filter(p => p.penempatan === placement);
    if (participantsInPlacement.length > 0) {
      acc[placement] = participantsInPlacement;
    }
    return acc;
  }, {} as Record<string, typeof currentParticipants>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-blue-100 text-blue-800';
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Lulus':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const mockDetailData = {
    // Personal Info
    namaLengkap: 'John Doe',
    alamat: 'Jl. Sudirman No. 123, Bandung, Jawa Barat',
    noTelepon: '+62 812 3456 7890',
    email: 'john.doe@email.com',
    namaOrangTua: 'Robert Doe',
    noTeleponOrangTua: '+62 813 4567 8901',
    tempatLahir: 'Bandung',
    tanggalLahir: '2000-05-15',
    golonganDarah: 'A',

    // Institution Info
    namaInstitusi: 'Universitas Padjadjaran',
    nomorInduk: '140810190001',
    alamatInstitusi: 'Jl. Raya Bandung-Sumedang KM.21, Jatinangor',
    emailInstitusi: 'info@unpad.ac.id',
    noTeleponInstitusi: '+62 22 7796363',
    namaPembimbing: 'Dr. Ahmad Suryadi, M.Si',
    noTeleponPembimbing: '+62 813 4567 8901',
    emailPembimbing: 'ahmad.suryadi@unpad.ac.id',

    // Internship Plan
    rencanaMultai: '2025-01-20',
    rencanaAkhir: '2025-03-20',
    penempatanPKL: 'BIOFLOK NILA',

    // Health Info
    riwayatPenyakit: 'Tidak ada riwayat penyakit serius dalam 2 tahun terakhir',
    penangananKhusus: 'Tidak ada penanganan khusus yang diperlukan',

    // Documents
    documents: {
      ktp: { uploaded: true, filename: 'KTP_JohnDoe.pdf' },
      ktm: { uploaded: true, filename: 'KTM_JohnDoe.pdf' },
      kk: { uploaded: true, filename: 'KK_JohnDoe.pdf' },
      photo: { uploaded: true, filename: 'Photo_JohnDoe.jpg' },
      proposal: { uploaded: true, filename: 'Proposal_JohnDoe.pdf' },
      nilai: { uploaded: true, filename: 'Transkrip_JohnDoe.pdf' },
      sertifikat: { uploaded: false, filename: null },
      pernyataan: { uploaded: true, filename: 'SuratPernyataan_JohnDoe.pdf' }
    }
  };

  const getDataTypeStats = () => {
    const studentStats = {
      active: studentParticipants.active.length,
      completed: studentParticipants.completed.length,
      graduated: studentParticipants.graduated.length
    };
    
    const generalStats = {
      active: generalParticipants.active.length,
      completed: generalParticipants.completed.length,
      graduated: generalParticipants.graduated.length
    };

    return activeTab === 'student' ? studentStats : generalStats;
  };

  const stats = getDataTypeStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Peserta</h1>
        <p className="text-gray-600">Kelola data lengkap peserta bimbingan teknis</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 rounded-lg p-2">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">+2 minggu ini</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.active}</h3>
          <p className="text-gray-600 text-sm">Peserta Aktif</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 rounded-lg p-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+5 bulan ini</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.completed}</h3>
          <p className="text-gray-600 text-sm">Peserta Selesai</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-100 rounded-lg p-2">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">+8 bulan ini</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{stats.graduated}</h3>
          <p className="text-gray-600 text-sm">Peserta Lulus</p>
        </div>
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

        {/* Data Type Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-4 px-6 py-3">
            {dataTypes.map((dataType) => (
              <button
                key={dataType.id}
                onClick={() => setActiveDataType(dataType.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors border-2 ${
                  activeDataType === dataType.id
                    ? `${dataType.color} ${dataType.bgColor}`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {dataType.icon}
                {dataType.label}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeDataType === dataType.id ? 'bg-white/50' : 'bg-gray-200'
                }`}>
                  {stats[dataType.id as keyof typeof stats]}
                </span>
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
                placeholder="Cari berdasarkan nama atau instansi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedPlacement}
              onChange={(e) => setSelectedPlacement(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Semua Penempatan</option>
              {placementOptions.map((placement) => (
                <option key={placement} value={placement}>
                  {placement}
                </option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>

          {/* Participants by Placement */}
          <div className="space-y-6">
            {Object.entries(groupedParticipants).map(([placement, participantsInPlacement]) => (
              <div key={placement} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">{placement}</h3>
                  <span className="text-sm text-gray-600">({participantsInPlacement.length} peserta)</span>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Peserta
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Instansi
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Periode
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status & Progress
                          </th>
                          {activeDataType !== 'active' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Hasil
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {participantsInPlacement.map((participant) => (
                          <tr key={participant.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{participant.nama}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{participant.instansi}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {participant.tanggalMulai} - {participant.tanggalSelesai}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                                  {participant.status}
                                </span>
                                {activeDataType === 'active' && (
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${getProgressColor(participant.progress)}`}
                                      style={{ width: `${participant.progress}%` }}
                                    ></div>
                                  </div>
                                )}
                                <div className="text-xs text-gray-500">
                                  Kehadiran: {participant.kehadiran}%
                                </div>
                              </div>
                            </td>
                            {activeDataType !== 'active' && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm space-y-1">
                                  <div>Nilai: <span className="font-medium">{participant.nilaiAkhir}</span></div>
                                  <div>Laporan: <span className="text-green-600">{participant.laporanStatus}</span></div>
                                  {activeDataType === 'graduated' && (
                                    <div>Sertifikat: <span className="text-purple-600">{participant.sertifikatStatus}</span></div>
                                  )}
                                </div>
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedParticipant(participant)}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                Detail Data
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredParticipants.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada peserta ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}
        </div>
      </div>

      {/* Participant Detail Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Detail Data Peserta</h3>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Informasi Dasar</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nama:</span> {selectedParticipant.nama}</div>
                    <div><span className="font-medium">Instansi:</span> {selectedParticipant.instansi}</div>
                    <div><span className="font-medium">Penempatan:</span> {selectedParticipant.penempatan}</div>
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedParticipant.status)}`}>
                        {selectedParticipant.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Periode & Progress</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Mulai:</span> {selectedParticipant.tanggalMulai}</div>
                    <div><span className="font-medium">Selesai:</span> {selectedParticipant.tanggalSelesai}</div>
                    <div><span className="font-medium">Progress:</span> {selectedParticipant.progress}%</div>
                    <div><span className="font-medium">Kehadiran:</span> {selectedParticipant.kehadiran}%</div>
                    {selectedParticipant.nilaiAkhir && (
                      <div><span className="font-medium">Nilai Akhir:</span> {selectedParticipant.nilaiAkhir}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info for Completed/Graduated */}
              {(activeDataType === 'completed' || activeDataType === 'graduated') && (
                <div className="border-t pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">Status Laporan</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Status:</span> 
                          <span className={`ml-2 ${selectedParticipant.laporanStatus === 'Diterima' ? 'text-green-600' : 'text-orange-600'}`}>
                            {selectedParticipant.laporanStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                    {activeDataType === 'graduated' && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">Informasi Sertifikat</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Status:</span> 
                            <span className="ml-2 text-purple-600">{selectedParticipant.sertifikatStatus}</span>
                          </div>
                          <div><span className="font-medium">Nomor:</span> {selectedParticipant.nomorSertifikat}</div>
                          <div><span className="font-medium">Tanggal Lulus:</span> {selectedParticipant.tanggalLulus}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Detailed Information Tabs */}
              <div className="border-t pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Informasi Pribadi</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Email:</span> {mockDetailData.email}</div>
                      <div><span className="font-medium">Telepon:</span> {mockDetailData.noTelepon}</div>
                      <div><span className="font-medium">Alamat:</span> {mockDetailData.alamat}</div>
                      <div><span className="font-medium">Tempat, Tanggal Lahir:</span> {mockDetailData.tempatLahir}, {mockDetailData.tanggalLahir}</div>
                      <div><span className="font-medium">Golongan Darah:</span> {mockDetailData.golonganDarah}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Informasi Institusi</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Nomor Induk:</span> {mockDetailData.nomorInduk}</div>
                      <div><span className="font-medium">Email Institusi:</span> {mockDetailData.emailInstitusi}</div>
                      {activeTab === 'student' && (
                        <>
                          <div><span className="font-medium">Pembimbing:</span> {mockDetailData.namaPembimbing}</div>
                          <div><span className="font-medium">Email Pembimbing:</span> {mockDetailData.emailPembimbing}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Status */}
              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-800 mb-3">Status Berkas</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(mockDetailData.documents).map(([key, doc]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">{key.toUpperCase()}</span>
                      <div className="flex items-center gap-2">
                        {doc.uploaded ? (
                          <>
                            <span className="text-xs text-green-600">✓ Uploaded</span>
                            <button className="text-blue-600 hover:text-blue-800">
                              <Download className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-red-600">✗ Belum Upload</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantManagement;