import React, { useState } from 'react';
import { ArrowLeft, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { NavigationState } from '../App';
import { registrationService } from '../services/registration';

interface StudentRegistrationProps {
  onNavigate: (page: NavigationState) => void;
}

const StudentRegistration: React.FC<StudentRegistrationProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    nomerWA: '',
    pembimbing: '',
    nomerWAPembimbing: '',
    pilihanPenempatan: '',
    suratPengajuan: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placementOptions = [
    { name: 'BIOFLOK NILA', quota: 'sisa kuota 3' },
    { name: 'PEMBENIHAN KOMET', quota: 'sisa kuota 2' },
    { name: 'PEMBENIHAN GURAME', quota: 'sisa kuota 1' },
    { name: 'PEMBENIHAN NILA SULTANA', quota: 'sisa kuota 4' },
    { name: 'PEMBENIHAN BAUNG', quota: 'sisa kuota 2' },
    { name: 'PEMBENIHAN LELE SANGKURIANG', quota: 'sisa kuota 5' },
    { name: 'PEMBENIHAN PATIN', quota: 'sisa kuota 3' },
    { name: 'PEMBENIHAN MAS MANTAP', quota: 'sisa kuota 2' },
    { name: 'PEMBENIHAN NILEM', quota: 'sisa kuota 1' },
    { name: 'Ikan Wader', quota: 'sisa kuota 3' },
    { name: 'PEMBENIHAN KOI', quota: 'sisa kuota 4' },
    { name: 'PEMBENIHAN MANFISH', quota: 'sisa kuota 2' },
    { name: 'IKAN KOKI', quota: 'sisa kuota 1' },
    { name: 'PAKAN MANDIRI (BUATAN)', quota: 'sisa kuota 6' },
    { name: 'CACING SUTERA', quota: 'sisa kuota 3' },
    { name: 'MOINA', quota: 'sisa kuota 2' },
    { name: 'UDANG GALAH (PELABUHAN RATU)', quota: 'sisa kuota 1' },
    { name: 'LAB KESEHATAN IKAN', quota: 'sisa kuota 4' },
    { name: 'LAB NUTRISI DAN RESIDU', quota: 'sisa kuota 3' },
    { name: 'LAB KUALITAS AIR', quota: 'sisa kuota 2' },
    { name: 'Pelayanan Publik', quota: 'sisa kuota 5' },
    { name: 'Perpustakaan', quota: 'sisa kuota 3' },
    { name: 'Uji Terap Teknik dan Kerjasama', quota: 'sisa kuota 2' },
    { name: 'Arsip', quota: 'sisa kuota 4' },
    { name: 'Kepegawaian', quota: 'sisa kuota 1' },
    { name: 'Koperasi', quota: 'sisa kuota 2' },
    { name: 'KODOK LEMBU', quota: 'kuota penuh' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, suratPengajuan: file }));
      if (errors.suratPengajuan) {
        setErrors(prev => ({ ...prev, suratPengajuan: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }

    if (!formData.instansi.trim()) {
      newErrors.instansi = 'Instansi wajib diisi';
    }

    if (!formData.nomerWA.trim()) {
      newErrors.nomerWA = 'Nomor WhatsApp wajib diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.nomerWA)) {
      newErrors.nomerWA = 'Format nomor WhatsApp tidak valid';
    }

    if (!formData.pembimbing.trim()) {
      newErrors.pembimbing = 'Nama pembimbing wajib diisi';
    }

    if (!formData.nomerWAPembimbing.trim()) {
      newErrors.nomerWAPembimbing = 'Nomor WhatsApp pembimbing wajib diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.nomerWAPembimbing)) {
      newErrors.nomerWAPembimbing = 'Format nomor WhatsApp tidak valid';
    }

    if (!formData.pilihanPenempatan) {
      newErrors.pilihanPenempatan = 'Pilihan penempatan wajib dipilih';
    }

    if (!formData.suratPengajuan) {
      newErrors.suratPengajuan = 'Surat pengajuan wajib diunggah';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await registrationService.submitStudentRegistration(formData);
      
      if (response.success) {
        alert('Pendaftaran berhasil dikirim! Anda akan dihubungi melalui WhatsApp untuk konfirmasi.');
        onNavigate('home');
      } else {
        alert('Gagal mengirim pendaftaran: ' + (response.error || 'Terjadi kesalahan'));
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, suratPengajuan: null }));
  };

  const getQuotaColor = (quota: string) => {
    if (quota === 'kuota penuh') {
      return 'text-red-600';
    } else if (quota.includes('sisa kuota 1')) {
      return 'text-orange-600';
    } else {
      return 'text-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate('registration-menu')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Menu Pendaftaran
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Pendaftaran Pelajar
            </h1>
            <p className="text-gray-600">
              Lengkapi formulir di bawah ini untuk mendaftar sebagai pelajar
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama */}
              <div>
                <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.nama ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama lengkap Anda"
                />
                {errors.nama && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nama}
                  </p>
                )}
              </div>

              {/* Instansi */}
              <div>
                <label htmlFor="instansi" className="block text-sm font-medium text-gray-700 mb-2">
                  Instansi/Sekolah/Universitas *
                </label>
                <input
                  type="text"
                  id="instansi"
                  name="instansi"
                  value={formData.instansi}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.instansi ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama instansi Anda"
                />
                {errors.instansi && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.instansi}
                  </p>
                )}
              </div>

              {/* Nomor WA */}
              <div>
                <label htmlFor="nomerWA" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp *
                </label>
                <input
                  type="tel"
                  id="nomerWA"
                  name="nomerWA"
                  value={formData.nomerWA}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.nomerWA ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: +62 812 3456 7890"
                />
                {errors.nomerWA && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nomerWA}
                  </p>
                )}
              </div>

              {/* Pembimbing */}
              <div>
                <label htmlFor="pembimbing" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pembimbing *
                </label>
                <input
                  type="text"
                  id="pembimbing"
                  name="pembimbing"
                  value={formData.pembimbing}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pembimbing ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama pembimbing dari instansi"
                />
                {errors.pembimbing && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.pembimbing}
                  </p>
                )}
              </div>

              {/* Nomor WA Pembimbing */}
              <div>
                <label htmlFor="nomerWAPembimbing" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor WhatsApp Pembimbing *
                </label>
                <input
                  type="tel"
                  id="nomerWAPembimbing"
                  name="nomerWAPembimbing"
                  value={formData.nomerWAPembimbing}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.nomerWAPembimbing ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: +62 812 3456 7890"
                />
                {errors.nomerWAPembimbing && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.nomerWAPembimbing}
                  </p>
                )}
              </div>

              {/* Pilihan Penempatan */}
              <div>
                <label htmlFor="pilihanPenempatan" className="block text-sm font-medium text-gray-700 mb-2">
                  Pilihan Penempatan *
                </label>
                <select
                  id="pilihanPenempatan"
                  name="pilihanPenempatan"
                  value={formData.pilihanPenempatan}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.pilihanPenempatan ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih unit penempatan</option>
                  {placementOptions.map((option, index) => (
                    <option 
                      key={index} 
                      value={option.name}
                      disabled={option.quota === 'kuota penuh'}
                    >
                      {option.name} ({option.quota})
                    </option>
                  ))}
                </select>
                {errors.pilihanPenempatan && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.pilihanPenempatan}
                  </p>
                )}
                
                {/* Quota Information */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Informasi Kuota:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {placementOptions.slice(0, 6).map((option, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{option.name}:</span>
                        <span className={`font-medium ${getQuotaColor(option.quota)}`}>
                          {option.quota}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="text-red-600">●</span> Kuota penuh
                    <span className="ml-4 text-orange-600">●</span> Kuota terbatas (1-2 sisa)
                    <span className="ml-4 text-green-600">●</span> Kuota tersedia
                  </div>
                </div>
              </div>

              {/* Upload Surat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surat Pengajuan Pendaftaran *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors relative ${
                  errors.suratPengajuan ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
                }`}>
                  {formData.suratPengajuan ? (
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700">{formData.suratPengajuan.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">
                        Klik untuk mengunggah atau drag & drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Format yang didukung: PDF, DOC, DOCX (Maksimal 5MB)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
                {errors.suratPengajuan && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.suratPengajuan}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim Pendaftaran...
                    </>
                  ) : (
                    'Ajukan Pendaftaran'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Information */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Informasi Penting:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Pastikan semua data yang diisi benar dan lengkap</li>
              <li>• Surat pengajuan harus bermaterai dan ditandatangani oleh pimpinan instansi</li>
              <li>• Proses verifikasi akan dilakukan dalam 1-3 hari kerja</li>
              <li>• Anda akan dihubungi via WhatsApp untuk konfirmasi</li>
              <li>• Pilihan penempatan dengan kuota penuh tidak dapat dipilih</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;