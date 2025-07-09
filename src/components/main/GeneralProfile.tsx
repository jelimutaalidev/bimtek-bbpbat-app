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
  
  // Use useRef to store initial data to prevent re-renders
  const initialProfileDataRef = useRef(profileData);
  const [formData, setFormData] = useState(profileData);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Only sync when component mounts or when explicitly needed
  useEffect(() => {
    // Only update if we're not currently editing to prevent interference
    if (!isEditing && JSON.stringify(formData) !== JSON.stringify(profileData)) {
      setFormData(profileData);
      initialProfileDataRef.current = profileData;
    }
  }, [profileData]); // Remove isEditing from dependencies to prevent unnecessary runs

  // Memoize the input change handler to prevent recreation on every render
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Pure local state update - no external calls
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]); // Only depend on errors, not on formData

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
      initialProfileDataRef.current = formData;
      
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
    // Store current state as initial when starting edit using ref
    initialProfileDataRef.current = { ...formData };
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage('');
    setErrors({});
    // Reset form data to initial state when editing started
    setFormData(initialProfileDataRef.current);
  };

  // Memoize input field component to prevent unnecessary re-renders
  const InputField = useCallback(({ 
    label, 
    field, 
    type = 'text', 
    icon: Icon 
  }: { 
    label: string; 
    field: keyof typeof formData; 
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
        name={field}
        value={formData[field] || ''}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          errors[field] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-50' : ''}`}
        placeholder={`Masukkan ${label.toLowerCase()}`}
      />
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[field]}
        </p>
      )}
    </div>
  ), [formData, errors, isEditing, handleInputChange]);

  // Memoize textarea field component
  const TextAreaField = useCallback(({ 
    label, 
    field, 
    icon: Icon,
    rows = 3
  }: { 
    label: string; 
    field: keyof typeof formData; 
    icon: React.ElementType;
    rows?: number;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>
      <textarea
        name={field}
        value={formData[field] || ''}
        onChange={handleInputChange}
        disabled={!isEditing}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
          errors[field] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-50' : ''}`}
        placeholder={`Masukkan ${label.toLowerCase()}`}
      />
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[field]}
        </p>
      )}
    </div>
  ), [formData, errors, isEditing, handleInputChange]);

  // Memoize select field component
  const SelectField = useCallback(({ 
    label, 
    field, 
    options,
    icon: Icon 
  }: { 
    label: string; 
    field: keyof typeof formData; 
    options: string[] | { value: string; label: string }[];
    icon: React.ElementType;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>
      <select
        name={field}
        value={formData[field] || ''}
        onChange={handleInputChange}
        disabled={!isEditing}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
          errors[field] ? 'border-red-300' : 'border-gray-300'
        } ${!isEditing ? 'bg-gray-50' : ''}`}
      >
        <option value="">Pilih {label.toLowerCase()}</option>
        {options.map((option, index) => {
          if (typeof option === 'string') {
            return <option key={index} value={option}>{option}</option>;
          } else {
            return <option key={index} value={option.value}>{option.label}</option>;
          }
        })}
      </select>
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {errors[field]}
        </p>
      )}
    </div>
  ), [formData, errors, isEditing, handleInputChange]);

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Nama Lengkap *" field="namaLengkap" icon={User} />
        <InputField label="Email *" field="email" type="email" icon={Mail} />
      </div>

      <TextAreaField label="Alamat *" field="alamat" icon={MapPin} />

      <div className="grid md:grid-cols-3 gap-6">
        <InputField label="No Telepon/HP/WA *" field="noTelepon" type="tel" icon={Phone} />
        <InputField label="Tempat Lahir *" field="tempatLahir" icon={MapPin} />
        <InputField label="Tanggal Lahir *" field="tanggalLahir" type="date" icon={Calendar} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SelectField 
          label="Golongan Darah *" 
          field="golonganDarah" 
          options={['A', 'B', 'AB', 'O']} 
          icon={Heart} 
        />
      </div>
    </div>
  );

  const renderInstitutionInfo = () => (
    <div className="space-y-6">
      <InputField label="Nama Institusi/Perusahaan/Dinas *" field="namaInstitusi" icon={Building} />

      <TextAreaField label="Alamat Institusi *" field="alamatInstitusi" icon={MapPin} />

      <InputField label="Email Institusi *" field="emailInstitusi" type="email" icon={Mail} />
    </div>
  );

  const renderBimtekPlan = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Rencana Mulai Bimtek *" field="rencanaMultai" type="date" icon={Calendar} />
        <InputField label="Rencana Akhir Bimtek *" field="rencanaAkhir" type="date" icon={Calendar} />
      </div>

      <SelectField 
        label="Penempatan Bimtek *" 
        field="penempatanPKL" 
        options={placementOptions} 
        icon={MapPin} 
      />
    </div>
  );

  const renderHealthInfo = () => (
    <div className="space-y-6">
      <TextAreaField 
        label="Riwayat Penyakit (2 tahun terakhir) *" 
        field="riwayatPenyakit" 
        icon={Heart} 
        rows={4} 
      />
      <TextAreaField 
        label="Penanganan Khusus yang Diperlukan *" 
        field="penangananKhusus" 
        icon={FileText} 
        rows={3} 
      />
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