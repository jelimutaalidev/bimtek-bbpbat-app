import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Clock, 
  FileCheck, 
  Award, 
  LogOut,
  Menu,
  X,
  Fish,
  CreditCard
} from 'lucide-react';
import { NavigationState } from '../App';
import Dashboard from './main/Dashboard';
import Profile from './main/Profile';
import Documents from './main/Documents';
import Attendance from './main/Attendance';
import Reports from './main/Reports';
import Certificate from './main/Certificate';
import GeneralProfile from './main/GeneralProfile';
import PaymentUpload from './main/PaymentUpload';

interface MainPageProps {
  onNavigate: (page: NavigationState) => void;
  onLogout: () => void;
}

// Global state untuk menyimpan data yang persisten
const globalState = {
  userData: {
    name: '',
    institution: '',
    profileComplete: false,
    documentsComplete: false,
    paymentComplete: false, // Untuk masyarakat umum
    userType: 'pelajar' as 'pelajar' | 'umum' // 'pelajar' atau 'umum'
  },
  uploadedFiles: {} as Record<string, File | null>,
  profileData: {
    // Personal Info - Hanya nama dan institusi yang terisi dari pendaftaran
    namaLengkap: 'John Doe', // Dari pendaftaran
    alamat: '',
    noTelepon: '+62 812 3456 7890', // Dari pendaftaran (nomor WA)
    email: '',
    namaOrangTua: '',
    noTeleponOrangTua: '',
    tempatLahir: '',
    tanggalLahir: '',
    golonganDarah: '',

    // Institution Info - Hanya nama institusi yang terisi dari pendaftaran
    namaInstitusi: 'Universitas Padjadjaran', // Dari pendaftaran
    nomorInduk: '',
    alamatInstitusi: '',
    emailInstitusi: '',
    noTeleponInstitusi: '',
    namaPembimbing: 'Dr. Ahmad Suryadi', // Dari pendaftaran
    noTeleponPembimbing: '+62 813 4567 8901', // Dari pendaftaran (nomor WA pembimbing)
    emailPembimbing: '',

    // Internship Plan - Kosong, akan diisi user
    rencanaMultai: '',
    rencanaAkhir: '',
    penempatanPKL: 'BIOFLOK NILA', // Dari pendaftaran (pilihan penempatan)

    // Health Info - Kosong, akan diisi user
    riwayatPenyakit: '',
    penangananKhusus: ''
  },
  generalProfileData: {
    // Personal Info untuk masyarakat umum
    namaLengkap: 'Ahmad Rahman', // Dari pendaftaran
    email: '',
    alamat: '',
    noTelepon: '+62 816 7890 1234', // Dari pendaftaran (nomor WA)
    golonganDarah: '',
    tempatLahir: '',
    tanggalLahir: '',

    // Institution Info untuk masyarakat umum
    namaInstitusi: 'Dinas Perikanan Jawa Barat', // Dari pendaftaran
    alamatInstitusi: '',
    emailInstitusi: '',

    // Bimtek Plan
    rencanaMultai: '',
    rencanaAkhir: '',
    penempatanPKL: 'PAKAN MANDIRI (BUATAN)', // Dari pendaftaran

    // Health Info
    riwayatPenyakit: '',
    penangananKhusus: ''
  }
};

const MainPage: React.FC<MainPageProps> = ({ onNavigate, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get user type from localStorage (set during login)
  const [userType, setUserType] = useState<'pelajar' | 'umum'>(() => {
    const savedUserType = localStorage.getItem('userType') as 'pelajar' | 'umum';
    return savedUserType || 'pelajar';
  });

  // Update global state based on user type
  React.useEffect(() => {
    globalState.userData.userType = userType;
    
    if (userType === 'pelajar') {
      globalState.userData.name = globalState.profileData.namaLengkap;
      globalState.userData.institution = globalState.profileData.namaInstitusi;
    } else {
      globalState.userData.name = globalState.generalProfileData.namaLengkap;
      globalState.userData.institution = globalState.generalProfileData.namaInstitusi;
    }
  }, [userType]);


  // Function untuk update global state
  const updateUserData = (newData: Partial<typeof globalState.userData>) => {
    globalState.userData = { ...globalState.userData, ...newData };
  };

  const updateUploadedFiles = (files: Record<string, File | null>) => {
    globalState.uploadedFiles = { ...globalState.uploadedFiles, ...files };
  };

  const updateProfileData = (data: Partial<typeof globalState.profileData>) => {
    globalState.profileData = { ...globalState.profileData, ...data };
  };

  const updateGeneralProfileData = (data: Partial<typeof globalState.generalProfileData>) => {
    globalState.generalProfileData = { ...globalState.generalProfileData, ...data };
  };

  // Menu items untuk pelajar
  const studentMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      component: Dashboard
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: <User className="w-5 h-5" />,
      component: Profile
    },
    {
      id: 'documents',
      label: 'Berkas',
      icon: <FileText className="w-5 h-5" />,
      component: Documents
    },
    {
      id: 'attendance',
      label: 'Absensi',
      icon: <Clock className="w-5 h-5" />,
      component: Attendance,
      disabled: !globalState.userData.profileComplete || !globalState.userData.documentsComplete
    },
    {
      id: 'reports',
      label: 'Laporan',
      icon: <FileCheck className="w-5 h-5" />,
      component: Reports,
      disabled: !globalState.userData.profileComplete || !globalState.userData.documentsComplete
    },
    {
      id: 'certificate',
      label: 'Sertifikat',
      icon: <Award className="w-5 h-5" />,
      component: Certificate,
      disabled: !globalState.userData.profileComplete || !globalState.userData.documentsComplete
    }
  ];

  // Menu items untuk masyarakat umum
  const generalMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      component: Dashboard
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: <User className="w-5 h-5" />,
      component: GeneralProfile
    },
    {
      id: 'payment',
      label: 'Upload Bukti Pembayaran',
      icon: <CreditCard className="w-5 h-5" />,
      component: PaymentUpload
    },
    {
      id: 'certificate',
      label: 'Sertifikat',
      icon: <Award className="w-5 h-5" />,
      component: Certificate,
      disabled: !globalState.userData.profileComplete || !globalState.userData.paymentComplete
    }
  ];

  const menuItems = userType === 'pelajar' ? studentMenuItems : generalMenuItems;
  const ActiveComponent = menuItems.find(item => item.id === activeMenu)?.component || Dashboard;

  const handleMenuClick = (menuId: string) => {
    const menuItem = menuItems.find(item => item.id === menuId);
    if (menuItem && !menuItem.disabled) {
      setActiveMenu(menuId);
      setSidebarOpen(false);
    }
  };

  // Props untuk komponen yang membutuhkan state management
  const componentProps = {
    userData: globalState.userData,
    uploadedFiles: globalState.uploadedFiles,
    profileData: userType === 'pelajar' ? globalState.profileData : globalState.generalProfileData,
    updateUserData,
    updateUploadedFiles,
    updateProfileData: userType === 'pelajar' ? updateProfileData : updateGeneralProfileData
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Fish className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">BBPBAT</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {userType === 'pelajar' ? globalState.profileData.namaLengkap : globalState.generalProfileData.namaLengkap}
              </p>
              <p className="text-sm text-gray-600">
                {userType === 'pelajar' ? globalState.profileData.namaInstitusi : globalState.generalProfileData.namaInstitusi}
              </p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                userType === 'pelajar' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'
              }`}>
                {userType === 'pelajar' ? 'Pelajar' : 'Masyarakat Umum'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id)}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeMenu === item.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                      Terkunci
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Fish className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-800">BBPBAT</span>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <ActiveComponent {...componentProps} />
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainPage;