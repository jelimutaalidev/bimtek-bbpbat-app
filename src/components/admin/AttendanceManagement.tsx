import React, { useState } from 'react';
import { Users, Building, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Download, Search } from 'lucide-react';

const AttendanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'student', label: 'Pelajar', icon: <Users className="w-4 h-4" /> },
    { id: 'general', label: 'Masyarakat/Dinas', icon: <Building className="w-4 h-4" /> }
  ];

  const attendanceData = {
    student: [
      {
        id: 1,
        nama: 'John Doe',
        instansi: 'Universitas Padjadjaran',
        penempatan: 'BIOFLOK NILA',
        checkIn: '08:00',
        checkOut: '16:00',
        status: 'hadir',
        keterangan: ''
      },
      {
        id: 2,
        nama: 'Sarah Wilson',
        instansi: 'Institut Teknologi Bandung',
        penempatan: 'LAB KESEHATAN IKAN',
        checkIn: '08:15',
        checkOut: '16:05',
        status: 'hadir',
        keterangan: 'Terlambat 15 menit'
      },
      {
        id: 3,
        nama: 'Michael Chen',
        instansi: 'Universitas Gadjah Mada',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        checkIn: null,
        checkOut: null,
        status: 'sakit',
        keterangan: 'Sakit demam'
      },
      {
        id: 4,
        nama: 'Lisa Anderson',
        instansi: 'Universitas Brawijaya',
        penempatan: 'LAB KUALITAS AIR',
        checkIn: null,
        checkOut: null,
        status: 'izin',
        keterangan: 'Keperluan keluarga'
      }
    ],
    general: [
      {
        id: 1,
        nama: 'Ahmad Rahman',
        instansi: 'Dinas Perikanan Jawa Barat',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        checkIn: '08:00',
        checkOut: '16:00',
        status: 'hadir',
        keterangan: ''
      },
      {
        id: 2,
        nama: 'Siti Nurhaliza',
        instansi: 'PT Aqua Nusantara',
        penempatan: 'LAB KUALITAS AIR',
        checkIn: '07:55',
        checkOut: '16:10',
        status: 'hadir',
        keterangan: ''
      }
    ]
  };

  const attendanceStats = {
    student: {
      total: 25,
      hadir: 20,
      izin: 2,
      sakit: 1,
      alpha: 2
    },
    general: {
      total: 15,
      hadir: 13,
      izin: 1,
      sakit: 0,
      alpha: 1
    }
  };

  const currentData = attendanceData[activeTab as keyof typeof attendanceData];
  const currentStats = attendanceStats[activeTab as keyof typeof attendanceStats];

  const filteredData = currentData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.penempatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'izin':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'sakit':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'alpha':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'bg-green-100 text-green-800';
      case 'izin':
        return 'bg-yellow-100 text-yellow-800';
      case 'sakit':
        return 'bg-red-100 text-red-800';
      case 'alpha':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Absensi</h1>
        <p className="text-gray-600">Kelola dan pantau kehadiran peserta bimbingan teknis</p>
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
          {/* Date Selection and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-600">
                {formatDate(selectedDate)}
              </span>
            </div>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
              <Download className="w-4 h-4" />
              Export Absensi
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{currentStats.total}</div>
              <div className="text-sm text-blue-800">Total Peserta</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{currentStats.hadir}</div>
              <div className="text-sm text-green-800">Hadir</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{currentStats.izin}</div>
              <div className="text-sm text-yellow-800">Izin</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{currentStats.sakit}</div>
              <div className="text-sm text-red-800">Sakit</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{currentStats.alpha}</div>
              <div className="text-sm text-gray-800">Alpha</div>
            </div>
          </div>

          {/* Attendance Table */}
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
                      Penempatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam Masuk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam Keluar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.nama}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.instansi}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.penempatan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.checkIn || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.checkOut || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.keterangan || '-'}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data absensi</h3>
              <p className="text-gray-500">Belum ada data absensi untuk tanggal yang dipilih</p>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Ringkasan Absensi</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><span className="font-medium">Tanggal:</span> {formatDate(selectedDate)}</p>
                <p><span className="font-medium">Total Peserta:</span> {currentStats.total} orang</p>
                <p><span className="font-medium">Tingkat Kehadiran:</span> {Math.round((currentStats.hadir / currentStats.total) * 100)}%</p>
              </div>
              <div>
                <p><span className="font-medium">Hadir:</span> {currentStats.hadir} orang</p>
                <p><span className="font-medium">Tidak Hadir:</span> {currentStats.izin + currentStats.sakit + currentStats.alpha} orang</p>
                <p><span className="font-medium">Perlu Tindak Lanjut:</span> {currentStats.alpha} orang (Alpha)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;