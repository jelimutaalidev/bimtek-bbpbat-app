import React, { useState } from 'react';
import { ArrowLeft, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { NavigationState } from '../App';

interface GeneralRegistrationProps {
  onNavigate: (page: NavigationState) => void;
}

const GeneralRegistration: React.FC<GeneralRegistrationProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    nomerWA: '',
    pilihanPenempatan: '',
    suratPengajuan: null as File | null,
    buktiPembayaran: null as File | null
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

  const handleFileChange = (field: 'suratPengajuan' | 'buktiPembayaran') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
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

    if (!formData.pilihanPenempatan) {
      newErrors.pilihanPenempatan = 'Pilihan penempatan wajib dipilih';
    }

    if (!formData.suratPengajuan) {
      newErrors.suratPengajuan = 'Surat pengajuan wajib diunggah';
    }

    if (!formData.buktiPembayaran) {
      newErrors.buktiPembayaran = 'Bukti pembayaran wajib diunggah';
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('home');
    }, 2000);
  };

  const removeFile = (field: 'suratPengajuan' | 'buktiPembayaran') => {
    setFormData(prev => ({ ...prev, [field]: null }));
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

  const FileUpload = ({ 
    field, 
    label, 
    file, 
    error, 
    accept, 
    description 
  }: {
    field: 'suratPengajuan' | 'buktiPembayaran';
    label: string;
    file: File | null;
    error?: string;
    accept: string;
    description: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} *
      </label>
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors relative ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'
      }`}>
        {file ? (
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => removeFile(field)}
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
              {description}
            </p>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange(field)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );

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
              Pendaftaran Masyarakat Umum/Dinas
            </h1>
            <p className="text-gray-600">
              Lengkapi formulir di bawah ini untuk mendaftar sebagai peserta umum
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-8">
            <h3 className="text-sm font-medium text-orange-800 mb-2">Informasi Pembayaran:</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p><strong>Bank BNI:</strong> 1234567890 a.n. BBPBAT</p>
              <p><strong>Biaya Pelatihan:</strong> Rp 1.500.000 per peserta</p>
              <p><strong>Termasuk:</strong> Materi, konsumsi, sertifikat, dan akomodasi</p>
            </div>
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
                  Instansi/Perusahaan/Dinas *
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
                  placeholder="Masukkan nama instansi/perusahaan Anda"
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
              <FileUpload
                field="suratPengajuan"
                label="Surat Pengajuan Pendaftaran"
                file={formData.suratPengajuan}
                error={errors.suratPengajuan}
                accept=".pdf,.doc,.docx"
                description="Format yang didukung: PDF, DOC, DOCX (Maksimal 5MB)"
              />

              {/* Upload Bukti Pembayaran */}
              <FileUpload
                field="buktiPembayaran"
                label="Bukti Pembayaran"
                file={formData.buktiPembayaran}
                error={errors.buktiPembayaran}
                accept=".pdf,.jpg,.jpeg,.png"
                description="Format yang didukung: PDF, JPG, PNG (Maksimal 5MB)"
              />

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
              <li>• Bukti pembayaran harus jelas dan terbaca</li>
              <li>• Proses verifikasi akan dilakukan dalam 1-3 hari kerja</li>
              <li>• Anda akan dihubungi via WhatsApp untuk konfirmasi</li>
              <li>• Pembayaran yang sudah masuk tidak dapat dikembalikan</li>
              <li>• Pilihan penempatan dengan kuota penuh tidak dapat dipilih</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralRegistration;