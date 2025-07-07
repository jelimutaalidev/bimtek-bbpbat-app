import React, { useState } from 'react';
import { ArrowLeft, LogIn, AlertCircle, MessageCircle, Eye, EyeOff } from 'lucide-react';
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

  // Demo credentials
  const demoCredentials = {
    username: 'peserta001',
    accessCode: 'BBPBAT2025'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      if (formData.username === demoCredentials.username && 
          formData.accessCode === demoCredentials.accessCode) {
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

          {/* Demo Credentials Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Username:</strong> peserta001</p>
              <p><strong>Kode Akses:</strong> BBPBAT2025</p>
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
                  placeholder="Masukkan username Anda"
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
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
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;