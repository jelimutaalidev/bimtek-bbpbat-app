import React, { useState, useEffect } from 'react';
import { User, Building, Calendar, Heart, Save, Edit, AlertCircle, CheckCircle } from 'lucide-react';

interface ProfileProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    documentsComplete: boolean;
  };
  profileData: any;
  updateUserData: (data: any) => void;
  updateProfileData: (data: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ userData, profileData, updateUserData, updateProfileData }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const tabs = [
    { id: 'personal', label: 'Informasi Pribadi', icon: <User className="w-4 h-4" /> },
    { id: 'institution', label: 'Informasi Institusi', icon: <Building className="w-4 h-4" /> },
    { id: 'internship', label: 'Rencana PKL', icon: <Calendar className="w-4 h-4" /> },
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
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Update global state secara real-time
    updateProfileData(newFormData);
    
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
    if (!formData.namaOrangTua?.trim()) {
      newErrors.namaOrangTua = 'Nama orang tua/wali wajib diisi';
    }
    if (!formData.noTeleponOrangTua?.trim()) {
      newErrors.noTeleponOrangTua = 'Nomor telepon orang tua/wali wajib diisi';
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
    if (!formData.nomorInduk?.trim()) {
      newErrors.nomorInduk = 'Nomor induk wajib diisi';
    }
    if (!formData.alamatInstitusi?.trim()) {
      newErrors.alamatInstitusi = 'Alamat institusi wajib diisi';
    }
    if (!formData.emailInstitusi?.trim()) {
      newErrors.emailInstitusi = 'Email institusi wajib diisi';
    }
    if (!formData.noTeleponInstitusi?.trim()) {
      newErrors.noTeleponInstitusi = 'Nomor telepon institusi wajib diisi';
    }
    if (!formData.namaPembimbing?.trim()) {
      newErrors.namaPembimbing = 'Nama pembimbing wajib diisi';
    }
    if (!formData.noTeleponPembimbing?.trim()) {
      newErrors.noTeleponPembimbing = 'Nomor telepon pembimbing wajib diisi';
    }
    if (!formData.emailPembimbing?.trim()) {
      newErrors.emailPembimbing = 'Email pembimbing wajib diisi';
    }

    // Internship Plan validation
    if (!formData.rencanaMultai) {
      newErrors.rencanaMultai = 'Rencana mulai PKL wajib diisi';
    }
    if (!formData.rencanaAkhir) {
      newErrors.rencanaAkhir = 'Rencana akhir PKL wajib diisi';
    }
    if (!formData.penempatanPKL) {
      newErrors.penempatanPKL = 'Penempatan PKL wajib dipilih';
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
      'namaLengkap', 'email', 'alamat', 'noTelepon', 'namaOrangTua', 'noTeleponOrangTua',
      'tempatLahir', 'tanggalLahir', 'golonganDarah', 'namaInstitusi', 'nomorInduk',
      'alamatInstitusi', 'emailInstitusi', 'noTeleponInstitusi', 'namaPembimbing',
      'noTeleponPembimbing', 'emailPembimbing', 'rencanaMultai', 'rencanaAkhir',
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
    // Reset form data to global state
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.namaLengkap ? 'border-red-300' : 'border-gray-300'
            }`}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
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
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.alamat ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Masukkan alamat lengkap"
        />
        {errors.alamat && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.alamat}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No Telepon/HP/WA *
          </label>
          <input
            type="tel"
            name="noTelepon"
            value={formData.noTelepon || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.noTelepon ? 'border-red-300' : 'border-gray-300'
            }`}
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
            Nama Orang Tua/Wali *
          </label>
          <input
            type="text"
            name="namaOrangTua"
            value={formData.namaOrangTua || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.namaOrangTua ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Nama orang tua/wali"
          />
          {errors.namaOrangTua && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.namaOrangTua}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No Telepon Orang Tua/Wali *
          </label>
          <input
            type="tel"
            name="noTeleponOrangTua"
            value={formData.noTeleponOrangTua || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.noTeleponOrangTua ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+62 812 3456 7890"
          />
          {errors.noTeleponOrangTua && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.noTeleponOrangTua}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.tempatLahir ? 'border-red-300' : 'border-gray-300'
            }`}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.tanggalLahir ? 'border-red-300' : 'border-gray-300'
            }`}
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.golonganDarah ? 'border-red-300' : 'border-gray-300'
            }`}
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
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Institusi/Sekolah/Perguruan Tinggi *
          </label>
          <input
            type="text"
            name="namaInstitusi"
            value={formData.namaInstitusi || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.namaInstitusi ? 'border-red-300' : 'border-gray-300'
            }`}
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
            Nomor Induk Siswa/Mahasiswa *
          </label>
          <input
            type="text"
            name="nomorInduk"
            value={formData.nomorInduk || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.nomorInduk ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="NIS/NIM"
          />
          {errors.nomorInduk && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.nomorInduk}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat Institusi *
        </label>
        <textarea
          name="alamatInstitusi"
          value={formData.alamatInstitusi || ''}
          onChange={handleInputChange}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.alamatInstitusi ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Alamat lengkap institusi"
        />
        {errors.alamatInstitusi && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.alamatInstitusi}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Institusi *
          </label>
          <input
            type="email"
            name="emailInstitusi"
            value={formData.emailInstitusi || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.emailInstitusi ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="email@institusi.ac.id"
          />
          {errors.emailInstitusi && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.emailInstitusi}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No Telepon Institusi *
          </label>
          <input
            type="tel"
            name="noTeleponInstitusi"
            value={formData.noTeleponInstitusi || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.noTeleponInstitusi ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+62 21 1234 5678"
          />
          {errors.noTeleponInstitusi && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.noTeleponInstitusi}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Guru/Dosen Pembimbing *
          </label>
          <input
            type="text"
            name="namaPembimbing"
            value={formData.namaPembimbing || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.namaPembimbing ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Nama pembimbing"
          />
          {errors.namaPembimbing && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.namaPembimbing}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            No Telepon/HP/WA Pembimbing *
          </label>
          <input
            type="tel"
            name="noTeleponPembimbing"
            value={formData.noTeleponPembimbing || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.noTeleponPembimbing ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+62 812 3456 7890"
          />
          {errors.noTeleponPembimbing && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.noTeleponPembimbing}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Pembimbing *
          </label>
          <input
            type="email"
            name="emailPembimbing"
            value={formData.emailPembimbing || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.emailPembimbing ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="pembimbing@email.com"
          />
          {errors.emailPembimbing && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.emailPembimbing}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderInternshipPlan = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rencana Mulai PKL *
          </label>
          <input
            type="date"
            name="rencanaMultai"
            value={formData.rencanaMultai || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.rencanaMultai ? 'border-red-300' : 'border-gray-300'
            }`}
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
            Rencana Akhir PKL *
          </label>
          <input
            type="date"
            name="rencanaAkhir"
            value={formData.rencanaAkhir || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.rencanaAkhir ? 'border-red-300' : 'border-gray-300'
            }`}
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
          Penempatan PKL *
        </label>
        <select
          name="penempatanPKL"
          value={formData.penempatanPKL || ''}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.penempatanPKL ? 'border-red-300' : 'border-gray-300'
          }`}
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
          />
          <label
            htmlFor="bpjs-upload"
            className="cursor-pointer"
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
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.riwayatPenyakit ? 'border-red-300' : 'border-gray-300'
          }`}
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
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.penangananKhusus ? 'border-red-300' : 'border-gray-300'
          }`}
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
      case 'internship':
        return renderInternshipPlan();
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

export default Profile;