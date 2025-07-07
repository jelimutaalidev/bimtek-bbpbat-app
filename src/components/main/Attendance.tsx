import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

interface AttendanceProps {
  userData: {
    name: string;
    institution: string;
    profileComplete: boolean;
    documentsComplete: boolean;
  };
}

const Attendance: React.FC<AttendanceProps> = ({ userData }) => {
  const [todayAttendance, setTodayAttendance] = useState({
    checkIn: null as string | null,
    checkOut: null as string | null,
    status: null as 'hadir' | 'izin' | 'sakit' | null
  });

  const attendanceHistory = [
    { date: '2025-01-15', checkIn: '08:00', checkOut: '16:00', status: 'hadir' },
    { date: '2025-01-14', checkIn: '08:15', checkOut: '16:05', status: 'hadir' },
    { date: '2025-01-13', checkIn: null, checkOut: null, status: 'sakit' },
    { date: '2025-01-12', checkIn: '08:00', checkOut: '16:00', status: 'hadir' },
    { date: '2025-01-11', checkIn: '08:30', checkOut: '16:10', status: 'hadir' },
  ];

  const handleAttendance = (type: 'check-in' | 'check-out', status: 'hadir' | 'izin' | 'sakit') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (type === 'check-in') {
      setTodayAttendance(prev => ({
        ...prev,
        checkIn: status === 'hadir' ? timeString : null,
        status: status
      }));
    } else {
      setTodayAttendance(prev => ({
        ...prev,
        checkOut: status === 'hadir' ? timeString : null
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'izin':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'sakit':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir':
        return 'bg-green-100 text-green-800';
      case 'izin':
        return 'bg-yellow-100 text-yellow-800';
      case 'sakit':
        return 'bg-red-100 text-red-800';
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

  const today = new Date().toISOString().split('T')[0];
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  // Check if profile and documents are complete
  if (!userData.profileComplete || !userData.documentsComplete) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Absensi</h1>
          <p className="text-gray-600">Kelola kehadiran harian Anda</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-800 mb-2">
                Akses Terbatas
              </h3>
              <p className="text-orange-700 mb-4">
                Untuk mengakses fitur absensi, Anda harus melengkapi profil dan mengunggah semua berkas wajib terlebih dahulu.
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Absensi</h1>
        <p className="text-gray-600">Kelola kehadiran harian Anda</p>
      </div>

      {/* Today's Attendance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">
            Absensi Hari Ini - {formatDate(today)}
          </h2>
        </div>

        {isWeekend ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Hari Libur</h3>
            <p className="text-gray-500">Tidak ada absensi pada hari weekend</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Check In */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Absen Masuk</h3>
              {todayAttendance.checkIn || todayAttendance.status ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(todayAttendance.status || 'hadir')}
                    <div>
                      <p className="font-medium text-green-800">
                        {todayAttendance.status === 'hadir' ? 'Hadir' : 
                         todayAttendance.status === 'izin' ? 'Izin' : 'Sakit'}
                      </p>
                      {todayAttendance.checkIn && (
                        <p className="text-sm text-green-600">
                          Waktu: {todayAttendance.checkIn}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleAttendance('check-in', 'hadir')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Hadir
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAttendance('check-in', 'izin')}
                      className="bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      Izin
                    </button>
                    <button
                      onClick={() => handleAttendance('check-in', 'sakit')}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Sakit
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Check Out */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Absen Keluar</h3>
              {todayAttendance.checkOut ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Sudah Absen Keluar</p>
                      <p className="text-sm text-blue-600">
                        Waktu: {todayAttendance.checkOut}
                      </p>
                    </div>
                  </div>
                </div>
              ) : todayAttendance.status === 'hadir' ? (
                <button
                  onClick={() => handleAttendance('check-out', 'hadir')}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Absen Keluar
                </button>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600 text-center">
                    {todayAttendance.status ? 'Tidak perlu absen keluar' : 'Absen masuk terlebih dahulu'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Riwayat Absensi</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {attendanceHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(record.status)}
                  <div>
                    <p className="font-medium text-gray-800">
                      {formatDate(record.date)}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {record.checkIn && (
                        <span>Masuk: {record.checkIn}</span>
                      )}
                      {record.checkOut && (
                        <span>Keluar: {record.checkOut}</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(record.status)}`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-800">Kehadiran</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">85%</p>
          <p className="text-sm text-gray-600">17 dari 20 hari</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Izin</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600">2</p>
          <p className="text-sm text-gray-600">hari izin</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-600" />
            <h3 className="font-semibold text-gray-800">Sakit</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">1</p>
          <p className="text-sm text-gray-600">hari sakit</p>
        </div>
      </div>
    </div>
  );
};

export default Attendance;