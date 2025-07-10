# Conference Management System - Backend

This is the backend API for the Conference Management System built with Node.js, Express, and SQLite.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Initialize the database:
```bash
npm run init-db
```

4. Seed initial data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations` - Get user registrations

### Attendance
- `GET /api/attendance` - Get user attendance
- `POST /api/attendance` - Mark attendance

### Reports
- `GET /api/reports` - Get user reports
- `POST /api/reports/upload` - Upload report

### Certificates
- `GET /api/certificates` - Get user certificates
- `POST /api/certificates/request` - Request certificate

### Announcements
- `GET /api/announcements` - Get all announcements

### Admin Routes
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/registrations` - Get all registrations (admin only)
- `PUT /api/admin/registrations/:id/status` - Update registration status (admin only)
- `POST /api/admin/announcements` - Create announcement (admin only)

## Default Admin Credentials

- Email: admin@conference.com
- Password: admin123