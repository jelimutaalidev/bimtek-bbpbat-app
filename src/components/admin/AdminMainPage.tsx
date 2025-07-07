import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  FileText, 
  Award, 
  Megaphone,
  LogOut,
  Menu,
  X,
  Shield,
  Settings,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { NavigationState } from '../../App';
import AdminDashboard from './AdminDashboard';
import RegistrationManagement from './RegistrationManagement';
import ParticipantManagement from './ParticipantManagement';
import AttendanceManagement from './AttendanceManagement';
import ReportManagement from './ReportManagement';
import CertificateManagement from './CertificateManagement';
import AnnouncementManagement from './AnnouncementManagement';

interface AdminMainPageProps {
  onNavigate: (page: NavigationState) => void;
  onLogout: () => void;
}

const AdminMainPage: React.FC<AdminMainPageProps> = ({ onNavigate, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      component: AdminDashboard
    },
    {
      id: 'registration',
      label: 'Manajemen Pendaftaran',
      icon: <UserPlus className="w-5 h-5" />,
      component: RegistrationManagement
    },
    {
      id: 'participants',
      label: 'Manajemen Data Peserta',
      icon: <Users className="w-5 h-5" />,
      component: ParticipantManagement
    },
    {
      id: 'attendance',
      label: 'Manajemen Absensi',
      icon: <UserCheck className="w-5 h-5" />,
      component: AttendanceManagement
    },
    {
      id: 'reports',
      label: 'Manajemen Laporan',
      icon: <FileText className="w-5 h-5" />,
      component: ReportManagement
    },
    {
      id: 'certificates',
      label: 'Manajemen Sertifikat',
      icon: <Award className="w-5 h-5" />,
      component: CertificateManagement
    },
    {
      id: 'announcements',
      label: 'Pengumuman',
      icon: <Megaphone className="w-5 h-5" />,
      component: AnnouncementManagement
    }
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeMenu)?.component || AdminDashboard;

  const handleMenuClick = (menuId: string) => {
    setActiveMenu(menuId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gray-800">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-white" />
            <span className="text-xl font-bold text-white">Admin BBPBAT</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Admin Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Administrator</p>
              <p className="text-sm text-gray-600">Super Admin</p>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                    activeMenu === item.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
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
              <Shield className="w-6 h-6 text-gray-800" />
              <span className="text-lg font-bold text-gray-800">Admin BBPBAT</span>
            </div>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <ActiveComponent />
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

export default AdminMainPage;