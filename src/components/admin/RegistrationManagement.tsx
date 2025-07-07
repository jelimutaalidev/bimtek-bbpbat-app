import React, { useState } from 'react';
import { 
  Users, 
  Building, 
  Eye, 
  Check, 
  X, 
  Download,
  Search,
  Filter,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const RegistrationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('new-registrations');
  const [activeSubTab, setActiveSubTab] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<any>(null);

  const placementOptions = [
    'BIOFLOK NILA', 'PEMBENIHAN KOMET', 'PEMBENIHAN GURAME', 'PEMBENIHAN NILA SULTANA',
    'PEMBENIHAN BAUNG', 'PEMBENIHAN LELE SANGKURIANG', 'PEMBENIHAN PATIN', 'PEMBENIHAN MAS MANTAP',
    'PEMBENIHAN NILEM', 'Ikan Wader', 'PEMBENIHAN KOI', 'PEMBENIHAN MANFISH', 'IKAN KOKI',
    'PAKAN MANDIRI (BUATAN)', 'CACING SUTERA', 'MOINA', 'UDANG GALAH (PELABUHAN RATU)',
    'LAB KESEHATAN IKAN', 'LAB NUTRISI DAN RESIDU', 'LAB KUALITAS AIR', 'Pelayanan Publik',
    'Perpustakaan', 'Uji Terap Teknik dan Kerjasama', 'Arsip', 'Kepegawaian', 'Koperasi', 'KODOK LEMBU'
  ];

  const [quotas, setQuotas] = useState<Record<string, { student: number; general: number; used: { student: number; general: number } }>>({
    'BIOFLOK NILA': { student: 10, general: 5, used: { student: 7, general: 2 } },
    'PEMBENIHAN KOMET': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'PEMBENIHAN GURAME': { student: 6, general: 3, used: { student: 5, general: 2 } },
    'PEMBENIHAN NILA SULTANA': { student: 12, general: 6, used: { student: 8, general: 2 } },
    'PEMBENIHAN BAUNG': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'PEMBENIHAN LELE SANGKURIANG': { student: 15, general: 8, used: { student: 10, general: 3 } },
    'PEMBENIHAN PATIN': { student: 10, general: 5, used: { student: 7, general: 2 } },
    'PEMBENIHAN MAS MANTAP': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'PEMBENIHAN NILEM': { student: 6, general: 3, used: { student: 5, general: 2 } },
    'Ikan Wader': { student: 10, general: 5, used: { student: 7, general: 2 } },
    'PEMBENIHAN KOI': { student: 12, general: 6, used: { student: 8, general: 2 } },
    'PEMBENIHAN MANFISH': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'IKAN KOKI': { student: 6, general: 3, used: { student: 5, general: 2 } },
    'PAKAN MANDIRI (BUATAN)': { student: 20, general: 10, used: { student: 14, general: 4 } },
    'CACING SUTERA': { student: 10, general: 5, used: { student: 7, general: 2 } },
    'MOINA': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'UDANG GALAH (PELABUHAN RATU)': { student: 6, general: 3, used: { student: 5, general: 2 } },
    'LAB KESEHATAN IKAN': { student: 12, general: 6, used: { student: 8, general: 2 } },
    'LAB NUTRISI DAN RESIDU': { student: 10, general: 5, used: { student: 7, general: 2 } },
    'LAB KUALITAS AIR': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'Pelayanan Publik': { student: 15, general: 8, used: { student: 10, general: 3 } },
    'Perpustakaan': { student: 10, general: 5, used: { student: 7, general: 2 } },
    'Uji Terap Teknik dan Kerjasama': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'Arsip': { student: 12, general: 6, used: { student: 8, general: 2 } },
    'Kepegawaian': { student: 6, general: 3, used: { student: 5, general: 2 } },
    'Koperasi': { student: 8, general: 4, used: { student: 6, general: 2 } },
    'KODOK LEMBU': { student: 10, general: 5, used: { student: 10, general: 5 } }
  });

  const studentRegistrations = [
    {
      id: 1,
      nama: 'John Doe',
      instansi: 'Universitas Padjadjaran',
      nomerWA: '+62 812 3456 7890',
      pembimbing: 'Dr. Ahmad Suryadi',
      nomerWAPembimbing: '+62 813 4567 8901',
      pilihanPenempatan: 'BIOFLOK NILA',
      tanggalDaftar: '2025-01-15',
      status: 'pending'
    },
    {
      id: 2,
      nama: 'Sarah Wilson',
      instansi: 'Institut Teknologi Bandung',
      nomerWA: '+62 814 5678 9012',
      pembimbing: 'Prof. Budi Santoso',
      nomerWAPembimbing: '+62 815 6789 0123',
      pilihanPenempatan: 'LAB KESEHATAN IKAN',
      tanggalDaftar: '2025-01-14',
      status: 'pending'
    }
  ];

  const generalRegistrations = [
    {
      id: 1,
      nama: 'Ahmad Rahman',
      instansi: 'Dinas Perikanan Jawa Barat',
      nomerWA: '+62 816 7890 1234',
      pilihanPenempatan: 'PAKAN MANDIRI (BUATAN)',
      tanggalDaftar: '2025-01-13',
      status: 'pending'
    }
  ];

  const tabs = [
    { id: 'new-registrations', label: 'Pendaftaran Baru', icon: <Users className="w-4 h-4" /> },
    { id: 'quota-management', label: 'Kuota Pendaftar', icon: <Building className="w-4 h-4" /> }
  ];

  const subTabs = [
    { id: 'student', label: 'Pelajar' },
    { id: 'general', label: 'Masyarakat/Dinas' }
  ];

  const handleApprove = (id: number, type: 'student' | 'general') => {
    // Generate random username and access code
    const username = `peserta${String(id).padStart(3, '0')}`;
    const accessCode = `BBPBAT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    alert(`Pendaftaran disetujui!\nUsername: ${username}\nKode Akses: ${accessCode}\n\nPesan akan dikirim ke WhatsApp pendaftar.`);
  };

  const handleReject = (id: number, type: 'student' | 'general') => {
    alert('Pendaftaran ditolak. Pesan penolakan akan dikirim ke WhatsApp pendaftar.');
  };

  const updateQuota = (placement: string, type: 'student' | 'general', action: 'increase' | 'decrease') => {
    setQuotas(prev => ({
      ...prev,
      [placement]: {
        ...prev[placement],
        [type]: action === 'increase' 
          ? prev[placement][type] + 1 
          : Math.max(0, prev[placement][type] - 1)
      }
    }));
  };

  const getQuotaStatus = (placement: string, type: 'student' | 'general') => {
    const quota = quotas[placement];
    if (!quota) return { status: 'available', remaining: 0 };
    
    const remaining = quota[type] - quota.used[type];
    if (remaining <= 0) return { status: 'full', remaining: 0 };
    if (remaining <= 2) return { status: 'limited', remaining };
    return { status: 'available', remaining };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'full': return 'text-red-600 bg-red-100';
      case 'limited': return 'text-orange-600 bg-orange-100';
      case 'available': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderNewRegistrations = () => {
    const registrations = activeSubTab === 'student' ? studentRegistrations : generalRegistrations;
    
    return (
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
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
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Pendaftaran {activeSubTab === 'student' ? 'Pelajar' : 'Masyarakat/Dinas'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendaftar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instansi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penempatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map((registration) => (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{registration.nama}</div>
                        <div className="text-sm text-gray-500">{registration.nomerWA}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.instansi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.pilihanPenempatan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{registration.tanggalDaftar}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRegistration(registration)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(registration.id, activeSubTab as 'student' | 'general')}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Setujui"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(registration.id, activeSubTab as 'student' | 'general')}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Tolak"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 p-1" title="Unduh Berkas">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderQuotaManagement = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Manajemen Kuota {activeSubTab === 'student' ? 'Pelajar' : 'Masyarakat/Dinas'}
            </h3>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {placementOptions.map((placement) => {
                const quotaStatus = getQuotaStatus(placement, activeSubTab as 'student' | 'general');
                const quota = quotas[placement];
                
                return (
                  <div key={placement} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{placement}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-600">
                          Terpakai: {quota?.used[activeSubTab as 'student' | 'general'] || 0} / {quota?.[activeSubTab as 'student' | 'general'] || 0}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(quotaStatus.status)}`}>
                          {quotaStatus.status === 'full' ? 'Kuota Penuh' : 
                           quotaStatus.status === 'limited' ? `Sisa ${quotaStatus.remaining}` : 
                           `Tersedia ${quotaStatus.remaining}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuota(placement, activeSubTab as 'student' | 'general', 'decrease')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        disabled={!quota || quota[activeSubTab as 'student' | 'general'] <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {quota?.[activeSubTab as 'student' | 'general'] || 0}
                      </span>
                      <button
                        onClick={() => updateQuota(placement, activeSubTab as 'student' | 'general', 'increase')}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pendaftaran</h1>
        <p className="text-gray-600">Kelola pendaftaran dan kuota peserta bimbingan teknis</p>
      </div>

      {/* Main Tabs */}
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

        {/* Sub Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-8 px-6">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? 'border-gray-800 text-gray-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'new-registrations' ? renderNewRegistrations() : renderQuotaManagement()}
        </div>
      </div>

      {/* Registration Detail Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Detail Pendaftaran</h3>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.nama}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Instansi</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.instansi}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.nomerWA}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pilihan Penempatan</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedRegistration.pilihanPenempatan}</p>
                </div>
                {selectedRegistration.pembimbing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nama Pembimbing</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.pembimbing}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">WhatsApp Pembimbing</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRegistration.nomerWAPembimbing}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    handleApprove(selectedRegistration.id, activeSubTab as 'student' | 'general');
                    setSelectedRegistration(null);
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Setujui Pendaftaran
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedRegistration.id, activeSubTab as 'student' | 'general');
                    setSelectedRegistration(null);
                  }}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                  Tolak Pendaftaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationManagement;