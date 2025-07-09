import React, { useState, useEffect } from 'react';
import { User, Building, Calendar, Heart, Save, Edit, AlertCircle, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

interface GeneralProfileProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    paymentComplete: boolean;
  };
  profileData: any;
  updateUserData: (data: any) => void;
  updateProfileData: (data: any) => void;
}

const GeneralProfile: React.FC<GeneralProfileProps> = ({ userData, profileData, updateUserData, updateProfileData }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const tabs = [
    { id: 'personal', label: 'Informasi Pribadi', icon: <User className="w-4 h-4" /> },
    { id: 'institution', label: 'Informasi Institusi', icon: <Building className="w-4 h-4" /> },
    { id: 'bimtek', label: 'Rencana Bimtek', icon: <Calendar className="w-4 h-4" /> },
    { id: 'health', label: 'Informasi Kesehatan', icon: <Heart className="w-4 h-4" /> }
  ];

  const placementOptions = [
    'BIOFLOK NILA',
    'PEMBENIHAN KOMET',
    'PEMBENIHAN GURAME',
    'PEMBENIHAN NILA SULTANA',
    'PEMBENIHAN BAUNG',
    'PEMBENIHAN LELE SANGKURIANG',
    'PEMBENIHAN PATIN',
    'PEMBENIHAN MAS MANTAP',
    'PEMBENIHAN NILEM',
    'Ikan Wader',
    'PEMBENIHAN KOI',
    'PEMBENIHAN MANFISH',
    'IKAN KOKI',
    'PAKAN MANDIRI (BUATAN)',
    'CACING SUTERA',
    'MOINA',
    'UDANG GALAH (PELABUHAN RATU)',
    'LAB KESEHATAN IKAN',
    'LAB NUTRISI DAN RESIDU',
    'LAB KUALITAS AIR',
    'Pelayanan Publik',
    'Perpustakaan',
    'Uji Terap Teknik dan Kerjasama',
    'Arsip',
    'Kepegawaian',
    'Koperasi',
    'KODOK LEMBU'
  ];

  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync dengan global state saat component mount
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Personal Info validation
    if (!formData.namaLengkap?.trim()) {
      newErrors.namaLengkap = 'Nama lengkap wajib diisi';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.alamat?.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }
    if (!formData.noTelepon?.trim()) {
      newErrors.noTelepon = 'Nomor telepon wajib diisi';
    }
    if (!formData.tempatLahir?.trim()) {
      newErrors.tempatLahir = 'Tempat lahir wajib diisi';
    }
    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = 'Tanggal lahir wajib diisi';
    }
    if (!formData.golonganDarah) {
      newErrors.golonganDarah = 'Golongan darah wajib dipilih';
    }

    // Institution Info validation
    if (!formData.namaInstitusi?.trim()) {
      newErrors.namaInstitusi = 'Nama institusi wajib diisi';
    }
    if (!formData.alamatInstitusi?.trim()) {
      newErrors.alamatInstitusi = 'Alamat institusi wajib diisi';
    }
    if (!formData.emailInstitusi?.trim()) {
      newErrors.emailInstitusi = 'Email institusi wajib diisi';
    }

    // Bimtek Plan validation
    if (!formData.rencanaMultai) {
      newErrors.rencanaMultai = 'Rencana mulai bimtek wajib diisi';
    }
    if (!formData.rencanaAkhir) {
      newErrors.rencanaAkhir = 'Rencana akhir bimtek wajib diisi';
    }
    if (!formData.penempatanPKL) {
      newErrors.penempatanPKL = 'Penempatan bimtek wajib dipilih';
    }

    // Health Info validation
    if (!formData.riwayatPenyakit?.trim()) {
      newErrors.riwayatPenyakit = 'Riwayat penyakit wajib diisi';
    }
    if (!formData.penangananKhusus?.trim()) {
      newErrors.penangananKhusus = 'Penanganan khusus wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkProfileCompletion = (data: any) => {
    const requiredFields = [
      'namaLengkap', 'email', 'alamat', 'noTelepon', 'tempatLahir', 'tanggalLahir', 'golonganDarah',
      'namaInstitusi', 'alamatInstitusi', 'emailInstitusi', 'rencanaMultai', 'rencanaAkhir',
      'penempatanPKL', 'riwayatPenyakit', 'penangananKhusus'
    ];

    return requiredFields.every(field => data[field] && data[field].toString().trim() !== '');
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setSaveMessage('');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    // Simulate API call
    setTimeout(() => {
      // Update global state only when saving
      updateProfileData(formData);
      
      setIsSaving(false);
      setIsEditing(false);
      setSaveMessage('Profil berhasil disimpan!');
      
      // Update profile completion status
      const isComplete = checkProfileCompletion(formData);
      updateUserData({ profileComplete: isComplete });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 1500);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage('');
    setErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage('');
    setErrors({});
    // Reset form data to original global state
    setFormData(profileData);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            name="namaLengkap"
            value={formData.namaLengkap || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.namaLengkap ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.namaLengkap && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.namaLengkap}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
            placeholder="john.doe@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat *
        </label>
        <textarea
          name="alamat"
          value={formData.alamat || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.alamat ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
          placeholder="Masukkan alamat lengkap"
        />
        {errors.alamat && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.alamat}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No Telepon/HP/WA *
          </label>
          <input
            type="tel"
            name="noTelepon"
            value={formData.noTelepon || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.noTelepon ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
            placeholder="+62 812 3456 7890"
          />
          {errors.noTelepon && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.noTelepon}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempat Lahir *
          </label>
          <input
            type="text"
            name="tempatLahir"
            value={formData.tempatLahir || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.tempatLahir ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
            placeholder="Kota tempat lahir"
          />
          {errors.tempatLahir && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.tempatLahir}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Lahir *
          </label>
          <input
            type="date"
            name="tanggalLahir"
            value={formData.tanggalLahir || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.tanggalLahir ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          />
          {errors.tanggalLahir && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.tanggalLahir}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Golongan Darah *
          </label>
          <select
            name="golonganDarah"
            value={formData.golonganDarah || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.golonganDarah ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          >
            <option value="">Pilih golongan darah</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="AB">AB</option>
            <option value="O">O</option>
          </select>
          {errors.golonganDarah && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.golonganDarah}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderInstitutionInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Institusi/Perusahaan/Dinas *
        </label>
        <input
          type="text"
          name="namaInstitusi"
          value={formData.namaInstitusi || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.namaInstitusi ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
          placeholder="Nama institusi"
        />
        {errors.namaInstitusi && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.namaInstitusi}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Institusi *
        </label>
        <textarea
          name="alamatInstitusi"
          value={formData.alamatInstitusi || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.alamatInstitusi ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
          placeholder="Alamat lengkap institusi"
        />
        {errors.alamatInstitusi && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.alamatInstitusi}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Institusi *
        </label>
        <input
          type="email"
          name="emailInstitusi"
          value={formData.emailInstitusi || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.emailInstitusi ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
          placeholder="email@institusi.com"
        />
        {errors.emailInstitusi && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.emailInstitusi}
          </p>
        )}
      </div>
    </div>
  );

  const renderBimtekPlan = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rencana Mulai Bimtek *
          </label>
          <input
            type="date"
            name="rencanaMultai"
            value={formData.rencanaMultai || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.rencanaMultai ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          />
          {errors.rencanaMultai && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.rencanaMultai}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rencana Akhir Bimtek *
          </label>
          <input
            type="date"
            name="rencanaAkhir"
            value={formData.rencanaAkhir || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.rencanaAkhir ? 'border-red-300' : 'border-gray-300'
            } ${!isEditing ? 'bg-gray-50' : ''}`}
          />
          {errors.rencanaAkhir && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.rencanaAkhir}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Penempatan Bimtek *
        </label>
        <select
          name="penempatanPKL"
          value={formData.penempatanPKL || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.penempatanPKL ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
        >
          <option value="">Pilih unit penempatan</option>
          {placementOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.penempatanPKL && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.penempatanPKL}
          </p>
        )}
      </div>
    </div>
  );

  const renderHealthInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Kartu BPJS Kesehatan (Opsional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            id="bpjs-upload"
            disabled={!isEditing}
          />
          <label
            htmlFor="bpjs-upload"
            className={`cursor-pointer ${!isEditing ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <div className="text-gray-400 mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Klik untuk mengunggah atau drag & drop
            </p>
            <p className="text-xs text-gray-500">
              Format: PDF, JPG, PNG (Maksimal 5MB)
            </p>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Riwayat Penyakit (2 tahun terakhir) *
        </label>
        <textarea
          name="riwayatPenyakit"
          value={formData.riwayatPenyakit || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.riwayatPenyakit ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
          placeholder="Tuliskan riwayat penyakit dalam 2 tahun terakhir. Jika tidak ada, tulis 'Tidak ada'"
        />
        {errors.riwayatPenyakit && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.riwayatPenyakit}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Penanganan Khusus yang Diperlukan *
        </label>
        <textarea
          name="penangananKhusus"
          value={formData.penangananKhusus || ''}
          onChange={handleInputChange}
          disabled={!isEditing}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.penangananKhusus ? 'border-red-300' : 'border-gray-300'
          } ${!isEditing ? 'bg-gray-50' : ''}`}
          placeholder="Tuliskan jika ada penanganan khusus yang diperlukan. Jika tidak ada, tulis 'Tidak ada'"
        />
        {errors.penangananKhusus && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.penangananKhusus}
          </p>
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'institution':
        return renderInstitutionInfo();
      case 'bimtek':
        return renderBimtekPlan();
      case 'health':
        return renderHealthInfo();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profil Peserta</h1>
          <p className="text-gray-600">Kelola informasi pribadi dan data peserta</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && (
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
          )}
          <button
            onClick={isEditing ? handleSave : handleEdit}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Menyimpan...
              </>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Simpan
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Edit Profil
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-700 font-medium">{saveMessage}</p>
          </div>
        </div>
      )}

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
                    ? 'border-blue-500 text-blue-600'
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
          {renderTabContent()}
        </div>
      </div>

      {/* Save Button for Mobile */}
      {isEditing && (
        <div className="lg:hidden">
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralProfile;