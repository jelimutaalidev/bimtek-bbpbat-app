import React, { useState } from 'react';
import { ArrowLeft, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { NavigationState } from '../../App';
import { useAuth } from '../../hooks/useAuth';

interface AdminLoginPageProps {
  onNavigate: (page: NavigationState) => void;
  onLogin: (isLoggedIn: boolean) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
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
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success && result.user?.role === 'admin') {
        onLogin(true);
        onNavigate('admin-main');
      } else {
        setErrors({
          general: result.error || 'Login gagal atau Anda bukan admin'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Terjadi kesalahan jaringan'
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-800" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Akses khusus untuk administrator sistem
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">
                  Akses Terbatas
                </h3>
                <p className="text-sm text-orange-700">
                  Halaman ini hanya dapat diakses oleh administrator yang telah diotorisasi oleh sistem.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Credentials Info */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Demo Admin Account:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Email:</strong> admin@conference.com</p>
              <p><strong>Password:</strong> admin123</p>
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

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Admin *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan email admin"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors pr-12 ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan password admin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memverifikasi...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Masuk sebagai Admin
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Information */}
          <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">
                  Keamanan Sistem
                </h3>
                <p className="text-sm text-red-700">
                  Semua aktivitas admin akan dicatat dalam log sistem. Pastikan Anda memiliki otorisasi yang tepat sebelum mengakses sistem ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;