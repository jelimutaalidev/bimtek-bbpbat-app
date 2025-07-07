import React, { useState } from 'react';
import { Users, Building, Eye, Search, Filter, Download, MapPin } from 'lucide-react';

const ParticipantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('student');
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

  const studentParticipants = [
    {
      id: 1,
      nama: 'John Doe',
      instansi: 'Universitas Padjadjaran',
      penempatan: 'BIOFLOK NILA',
      status: 'Aktif',
      tanggalMulai: '2025-01-20',
      tanggalSelesai: '2025-03-20',
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
      profileComplete: false,
      documentsComplete: true
    },
    {
      id: 3,
      nama: 'Michael Chen',
      instansi: 'Universitas Gadjah Mada',
      penempatan: 'PAKAN MANDIRI (BUATAN)',
      status: 'Selesai',
      tanggalMulai: '2024-11-01',
      tanggalSelesai: '2025-01-01',
      profileComplete: true,
      documentsComplete: true
    }
  ];

  const generalParticipants = [
    {
      id: 1,
      nama: 'Ahmad Rahman',
      instansi: 'Dinas Perikanan Jawa Barat',
      penempatan: 'PAKAN MANDIRI (BUATAN)',
      status: 'Aktif',
      tanggalMulai: '2025-01-15',
      tanggalSelesai: '2025-03-15',
      profileComplete: true,
      documentsComplete: false
    },
    {
      id: 2,
      nama: 'Siti Nurhaliza',
      instansi: 'PT Aqua Nusantara',
      penempatan: 'LAB KUALITAS AIR',
      status: 'Aktif',
      tanggalMulai: '2025-01-18',
      tanggalSelesai: '2025-03-18',
      profileComplete: true,
      documentsComplete: true
    }
  ];

  const tabs = [
    { id: 'student', label: 'Pelajar', icon: <Users className="w-4 h-4" /> },
    { id: 'general', label: 'Masyarakat/Dinas', icon: <Building className="w-4 h-4" /> }
  ];

  const participants = activeTab === 'student' ? studentParticipants : generalParticipants;

  const filteredParticipants = participants.filter(participant => {
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
  }, {} as Record<string, typeof participants>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800';
      case 'Selesai':
        return 'bg-blue-100 text-blue-800';
      case 'Lulus':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Data Peserta</h1>
        <p className="text-gray-600">Kelola data lengkap peserta bimbingan teknis</p>
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
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kelengkapan
                          </th>
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
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(participant.status)}`}>
                                {participant.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-1">
                                <span className={`w-3 h-3 rounded-full ${participant.profileComplete ? 'bg-green-500' : 'bg-red-500'}`} title="Profil"></span>
                                <span className={`w-3 h-3 rounded-full ${participant.documentsComplete ? 'bg-green-500' : 'bg-red-500'}`} title="Berkas"></span>
                              </div>
                            </td>
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
                  <h4 className="font-medium text-gray-800 mb-3">Periode PKL</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Mulai:</span> {selectedParticipant.tanggalMulai}</div>
                    <div><span className="font-medium">Selesai:</span> {selectedParticipant.tanggalSelesai}</div>
                    <div><span className="font-medium">Profil Lengkap:</span> 
                      <span className={`ml-2 ${selectedParticipant.profileComplete ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedParticipant.profileComplete ? 'Ya' : 'Tidak'}
                      </span>
                    </div>
                    <div><span className="font-medium">Berkas Lengkap:</span> 
                      <span className={`ml-2 ${selectedParticipant.documentsComplete ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedParticipant.documentsComplete ? 'Ya' : 'Tidak'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

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
                      <div><span className="font-medium">Pembimbing:</span> {mockDetailData.namaPembimbing}</div>
                      <div><span className="font-medium">Email Pembimbing:</span> {mockDetailData.emailPembimbing}</div>
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