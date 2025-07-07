import React, { useState } from 'react';
import { Users, Building, FileText, Eye, Check, X, Download, Search, Filter, MessageSquare } from 'lucide-react';

const ReportManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tabs = [
    { id: 'student', label: 'Pelajar', icon: <Users className="w-4 h-4" /> },
    { id: 'general', label: 'Masyarakat/Dinas', icon: <Building className="w-4 h-4" /> }
  ];

  const reportsData = {
    student: [
      {
        id: 1,
        nama: 'John Doe',
        instansi: 'Universitas Padjadjaran',
        penempatan: 'BIOFLOK NILA',
        judulLaporan: 'Laporan Praktik Kerja Lapangan - Budidaya Ikan Nila Sistem Bioflok',
        tanggalSubmit: '2025-01-15',
        status: 'baru',
        filename: 'Laporan_PKL_JohnDoe.pdf',
        deskripsi: 'Laporan lengkap mengenai praktik budidaya ikan nila menggunakan sistem bioflok selama 2 bulan'
      },
      {
        id: 2,
        nama: 'Sarah Wilson',
        instansi: 'Institut Teknologi Bandung',
        penempatan: 'LAB KESEHATAN IKAN',
        judulLaporan: 'Analisis Kesehatan Ikan dan Penanganan Penyakit pada Budidaya Intensif',
        tanggalSubmit: '2025-01-12',
        status: 'direview',
        filename: 'Laporan_PKL_SarahWilson.pdf',
        deskripsi: 'Studi komprehensif tentang identifikasi dan penanganan penyakit ikan dalam sistem budidaya intensif'
      },
      {
        id: 3,
        nama: 'Michael Chen',
        instansi: 'Universitas Gadjah Mada',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        judulLaporan: 'Formulasi dan Evaluasi Pakan Ikan Mandiri untuk Budidaya Berkelanjutan',
        tanggalSubmit: '2025-01-08',
        status: 'diterima',
        filename: 'Laporan_PKL_MichaelChen.pdf',
        deskripsi: 'Penelitian tentang formulasi pakan ikan mandiri dengan bahan lokal untuk efisiensi biaya produksi'
      }
    ],
    general: [
      {
        id: 1,
        nama: 'Ahmad Rahman',
        instansi: 'Dinas Perikanan Jawa Barat',
        penempatan: 'PAKAN MANDIRI (BUATAN)',
        judulLaporan: 'Implementasi Teknologi Pakan Mandiri di Kelompok Pembudidaya Ikan',
        tanggalSubmit: '2025-01-10',
        status: 'baru',
        filename: 'Laporan_Bimtek_AhmadRahman.pdf',
        deskripsi: 'Laporan implementasi teknologi pakan mandiri untuk meningkatkan produktivitas pembudidaya ikan'
      },
      {
        id: 2,
        nama: 'Siti Nurhaliza',
        instansi: 'PT Aqua Nusantara',
        penempatan: 'LAB KUALITAS AIR',
        judulLaporan: 'Monitoring dan Pengelolaan Kualitas Air untuk Budidaya Ikan Komersial',
        tanggalSubmit: '2025-01-05',
        status: 'diterima',
        filename: 'Laporan_Bimtek_SitiNurhaliza.pdf',
        deskripsi: 'Sistem monitoring kualitas air real-time untuk optimalisasi produksi budidaya ikan komersial'
      }
    ]
  };

  const currentData = reportsData[activeTab as keyof typeof reportsData];

  const filteredData = currentData.filter(item => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.instansi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.judulLaporan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'baru':
        return 'bg-blue-100 text-blue-800';
      case 'direview':
        return 'bg-yellow-100 text-yellow-800';
      case 'diterima':
        return 'bg-green-100 text-green-800';
      case 'ditolak':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'baru':
        return 'Baru';
      case 'direview':
        return 'Direview';
      case 'diterima':
        return 'Diterima';
      case 'ditolak':
        return 'Ditolak';
      default:
        return status;
    }
  };

  const handleApprove = (reportId: number) => {
    alert('Laporan telah disetujui. Notifikasi akan dikirim ke peserta.');
  };

  const handleReject = (reportId: number) => {
    const feedback = prompt('Masukkan feedback untuk perbaikan laporan:');
    if (feedback) {
      alert('Laporan ditolak dengan feedback. Notifikasi akan dikirim ke peserta.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Laporan</h1>
        <p className="text-gray-600">Kelola dan review laporan PKL peserta bimbingan teknis</p>
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
                placeholder="Cari berdasarkan nama, instansi, atau judul laporan..."
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
              <option value="baru">Baru</option>
              <option value="direview">Direview</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>

          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peserta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Judul Laporan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penempatan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal Submit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.nama}</div>
                          <div className="text-sm text-gray-500">{report.instansi}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate" title={report.judulLaporan}>
                          {report.judulLaporan}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{report.penempatan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(report.tanggalSubmit)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusLabel(report.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {report.status === 'baru' || report.status === 'direview' ? (
                            <>
                              <button
                                onClick={() => handleApprove(report.id)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Setujui"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(report.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Tolak"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : null}
                          <button className="text-gray-600 hover:text-gray-900 p-1" title="Unduh Laporan">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900 p-1" title="Beri Feedback">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada laporan ditemukan</h3>
              <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          )}

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.filter(r => r.status === 'baru').length}
              </div>
              <div className="text-sm text-blue-800">Laporan Baru</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {currentData.filter(r => r.status === 'direview').length}
              </div>
              <div className="text-sm text-yellow-800">Sedang Direview</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentData.filter(r => r.status === 'diterima').length}
              </div>
              <div className="text-sm text-green-800">Diterima</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {currentData.filter(r => r.status === 'ditolak').length}
              </div>
              <div className="text-sm text-red-800">Ditolak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Detail Laporan</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Report Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Informasi Peserta</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Nama:</span> {selectedReport.nama}</div>
                    <div><span className="font-medium">Instansi:</span> {selectedReport.instansi}</div>
                    <div><span className="font-medium">Penempatan:</span> {selectedReport.penempatan}</div>
                    <div><span className="font-medium">Tanggal Submit:</span> {formatDate(selectedReport.tanggalSubmit)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Informasi Laporan</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Status:</span> 
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedReport.status)}`}>
                        {getStatusLabel(selectedReport.status)}
                      </span>
                    </div>
                    <div><span className="font-medium">File:</span> {selectedReport.filename}</div>
                  </div>
                </div>
              </div>

              {/* Report Title and Description */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Judul Laporan</h4>
                <p className="text-gray-900 mb-4">{selectedReport.judulLaporan}</p>
                
                <h4 className="font-medium text-gray-800 mb-2">Deskripsi</h4>
                <p className="text-gray-700">{selectedReport.deskripsi}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t">
                <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  Unduh Laporan
                </button>
                {selectedReport.status === 'baru' || selectedReport.status === 'direview' ? (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedReport.id);
                        setSelectedReport(null);
                      }}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      <Check className="w-4 h-4" />
                      Setujui Laporan
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedReport.id);
                        setSelectedReport(null);
                      }}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                      Tolak Laporan
                    </button>
                  </>
                ) : null}
                <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  <MessageSquare className="w-4 h-4" />
                  Beri Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;