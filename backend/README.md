# BBPBAT Backend API

Django REST API untuk sistem manajemen bimbingan teknis BBPBAT.

## 🚀 Quick Start

### 1. Setup Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

### 2. Environment Variables
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

### 3. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 4. Run Development Server
```bash
python manage.py runserver
```

API akan tersedia di: `http://localhost:8000`

## 📚 API Documentation

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **Schema**: `http://localhost:8000/api/schema/`

## 🔐 Authentication

### User Login
```bash
POST /api/auth/login/
{
    "username": "pelajar001",
    "access_code": "BBPBAT2025"
}
```

### Admin Login
```bash
POST /api/auth/admin-login/
{
    "username": "admin_bbpbat",
    "password": "AdminBBPBAT2025!"
}
```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/admin-login/` - Admin login
- `POST /api/auth/logout/` - Logout
- `POST /api/auth/token/refresh/` - Refresh token

### User Management
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/update/` - Update user profile
- `GET /api/auth/documents/` - List user documents
- `POST /api/auth/documents/` - Upload document

### Registrations
- `GET /api/registrations/placement-units/` - List placement units
- `POST /api/registrations/student/` - Student registration
- `POST /api/registrations/general/` - General registration
- `GET /api/registrations/` - List registrations (Admin)
- `POST /api/registrations/{id}/approve/` - Approve registration

### Attendance
- `GET /api/attendance/` - List attendance records
- `POST /api/attendance/` - Create attendance record
- `GET /api/attendance/stats/` - Attendance statistics

### Reports
- `GET /api/reports/` - List reports
- `POST /api/reports/` - Submit report
- `PUT /api/reports/{id}/` - Update report

### Certificates
- `GET /api/certificates/` - List certificates
- `POST /api/certificates/generate/` - Generate certificate

### Announcements
- `GET /api/announcements/` - List announcements
- `POST /api/announcements/` - Create announcement (Admin)

## 🗄️ Database Models

### User
- Custom user model dengan user_type (student/general/admin)
- Profile completion tracking
- Document completion tracking

### Registration
- Pendaftaran peserta dengan approval workflow
- Placement unit management dengan quota system
- Status tracking (pending → approved → active → completed → graduated)

### Attendance
- GPS-based attendance dengan location verification
- Multiple status (hadir, izin, sakit, alpha)
- Daily attendance tracking

### Reports
- Upload dan review laporan PKL
- Status tracking dan feedback system

### Certificates
- Auto-generated certificates dengan unique numbers
- Template management

## 🔧 Development

### Add New App
```bash
python manage.py startapp app_name
```

### Create Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Run Tests
```bash
python manage.py test
```

### Collect Static Files
```bash
python manage.py collectstatic
```

## 🚀 Deployment

### Environment Variables (Production)
```bash
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/dbname
```

### Deploy to Railway/Heroku
```bash
# Install gunicorn
pip install gunicorn

# Create Procfile
echo "web: gunicorn bbpbat_backend.wsgi" > Procfile

# Deploy
git push railway main  # atau heroku main
```

## 📁 Project Structure

```
backend/
├── bbpbat_backend/          # Main project
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL config
│   └── wsgi.py              # WSGI config
├── users/                   # User management
├── registrations/           # Registration system
├── attendance/              # Attendance tracking
├── reports/                 # Report management
├── certificates/            # Certificate system
├── announcements/           # Announcement system
├── media/                   # Uploaded files
├── static/                  # Static files
├── requirements.txt         # Dependencies
└── manage.py               # Django management
```

## 🔒 Security Features

- JWT Authentication
- CORS protection
- File upload validation
- SQL injection protection
- XSS protection
- CSRF protection

## 📞 Support

Untuk bantuan development:
- Email: dev@bbpbat.go.id
- Documentation: `/api/docs/`