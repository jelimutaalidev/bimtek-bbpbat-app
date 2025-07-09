import React, { useState } from 'react';
import { User, Edit3, Save, X, Calendar, MapPin, Phone, Mail, School, Heart, FileText } from 'lucide-react';

interface ProfileData {
  namaLengkap: string;
  email: string;
  alamat: string;
  noTelepon: string;
  namaOrangTua: string;
  noTeleponOrangTua: string;
  tempatLahir: string;
  tanggalLahir: string;
  golonganDarah: string;
  namaInstitusi: string;
  nomorInduk: string;
  alamatInstitusi: string;
  emailInstitusi: string;
  noTeleponInstitusi: string;
  namaPembimbing: string;
  noTeleponPembimbing: string;
  emailPembimbing: string;
  rencanaMultai: string;
  rencanaAkhir: string;
  penempatanPKL: string;
  riwayatPenyakit: string;
  penangananKhusus: string;
}

interface ValidationErrors {
  [key: string]: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    namaLengkap: 'John Doe',
    email: 'john.doe@example.com',
    alamat: 'Jl. Contoh No. 123, Jakarta',
    noTelepon: '081234567890',
    namaOrangTua: 'Jane Doe',
    noTeleponOrangTua: '081234567891',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2000-01-01',
    golonganDarah: 'A',
    namaInstitusi: 'Universitas Contoh',
    nomorInduk: '12345678',
    alamatInstitusi: 'Jl. Kampus No. 456, Jakarta',
    emailInstitusi: 'info@universitascontoh.ac.id',
    noTeleponInstitusi: '021-12345678',
    namaPembimbing: 'Dr. Smith',
    noTeleponPembimbing: '081234567892',
    emailPembimbing: 'dr.smith@universitascontoh.ac.id',
    rencanaMultai: '2024-01-15',
    rencanaAkhir: '2024-06-15',
    penempatanPKL: 'PT. Teknologi Maju',
    riwayatPenyakit: 'Tidak ada',
    penangananKhusus: 'Tidak ada'
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!profileData.namaLengkap.trim()) {
      newErrors.namaLengkap = 'Nama lengkap harus diisi';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!profileData.noTelepon.trim()) {
      newErrors.noTelepon = 'Nomor telepon harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      setIsEditing(false);
      // Here you would typically save to backend
      console.log('Profile saved:', profileData);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data if needed
  };

  const InputField = ({ 
    label, 
    field, 
    type = 'text', 
    icon: Icon 
  }: { 
    label: string; 
    field: keyof ProfileData; 
    type?: string; 
    icon: React.ElementType;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>
      <input
        type={type}
        value={profileData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isEditing}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          errors[field] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      />
      {errors[field] && (
        <p className="text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  );

  const TextAreaField = ({ 
    label, 
    field, 
    icon: Icon 
  }: { 
    label: string; 
    field: keyof ProfileData; 
    icon: React.ElementType;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>
      <textarea
        value={profileData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        disabled={!isEditing}
        rows={3}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
          errors[field] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : ''}`}
      />
      {errors[field] && (
        <p className="text-sm text-red-600">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Profil Peserta</h1>
                <p className="text-blue-100">Kelola informasi pribadi Anda</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profil
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Batal
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nama Lengkap" field="namaLengkap" icon={User} />
              <InputField label="Email" field="email" type="email" icon={Mail} />
              <InputField label="Nomor Telepon" field="noTelepon" icon={Phone} />
              <InputField label="Nama Orang Tua" field="namaOrangTua" icon={User} />
              <InputField label="No. Telepon Orang Tua" field="noTeleponOrangTua" icon={Phone} />
              <InputField label="Tempat Lahir" field="tempatLahir" icon={MapPin} />
              <InputField label="Tanggal Lahir" field="tanggalLahir" type="date" icon={Calendar} />
              <InputField label="Golongan Darah" field="golonganDarah" icon={Heart} />
            </div>
            <div className="mt-6">
              <TextAreaField label="Alamat" field="alamat" icon={MapPin} />
            </div>
          </section>

          {/* Institution Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <School className="w-5 h-5 mr-2 text-blue-600" />
              Informasi Institusi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Nama Institusi" field="namaInstitusi" icon={School} />
              <InputField label="Nomor Induk" field="nomorInduk" icon={FileText} />
              <InputField label="Email Institusi" field="emailInstitusi" type="email" icon={Mail} />
              <InputField label="No. Telepon Institusi" field="noTeleponInstitusi" icon={Phone} />
              <InputField label="Nama Pembimbing" field="namaPembimbing" icon={User} />
              <InputField label="No. Telepon Pembimbing" field="noTeleponPembimbing" icon={Phone} />
              <InputField label="Email Pembimbing" field="emailPembimbing" type="email" icon={Mail} />
            </div>
            <div className="mt-6">
              <TextAreaField label="Alamat Institusi" field="alamatInstitusi" icon={MapPin} />
            </div>
          </section>

          {/* PKL Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Informasi PKL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Rencana Mulai" field="rencanaMultai" type="date" icon={Calendar} />
              <InputField label="Rencana Akhir" field="rencanaAkhir" type="date" icon={Calendar} />
            </div>
            <div className="mt-6 space-y-6">
              <TextAreaField label="Penempatan PKL" field="penempatanPKL" icon={MapPin} />
              <TextAreaField label="Riwayat Penyakit" field="riwayatPenyakit" icon={Heart} />
              <TextAreaField label="Penanganan Khusus" field="penangananKhusus" icon={FileText} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}