import React, { useState } from 'react';
import { Megaphone, Plus, Edit, Trash2, Eye, Calendar, Users, AlertCircle } from 'lucide-react';

const AnnouncementManagement: React.FC = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      judul: 'Perubahan Jadwal Praktikum Lab Kesehatan Ikan',
      konten: 'Diinformasikan kepada seluruh peserta PKL yang ditempatkan di Lab Kesehatan Ikan bahwa jadwal praktikum minggu depan mengalami perubahan. Praktikum yang semula dijadwalkan hari Senin pukul 08:00 dipindahkan ke hari Selasa pukul 09:00.',
      kategori: 'Jadwal',
      target: 'Semua Peserta',
      tanggalBuat: '2025-01-15',
      tanggalPublish: '2025-01-15',
      status: 'published',
      prioritas: 'tinggi',
      penulis: 'Admin BBPBAT'
    },
    {
      id: 2,
      judul: 'Pengumuman Libur Nasional',
      konten: 'Dalam rangka memperingati Hari Kemerdekaan RI, kegiatan PKL akan diliburkan pada tanggal 17 Agustus 2025. Kegiatan akan dilanjutkan kembali pada tanggal 18 Agustus 2025.',
      kategori: 'Umum',
      target: 'Semua Peserta',
      tanggalBuat: '2025-01-10',
      tanggalPublish: '2025-01-10',
      status: 'published',
      prioritas: 'sedang',
      penulis: 'Admin BBPBAT'
    },
    {
      id: 3,
      judul: 'Workshop Teknologi Bioflok - Draft',
      konten: 'Akan diadakan workshop khusus mengenai teknologi bioflok untuk peserta yang ditempatkan di unit Bioflok Nila. Workshop akan membahas teknik-teknik terbaru dalam pengelolaan sistem bioflok.',
      kategori: 'Workshop',
      target: 'Peserta Bioflok',
      tanggalBuat: '2025-01-12',
      tanggalPublish: null,
      status: 'draft',
      prioritas: 'sedang',
      penulis: 'Admin BBPBAT'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [formData, setFormData] = useState({
    judul: '',
    konten: '',
    kategori: '',
    target: '',
    prioritas: 'sedang',
    status: 'draft'
  });

  const categories = ['Umum', 'Jadwal', 'Workshop', 'Evaluasi', 'Sertifikat', 'Teknis'];
  const targets = ['Semua Peserta', 'Peserta Pelajar', 'Peserta Umum/Dinas', 'Peserta Bioflok', 'Peserta Lab'];
  const priorities = ['rendah', 'sedang', 'tinggi'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAnnouncement = {
      id: editingAnnouncement ? editingAnnouncement.id : Date.now(),
      ...formData,
      tanggalBuat: editingAnnouncement ? editingAnnouncement.tanggalBuat : new Date().toISOString().split('T')[0],
      tanggalPublish: formData.status === 'published' ? new Date().toISOString().split('T')[0] : null,
      penulis: 'Admin BBPBAT'
    };

    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(ann => ann.id === editingAnnouncement.id ? newAnnouncement : ann));
    } else {
      setAnnouncements(prev => [...prev, newAnnouncement]);
    }

    setShowForm(false);
    setEditingAnnouncement(null);
    setFormData({
      judul: '',
      konten: '',
      kategori: '',
      target: '',
      prioritas: 'sedang',
      status: 'draft'
    });
  };

  const handleEdit = (announcement: any) => {
    setEditingAnnouncement(announcement);
    setFormData({
      judul: announcement.judul,
      konten: announcement.konten,
      kategori: announcement.kategori,
      target: announcement.target,
      prioritas: announcement.prioritas,
      status: announcement.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    }
  };

  const handlePublish = (id: number) => {
    setAnnouncements(prev => prev.map(ann => 
      ann.id === id 
        ? { ...ann, status: 'published', tanggalPublish: new Date().toISOString().split('T')[0] }
        : ann
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'tinggi':
        return 'bg-red-100 text-red-800';
      case 'sedang':
        return 'bg-orange-100 text-orange-800';
      case 'rendah':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengumuman</h1>
          <p className="text-gray-600">Kelola pengumuman dan informasi untuk peserta</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Buat Pengumuman
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 rounded-lg p-2">
              <Megaphone className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">+2</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">{announcements.length}</h3>
          <p className="text-gray-600 text-sm">Total Pengumuman</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 rounded-lg p-2">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">+1</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {announcements.filter(a => a.status === 'published').length}
          </h3>
          <p className="text-gray-600 text-sm">Dipublikasikan</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-100 rounded-lg p-2">
              <Edit className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-yellow-600">+1</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {announcements.filter(a => a.status === 'draft').length}
          </h3>
          <p className="text-gray-600 text-sm">Draft</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-100 rounded-lg p-2">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">+1</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {announcements.filter(a => a.prioritas === 'tinggi').length}
          </h3>
          <p className="text-gray-600 text-sm">Prioritas Tinggi</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Daftar Pengumuman</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-800">{announcement.judul}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(announcement.status)}`}>
                      {announcement.status === 'published' ? 'Dipublikasikan' : 'Draft'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(announcement.prioritas)}`}>
                      {announcement.prioritas.charAt(0).toUpperCase() + announcement.prioritas.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{announcement.konten}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Dibuat: {formatDate(announcement.tanggalBuat)}</span>
                    </div>
                    {announcement.tanggalPublish && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>Dipublikasi: {formatDate(announcement.tanggalPublish)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{announcement.target}</span>
                    </div>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {announcement.kategori}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {announcement.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(announcement.id)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Publikasikan"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingAnnouncement(null);
                  setFormData({
                    judul: '',
                    konten: '',
                    kategori: '',
                    target: '',
                    prioritas: 'sedang',
                    status: 'draft'
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  value={formData.judul}
                  onChange={(e) => setFormData(prev => ({ ...prev, judul: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan judul pengumuman"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Pengumuman *
                </label>
                <textarea
                  value={formData.konten}
                  onChange={(e) => setFormData(prev => ({ ...prev, konten: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan isi pengumuman"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData(prev => ({ ...prev, kategori: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Peserta *
                  </label>
                  <select
                    value={formData.target}
                    onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Pilih target</option>
                    {targets.map((target) => (
                      <option key={target} value={target}>
                        {target}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioritas
                  </label>
                  <select
                    value={formData.prioritas}
                    onChange={(e) => setFormData(prev => ({ ...prev, prioritas: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Publikasikan Sekarang</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200"
                >
                  {editingAnnouncement ? 'Update Pengumuman' : 'Buat Pengumuman'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAnnouncement(null);
                    setFormData({
                      judul: '',
                      konten: '',
                      kategori: '',
                      target: '',
                      prioritas: 'sedang',
                      status: 'draft'
                    });
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagement;