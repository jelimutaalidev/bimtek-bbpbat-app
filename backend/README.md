# BBPBAT Backend API

Backend API untuk Sistem Bimbingan Teknis BBPBAT menggunakan Node.js, Express.js, dan SQLite.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env file if needed
```

### 3. Initialize Database
```bash
npm run init-db
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

API akan tersedia di: `http://localhost:3001`

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
Semua endpoint yang memerlukan autentikasi menggunakan JWT Bearer token:
```
Authorization: Bearer <your-jwt-token>
```

## 🔐 Demo Credentials

### Peserta Pelajar
- **Username**: `pelajar001`
- **Access Code**: `BBPBAT2025`

### Peserta Masyarakat Umum
- **Username**: `umum001`
- **Access Code**: `BBPBAT2025`

### Admin
- **Username**: `admin_bbpbat`
- **Password**: `AdminBBPBAT2025!`

## 📋 API Endpoints

### 🔐 Authentication
```
POST   /api/auth/login              # User login (username + access code)
POST   /api/auth/admin-login        # Admin login (username + password)
GET    /api/auth/profile            # Get current user profile
POST   /api/auth/refresh            # Refresh JWT token
POST   /api/auth/logout             # Logout
```

### 👥 User Management
```
GET    /api/users/profile           # Get user profile
PUT    /api/users/profile           # Update user profile
GET    /api/users/documents         # Get user documents
PUT    /api/users/status            # Update user completion status
```

### 📝 Registrations
```
GET    /api/registrations/placement-units    # Get placement units with quotas
POST   /api/registrations/student            # Student registration
POST   /api/registrations/general            # General registration
GET    /api/registrations/stats              # Registration statistics
```

### ⏰ Attendance
```
GET    /api/attendance/settings     # Get attendance settings (GPS location, etc.)
GET    /api/attendance              # Get user attendance records
POST   /api/attendance              # Create/update attendance record
GET    /api/attendance/stats        # Get attendance statistics
```

### 📄 Reports
```
GET    /api/reports                 # Get user reports
POST   /api/reports                 # Create new report
PUT    /api/reports/:id             # Update report
DELETE /api/reports/:id             # Delete report (draft only)
GET    /api/reports/stats           # Get report statistics
```

### 🏆 Certificates
```
GET    /api/certificates            # Get user certificate
GET    /api/certificates/verify/:code    # Verify certificate by code
GET    /api/certificates/download   # Download certificate file
```

### 📢 Announcements
```
GET    /api/announcements           # Get announcements for user
GET    /api/announcements/:id       # Get announcement detail
POST   /api/announcements/:id/read  # Mark announcement as read
GET    /api/announcements/unread/count   # Get unread count
```

### 🔧 Admin Endpoints
```
GET    /api/admin/registrations     # Get all registrations
POST   /api/admin/registrations/:id/approve  # Approve/reject registration
GET    /api/admin/attendance        # Get all attendance records
GET    /api/admin/attendance/stats  # Get attendance statistics
GET    /api/admin/reports           # Get all reports
PUT    /api/admin/reports/:id       # Review report
POST   /api/admin/certificates/generate/:userId  # Generate certificate
GET    /api/admin/certificates/stats # Get certificate statistics
```

## 🗄️ Database Schema

### Users
- User authentication dan basic info
- Support untuk 3 user types: `pelajar`, `umum`, `admin`

### User Profiles
- Detail profil lengkap peserta
- Informasi institusi dan pembimbing
- Rencana PKL/Bimtek

### Documents
- File upload management
- Document verification status

### Registrations
- Pendaftaran peserta dengan approval workflow
- Placement unit management dengan quota system

### Attendance Records
- GPS-based attendance tracking
- Multiple status support

### Reports
- Report submission dan review system
- File attachment support

### Certificates
- Auto-generated certificates
- Verification system

### Announcements
- Announcement management
- Read tracking

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── registrations.js     # Registration routes
│   ├── attendance.js        # Attendance routes
│   ├── reports.js           # Report routes
│   ├── certificates.js      # Certificate routes
│   ├── announcements.js     # Announcement routes
│   └── admin.js             # Admin routes
├── scripts/
│   ├── initDatabase.js      # Database initialization
│   └── seedData.js          # Sample data seeding
├── uploads/                 # File upload directory
├── database/                # SQLite database files
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies
└── server.js               # Main server file
```

## 🔧 Development

### Available Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run init-db    # Initialize database schema
npm run seed       # Seed database with sample data
```

### Environment Variables
```bash
PORT=3001                    # Server port
NODE_ENV=development         # Environment
JWT_SECRET=your-secret       # JWT secret key
DB_PATH=./database/bbpbat.db # Database file path
UPLOAD_PATH=./uploads        # Upload directory
FRONTEND_URL=http://localhost:5173  # Frontend URL for CORS
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- File upload validation
- SQL injection protection
- Rate limiting
- CORS protection
- Helmet security headers

## 📊 Features

### ✅ Implemented
- User authentication (username + access code)
- Admin authentication (username + password)
- User profile management
- Registration system dengan approval
- Placement unit quota management
- GPS-based attendance system
- Report submission dan review
- Certificate generation
- Announcement system
- File upload handling

### 🚧 Future Enhancements
- Email notifications
- WhatsApp integration
- PDF certificate generation
- Advanced reporting
- Backup system
- API rate limiting per user

## 🐛 Troubleshooting

### Database Issues
```bash
# Reset database
rm -rf database/
npm run init-db
npm run seed
```

### File Upload Issues
```bash
# Check upload directory permissions
mkdir -p uploads
chmod 755 uploads
```

### Port Already in Use
```bash
# Change port in .env file
PORT=3002
```

## 📞 Support

Untuk bantuan development:
- Check logs di console
- Periksa file `.env` configuration
- Pastikan database sudah di-seed
- Verify file permissions untuk uploads

---

**Built with ❤️ for BBPBAT Community**