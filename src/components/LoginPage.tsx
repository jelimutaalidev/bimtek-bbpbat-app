import React, { useState } from 'react';
import { ArrowLeft, LogIn, AlertCircle, MessageCircle, Eye, EyeOff, GraduationCap, Users } from 'lucide-react';
import { NavigationState } from '../App';

interface LoginPageProps {
  onNavigate: (page: NavigationState) => void;
  onLogin: (isLoggedIn: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    accessCode: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [detectedUserType, setDetectedUserType] = useState<'pelajar' | 'umum' | null>(null);

  // Demo credentials untuk berbagai jenis user
  const demoCredentials = {
    pelajar: {
      username: 'pelajar001',
      accessCode: 'BBPBAT2025'
    },
    umum: {
      username: 'umum001', 
      accessCode: 'BBPBAT2025'
    }
  };

  // Fungsi untuk mendeteksi jenis user berdasarkan username
  const detectUserType = (username: string): 'pelajar' | 'umum' | null => {
    if (username.toLowerCase().startsWith('pelajar')) {
      return 'pelajar';
    } else if (username.toLowerCase().startsWith('umum') || username.toLowerCase().startsWith('dinas')) {
      return 'umum';
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Deteksi jenis user saat username diketik
    if (name === 'username') {
      const userType = detectUserType(value);
      setDetectedUserType(userType);
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    }

    if (!formData.accessCode.trim()) {
      newErrors.accessCode = 'Kode akses wajib diisi';
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
      const userType = detectUserType(formData.username);
      let isValidCredentials = false;

      // Check credentials based on detected user type
      if (userType === 'pelajar') {
        isValidCredentials = formData.username === demoCredentials.pelajar.username && 
                           formData.accessCode === demoCredentials.pelajar.accessCode;
      } else if (userType === 'umum') {
        isValidCredentials = formData.username === demoCredentials.umum.username && 
                           formData.accessCode === demoCredentials.umum.accessCode;
      }

      if (isValidCredentials) {
        onLogin(true);
        onNavigate('main');
      } else {
        setErrors({
          general: 'Username atau kode akses tidak valid'
        });
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const getUserTypeInfo = (type: 'pelajar' | 'umum' | null) => {
    switch (type) {
      case 'pelajar':
        return {
          icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
          label: 'Pelajar/Mahasiswa',
          description: 'Akses untuk peserta dari institusi pendidikan',
          color: 'border-blue-200 bg-blue-50'
        };
      case 'umum':
        return {
          icon: <Users className="w-5 h-5 text-teal-600" />,
          label: 'Masyarakat Umum/Dinas',
          description: 'Akses untuk peserta umum dan instansi pemerintah',
          color: 'border-teal-200 bg-teal-50'
        };
      default:
        return null;
    }
  };

  const userTypeInfo = getUserTypeInfo(detectedUserType);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Log In
            </h1>
            <p className="text-gray-600">
              Masuk ke sistem BIMTEK BBPBAT
            </p>
          </div>

          {/* User Type Detection */}
          {userTypeInfo && (
            <div className={`rounded-lg p-4 border mb-6 ${userTypeInfo.color}`}>
              <div className="flex items-center gap-3">
                {userTypeInfo.icon}
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{userTypeInfo.label}</h3>
                  <p className="text-xs text-gray-600">{userTypeInfo.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-3">Demo Credentials:</h3>
            <div className="space-y-3">
              <div className="bg-white rounded p-3 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Pelajar/Mahasiswa</span>
                </div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Username:</strong> pelajar001</p>
                  <p><strong>Kode Akses:</strong> BBPBAT2025</p>
                </div>
              </div>
              <div className="bg-white rounded p-3 border border-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-medium text-teal-800">Masyarakat Umum/Dinas</span>
                </div>
                <div className="text-sm text-teal-700 space-y-1">
                  <p><strong>Username:</strong> umum001</p>
                  <p><strong>Kode Akses:</strong> BBPBAT2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: pelajar001 atau umum001"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Format: pelajar001 (untuk pelajar) atau umum001 (untuk masyarakat umum/dinas)
                </p>
              </div>

              {/* Access Code */}
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Akses *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="accessCode"
                    name="accessCode"
                    value={formData.accessCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 ${
                      errors.accessCode ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan kode akses Anda"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.accessCode && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.accessCode}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Masuk
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Information */}
          <div className="mt-6 bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">
                  Belum Memiliki Akun?
                </h3>
                <p className="text-sm text-orange-700">
                  Username dan kode akses akan dikirim melalui WhatsApp setelah pengajuan pendaftaran Anda diterima oleh admin. 
                  Sistem akan otomatis mendeteksi jenis akun berdasarkan format username yang diberikan.
                </p>
              </div>
            </div>
          </div>

          {/* Username Format Guide */}
          <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Format Username:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>pelajar001, pelajar002, ...</strong> → Akun Pelajar/Mahasiswa</p>
              <p><strong>umum001, umum002, ...</strong> → Akun Masyarakat Umum</p>
              <p><strong>dinas001, dinas002, ...</strong> → Akun Instansi/Dinas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;