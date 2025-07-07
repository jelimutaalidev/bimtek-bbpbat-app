import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Award, 
  FileText, 
  ClipboardCheck, 
  CheckCircle,
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Pendaftar Baru',
      value: '24',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
      description: 'Pengajuan belum ditanggapi',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Peserta Aktif',
      value: '156',
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100',
      description: 'Pengajuan diterima',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Peserta Selesai',
      value: '89',
      icon: <UserX className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100',
      description: 'Belum mendapat sertifikat',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Peserta Lulus',
      value: '234',
      icon: <Award className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100',
      description: 'Sudah mendapat sertifikat',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Laporan Baru',
      value: '18',
      icon: <FileText className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-100',
      description: 'Belum dicek admin',
      change: '+3',
      changeType: 'neutral'
    },
    {
      title: 'Laporan Direview',
      value: '7',
      icon: <ClipboardCheck className="w-6 h-6 text-indigo-600" />,
      color: 'bg-indigo-100',
      description: 'Sedang dicek admin',
      change: '-2',
      changeType: 'negative'
    },
    {
      title: 'Laporan Diterima',
      value: '142',
      icon: <CheckCircle className="w-6 h-6 text-teal-600" />,
      color: 'bg-teal-100',
      description: 'Sudah dicek dan diterima',
      change: '+25%',
      changeType: 'positive'
    }
  ];

  const recentActivities = [
    {
      title: 'Pendaftaran baru dari John Doe (Universitas Padjadjaran)',
      time: '5 menit yang lalu',
      type: 'registration',
      priority: 'high'
    },
    {
      title: 'Laporan PKL dikirim oleh Sarah Wilson',
      time: '15 menit yang lalu',
      type: 'report',
      priority: 'medium'
    },
    {
      title: 'Sertifikat diterbitkan untuk batch Mei 2025',
      time: '1 jam yang lalu',
      type: 'certificate',
      priority: 'low'
    },
    {
      title: 'Kuota BIOFLOK NILA sudah penuh',
      time: '2 jam yang lalu',
      type: 'quota',
      priority: 'high'
    },
    {
      title: 'Absensi harian telah diupdate',
      time: '3 jam yang lalu',
      type: 'attendance',
      priority: 'low'
    }
  ];

  const pendingActions = [
    {
      title: 'Review 24 pendaftaran baru',
      description: 'Terdapat 24 pengajuan pendaftaran yang menunggu persetujuan',
      action: 'Review Sekarang',
      priority: 'high',
      count: 24
    },
    {
      title: 'Periksa 18 laporan baru',
      description: 'Laporan PKL baru memerlukan review dan feedback',
      action: 'Periksa Laporan',
      priority: 'medium',
      count: 18
    },
    {
      title: 'Update kuota penempatan',
      description: 'Beberapa unit penempatan mendekati batas kuota',
      action: 'Update Kuota',
      priority: 'medium',
      count: 5
    },
    {
      title: 'Terbitkan sertifikat',
      description: 'Sertifikat untuk 89 peserta siap diterbitkan',
      action: 'Terbitkan',
      priority: 'low',
      count: 89
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Dashboard Admin BBPBAT
        </h1>
        <p className="opacity-90">
          Kelola seluruh aktivitas bimbingan teknis dengan mudah dan efisien
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${getChangeColor(stat.changeType)}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-gray-500 text-xs">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-800">Tindakan Diperlukan</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-800">{action.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(action.priority)}`}>
                        {action.priority === 'high' ? 'Tinggi' : action.priority === 'medium' ? 'Sedang' : 'Rendah'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                    <button className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                      {action.action}
                    </button>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-2xl font-bold text-gray-800">{action.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.priority === 'high' ? 'bg-red-600' : 
                    activity.priority === 'medium' ? 'bg-orange-600' : 'bg-green-600'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Pendaftaran</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <UserCheck className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-800">Absensi</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <FileText className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Laporan</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Award className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Sertifikat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;