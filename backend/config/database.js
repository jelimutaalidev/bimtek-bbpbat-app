const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './database/bbpbat.db';
const DB_DIR = path.dirname(DB_PATH);

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Database initialization
async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT,
          password_hash TEXT,
          access_code TEXT,
          user_type TEXT CHECK(user_type IN ('pelajar', 'umum', 'admin')) NOT NULL,
          phone_number TEXT,
          institution TEXT,
          is_active BOOLEAN DEFAULT 1,
          profile_complete BOOLEAN DEFAULT 0,
          documents_complete BOOLEAN DEFAULT 0,
          payment_complete BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // User profiles table
      db.run(`
        CREATE TABLE IF NOT EXISTS user_profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER UNIQUE,
          full_name TEXT,
          address TEXT,
          place_of_birth TEXT,
          date_of_birth DATE,
          blood_type TEXT,
          parent_name TEXT,
          parent_phone TEXT,
          institution_name TEXT,
          student_id TEXT,
          institution_address TEXT,
          institution_email TEXT,
          institution_phone TEXT,
          supervisor_name TEXT,
          supervisor_phone TEXT,
          supervisor_email TEXT,
          planned_start_date DATE,
          planned_end_date DATE,
          placement_unit TEXT,
          medical_history TEXT,
          special_needs TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
      `);

      // Documents table
      db.run(`
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          document_type TEXT NOT NULL,
          original_filename TEXT NOT NULL,
          stored_filename TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_size INTEGER,
          mime_type TEXT,
          is_verified BOOLEAN DEFAULT 0,
          verified_by INTEGER,
          verified_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (verified_by) REFERENCES users (id),
          UNIQUE(user_id, document_type)
        )
      `);

      // Placement units table
      db.run(`
        CREATE TABLE IF NOT EXISTS placement_units (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          student_quota INTEGER DEFAULT 10,
          general_quota INTEGER DEFAULT 5,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Registrations table
      db.run(`
        CREATE TABLE IF NOT EXISTS registrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER UNIQUE,
          placement_unit_id INTEGER,
          full_name TEXT NOT NULL,
          institution TEXT NOT NULL,
          phone_number TEXT NOT NULL,
          supervisor_name TEXT,
          supervisor_phone TEXT,
          application_letter_path TEXT,
          status TEXT CHECK(status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'graduated')) DEFAULT 'pending',
          approved_by INTEGER,
          approved_at DATETIME,
          rejection_reason TEXT,
          start_date DATE,
          end_date DATE,
          admin_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (placement_unit_id) REFERENCES placement_units (id),
          FOREIGN KEY (approved_by) REFERENCES users (id)
        )
      `);

      // Attendance records table
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance_records (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          date DATE,
          status TEXT CHECK(status IN ('hadir', 'izin', 'sakit', 'alpha')) NOT NULL,
          check_in_time TIME,
          check_out_time TIME,
          check_in_latitude REAL,
          check_in_longitude REAL,
          check_out_latitude REAL,
          check_out_longitude REAL,
          check_in_distance INTEGER,
          check_out_distance INTEGER,
          notes TEXT,
          admin_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(user_id, date)
        )
      `);

      // Reports table
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          title TEXT NOT NULL,
          report_type TEXT CHECK(report_type IN ('daily', 'weekly', 'monthly', 'final')) DEFAULT 'daily',
          content TEXT NOT NULL,
          file_path TEXT,
          status TEXT CHECK(status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'revision_required')) DEFAULT 'draft',
          reviewed_by INTEGER,
          reviewed_at DATETIME,
          feedback TEXT,
          report_date DATE NOT NULL,
          submission_date DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (reviewed_by) REFERENCES users (id)
        )
      `);

      // Certificates table
      db.run(`
        CREATE TABLE IF NOT EXISTS certificates (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER UNIQUE,
          certificate_number TEXT UNIQUE,
          participant_name TEXT NOT NULL,
          institution_name TEXT NOT NULL,
          placement_unit TEXT NOT NULL,
          training_period_start DATE NOT NULL,
          training_period_end DATE NOT NULL,
          final_score REAL,
          attendance_percentage REAL NOT NULL,
          completion_status TEXT DEFAULT 'Completed',
          certificate_file_path TEXT,
          issued_by INTEGER,
          issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_verified BOOLEAN DEFAULT 1,
          verification_code TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          FOREIGN KEY (issued_by) REFERENCES users (id)
        )
      `);

      // Announcements table
      db.run(`
        CREATE TABLE IF NOT EXISTS announcements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
          target_audience TEXT CHECK(target_audience IN ('all', 'student', 'general', 'specific_placement')) DEFAULT 'all',
          specific_placement TEXT,
          status TEXT CHECK(status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
          created_by INTEGER,
          published_at DATETIME,
          expires_at DATETIME,
          attachment_path TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users (id)
        )
      `);

      // Announcement reads table (track who read what)
      db.run(`
        CREATE TABLE IF NOT EXISTS announcement_reads (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          announcement_id INTEGER,
          user_id INTEGER,
          read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (announcement_id) REFERENCES announcements (id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(announcement_id, user_id)
        )
      `);

      // Attendance settings table
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bbpbat_latitude REAL DEFAULT -6.9175,
          bbpbat_longitude REAL DEFAULT 107.6191,
          allowed_radius INTEGER DEFAULT 100,
          check_in_start_time TIME DEFAULT '07:00:00',
          check_in_end_time TIME DEFAULT '09:00:00',
          check_out_start_time TIME DEFAULT '15:00:00',
          check_out_end_time TIME DEFAULT '17:00:00',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}

// Helper function to run queries
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

// Helper function to get single row
function getRow(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get all rows
function getAllRows(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  initializeDatabase,
  runQuery,
  getRow,
  getAllRows
};