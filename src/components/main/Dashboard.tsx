import React from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  BookOpen,
  TrendingUp,
  FileText
} from 'lucide-react';

interface DashboardProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    documentsComplete: boolean;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ userData }) => {
  const stats = [
    {
      title: 'Kehadiran',
      value: '85%',
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Tugas Selesai',
      value: '12/15',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Nilai Rata-rata',
      value: '87.5',
      icon: <TrendingUp className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100',
      change: '+2.5',
      changeType: 'positive'
    },
    {
      title: 'Sertifikat',
      value: '0/1',
      icon: <FileText className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100',
      change: 'Pending',
      changeType: 'neutral'
    }
  ];

  const upcomingEvents = [
    {
      title: 'Praktikum Budidaya Ikan',
      date: '2025-01-20',
      time: '08:00 - 12:00',
      location: 'Lab Budidaya',
      type: 'praktikum'
    },
    {
      title: 'Seminar Teknologi Pakan',
      date: '2025-01-22',
      time: '13:00 - 15:00',
      location: 'Aula BBPBAT',
      type: 'seminar'
    },
    {
      title: 'Evaluasi Tengah Program',
      date: '2025-01-25',
      time: '09:00 - 11:00',
      location: 'Ruang Ujian',
      type: 'evaluasi'
    }
  ];

  const recentActivities = [
    {
      title: 'Mengumpulkan Laporan Praktikum',
      time: '2 jam yang lalu',
      type: 'submission'
    },
    {
      title: 'Absen Masuk - Praktikum Pagi',
      time: '5 jam yang lalu',
      type: 'attendance'
    },
    {
      title: 'Mengunduh Materi Pembelajaran',
      time: '1 hari yang lalu',
      type: 'download'
    },
    {
      title: 'Update Profil Peserta',
      time: '2 hari yang lalu',
      type: 'profile'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'praktikum':
        return 'bg-blue-100 text-blue-800';
      case 'seminar':
        return 'bg-green-100 text-green-800';
      case 'evaluasi':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Selamat Datang, {userData.name}!
        </h1>
        <p className="opacity-90">
          Semangat mengikuti program Bimbingan Teknis BBPBAT hari ini
        </p>
      </div>

      {/* Quick Actions */}
      {(!userData.profileComplete || !userData.documentsComplete) && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 mb-1">
                Lengkapi Data Anda
              </h3>
              <p className="text-sm text-orange-700 mb-3">
                Untuk mengakses fitur absensi, laporan, dan sertifikat, silakan lengkapi profil dan berkas wajib terlebih dahulu.
              </p>
              <div className="flex gap-2">
                {!userData.profileComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Profil Belum Lengkap
                  </span>
                )}
                {!userData.documentsComplete && (
                  <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                    Berkas Belum Lengkap
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-lg p-2 ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Jadwal Mendatang</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{formatDate(event.date)}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
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

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Materi</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Clock className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-green-800">Absensi</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <FileText className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">Laporan</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Users className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Forum</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;