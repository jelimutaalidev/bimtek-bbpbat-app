# WEB BIMTEK BBPBAT

**Modern Training Management System** untuk Balai Besar Perikanan Budidaya Air Tawar (BBPBAT)

## 🚀 Overview

Sistem manajemen bimbingan teknis digital yang komprehensif untuk mengelola seluruh kegiatan pelatihan di BBPBAT, mulai dari pendaftaran hingga penerbitan sertifikat.

## ✨ Features

### 👥 **Multi-User System**
- **Peserta Pelajar/Mahasiswa** - Sistem PKL dengan pembimbing
- **Peserta Masyarakat Umum/Dinas** - Pelatihan berbayar
- **Admin Panel** - Management system lengkap

### 📋 **Registration Management**
- Pendaftaran online dengan upload berkas
- Sistem kuota per unit penempatan
- Approval workflow untuk admin
- WhatsApp notifications

### 👤 **Profile Management**
- Profil lengkap dengan validasi
- Upload dokumen wajib
- Status completion tracking
- Health information management

### 📍 **Attendance System**
- Geolocation-based check-in/out
- Multiple status (hadir, izin, sakit, alpha)
- Location verification dengan radius
- Real-time attendance tracking

### 📊 **Report Management**
- Upload laporan PKL/kegiatan
- Review workflow untuk admin
- Status tracking dan feedback
- Document management

### 🏆 **Certificate System**
- Auto-generated certificates
- Unique certificate numbers
- PDF download capability
- Template management

### 💳 **Payment System** (Masyarakat Umum)
- Upload bukti pembayaran
- Payment verification workflow
- Bank transfer integration
- Receipt management

### 🔐 **Admin Panel**
- Dashboard dengan analytics
- User management
- Registration approval
- Attendance monitoring
- Report review system
- Certificate generation
- Announcement management

## 🛠️ Tech Stack

### **Frontend**
- **React 18** dengan TypeScript
- **Tailwind CSS** untuk styling
- **Lucide React** untuk icons
- **Vite** sebagai build tool
- **Responsive Design** untuk semua device

### **Backend** (Coming Soon)
- **Django** dengan Python
- **Django REST Framework** untuk API
- **PostgreSQL** database
- **JWT Authentication**
- **File Upload** handling
- **Email & WhatsApp** notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/web-bimtek-bbpbat.git
cd web-bimtek-bbpbat
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:5173
```

## 🔑 Demo Credentials

### **Peserta Pelajar**
- Username: `pelajar001`
- Kode Akses: `BBPBAT2025`

### **Peserta Masyarakat Umum**
- Username: `umum001`
- Kode Akses: `BBPBAT2025`

### **Admin**
- Username: `admin_bbpbat`
- Password: `AdminBBPBAT2025!`

## 📱 Features Overview

### **Landing Page**
- Hero section dengan informasi BBPBAT
- Periode pendaftaran
- Quick access ke login dan pendaftaran
- Contact information

### **Registration Flow**
1. Pilih jenis pendaftaran (Pelajar/Umum)
2. Isi formulir lengkap
3. Upload berkas wajib
4. Submit untuk review admin
5. Terima notifikasi approval

### **Main Dashboard**
- Overview statistik personal
- Jadwal mendatang
- Aktivitas terbaru
- Quick actions
- Progress tracking

### **Profile Management**
- Tab-based interface (Personal, Institution, PKL/Bimtek, Health)
- Real-time validation
- Auto-save functionality
- Completion status tracking

### **Document Management**
- Drag & drop upload
- File type validation
- Progress tracking
- Download capability
- Status indicators

### **Attendance System**
- GPS-based location verification
- Multiple check-in options
- History tracking
- Statistics dashboard
- Real-time status updates

## 🎨 Design Principles

- **Modern & Clean** - Apple-level design aesthetics
- **Responsive** - Mobile-first approach
- **Accessible** - WCAG compliance
- **Intuitive** - User-friendly navigation
- **Professional** - Corporate-grade appearance

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin panel components
│   ├── main/            # Main dashboard components
│   └── ...              # Other components
├── App.tsx              # Main app component
├── main.tsx             # Entry point
└── index.css            # Global styles

backend/                 # Django backend (coming soon)
├── bbpbat_backend/      # Main Django project
├── users/               # User management
├── registrations/       # Registration system
├── attendance/          # Attendance tracking
├── reports/             # Report management
└── certificates/        # Certificate system
```

## 🔄 Development Workflow

1. **Feature Development** - Create feature branches
2. **Code Review** - Pull request process
3. **Testing** - Comprehensive testing
4. **Deployment** - Automated CI/CD

## 🚀 Deployment

### **Frontend**
- Vercel/Netlify untuk hosting
- Environment variables untuk configuration
- CDN untuk static assets

### **Backend** (Coming Soon)
- Railway/Heroku untuk Django
- PostgreSQL database
- Redis untuk caching
- AWS S3 untuk file storage

## 📞 Support

Untuk bantuan dan pertanyaan:
- **Email**: info@bbpbat.go.id
- **WhatsApp**: +62 812 3456 7890
- **Website**: https://bbpbat.go.id

## 📄 License

© 2025 BBPBAT - Balai Besar Perikanan Budidaya Air Tawar

---

**Built with ❤️ for BBPBAT Community**