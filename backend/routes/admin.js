const express = require('express');
const { body, validationResult } = require('express-validator');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get all registrations
router.get('/registrations', async (req, res) => {
  try {
    const { status, userType } = req.query;
    
    let query = `
      SELECT r.*, u.user_type, u.username, u.access_code, pu.name as placement_unit_name
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      JOIN placement_units pu ON r.placement_unit_id = pu.id
      WHERE 1=1
    `;
    let params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    if (userType) {
      query += ' AND u.user_type = ?';
      params.push(userType === 'student' ? 'pelajar' : 'umum');
    }

    query += ' ORDER BY r.created_at DESC';

    const registrations = await getAllRows(query, params);

    res.json({
      success: true,
      data: registrations
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Approve registration
router.post('/registrations/:id/approve', [
  body('status').isIn(['approved', 'rejected']).withMessage('Valid status is required'),
  body('rejectionReason').optional().isLength({ max: 500 }).withMessage('Rejection reason too long'),
  body('startDate').optional().isDate().withMessage('Valid start date required'),
  body('endDate').optional().isDate().withMessage('Valid end date required'),
  body('adminNotes').optional().isLength({ max: 1000 }).withMessage('Admin notes too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const registrationId = req.params.id;
    const { status, rejectionReason, startDate, endDate, adminNotes } = req.body;

    // Get registration
    const registration = await getRow(
      'SELECT r.*, u.user_type FROM registrations r JOIN users u ON r.user_id = u.id WHERE r.id = ?',
      [registrationId]
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Update registration
    await runQuery(`
      UPDATE registrations SET 
        status = ?, approved_by = ?, approved_at = ?, 
        rejection_reason = ?, start_date = ?, end_date = ?, 
        admin_notes = ?, updated_at = ?
      WHERE id = ?
    `, [
      status,
      req.user.id,
      new Date().toISOString(),
      rejectionReason || null,
      startDate || null,
      endDate || null,
      adminNotes || null,
      new Date().toISOString(),
      registrationId
    ]);

    // If approved, generate username and access code
    if (status === 'approved') {
      const userType = registration.user_type;
      const prefix = userType === 'pelajar' ? 'pelajar' : 'umum';
      
      // Count existing users of this type
      const count = await getRow(
        'SELECT COUNT(*) as count FROM users WHERE user_type = ? AND username LIKE ?',
        [userType, `${prefix}%`]
      );

      const username = `${prefix}${String(count.count + 1).padStart(3, '0')}`;
      const accessCode = process.env.DEMO_ACCESS_CODE;

      // Update user with proper username and access code
      await runQuery(
        'UPDATE users SET username = ?, access_code = ?, updated_at = ? WHERE id = ?',
        [username, accessCode, new Date().toISOString(), registration.user_id]
      );
    }

    // Get updated registration
    const updatedRegistration = await getRow(
      `SELECT r.*, u.user_type, u.username, u.access_code, pu.name as placement_unit_name
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       JOIN placement_units pu ON r.placement_unit_id = pu.id
       WHERE r.id = ?`,
      [registrationId]
    );

    res.json({
      success: true,
      message: `Registration ${status} successfully`,
      data: updatedRegistration
    });
  } catch (error) {
    console.error('Approve registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all attendance records
router.get('/attendance', async (req, res) => {
  try {
    const { date, userType, status } = req.query;
    
    let query = `
      SELECT ar.*, u.username, up.full_name, u.user_type, pu.name as placement_unit
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN registrations r ON u.id = r.user_id
      LEFT JOIN placement_units pu ON r.placement_unit_id = pu.id
      WHERE 1=1
    `;
    let params = [];

    if (date) {
      query += ' AND ar.date = ?';
      params.push(date);
    }

    if (userType) {
      query += ' AND u.user_type = ?';
      params.push(userType === 'student' ? 'pelajar' : 'umum');
    }

    if (status) {
      query += ' AND ar.status = ?';
      params.push(status);
    }

    query += ' ORDER BY ar.date DESC, u.username';

    const records = await getAllRows(query, params);

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Get attendance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get attendance statistics
router.get('/attendance/stats', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date();
    currentMonth.setDate(1);
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    // Today's stats
    const todayStats = await getRow(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'hadir' THEN 1 END) as hadir,
        COUNT(CASE WHEN status = 'izin' THEN 1 END) as izin,
        COUNT(CASE WHEN status = 'sakit' THEN 1 END) as sakit,
        COUNT(CASE WHEN status = 'alpha' THEN 1 END) as alpha
      FROM attendance_records 
      WHERE date = ?
    `, [today]);

    // Monthly stats
    const monthlyStats = await getRow(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'hadir' THEN 1 END) as hadir,
        COUNT(CASE WHEN status = 'izin' THEN 1 END) as izin,
        COUNT(CASE WHEN status = 'sakit' THEN 1 END) as sakit,
        COUNT(CASE WHEN status = 'alpha' THEN 1 END) as alpha
      FROM attendance_records 
      WHERE date >= ? AND date < ?
    `, [currentMonth.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]]);

    // By user type
    const studentStats = await getRow(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN ar.status = 'hadir' THEN 1 END) as hadir,
        COUNT(CASE WHEN ar.status = 'izin' THEN 1 END) as izin,
        COUNT(CASE WHEN ar.status = 'sakit' THEN 1 END) as sakit,
        COUNT(CASE WHEN ar.status = 'alpha' THEN 1 END) as alpha
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      WHERE u.user_type = 'pelajar' AND ar.date >= ? AND ar.date < ?
    `, [currentMonth.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]]);

    const generalStats = await getRow(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN ar.status = 'hadir' THEN 1 END) as hadir,
        COUNT(CASE WHEN ar.status = 'izin' THEN 1 END) as izin,
        COUNT(CASE WHEN ar.status = 'sakit' THEN 1 END) as sakit,
        COUNT(CASE WHEN ar.status = 'alpha' THEN 1 END) as alpha
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      WHERE u.user_type = 'umum' AND ar.date >= ? AND ar.date < ?
    `, [currentMonth.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]]);

    res.json({
      success: true,
      data: {
        today: todayStats,
        monthly: monthlyStats,
        student: studentStats,
        general: generalStats
      }
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all reports
router.get('/reports', async (req, res) => {
  try {
    const { status, userType, reportType } = req.query;
    
    let query = `
      SELECT r.*, u.username, up.full_name, u.user_type
      FROM reports r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE 1=1
    `;
    let params = [];

    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }

    if (userType) {
      query += ' AND u.user_type = ?';
      params.push(userType === 'student' ? 'pelajar' : 'umum');
    }

    if (reportType) {
      query += ' AND r.report_type = ?';
      params.push(reportType);
    }

    query += ' ORDER BY r.created_at DESC';

    const reports = await getAllRows(query, params);

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Review report
router.put('/reports/:id', [
  body('status').isIn(['under_review', 'approved', 'rejected', 'revision_required']).withMessage('Valid status is required'),
  body('feedback').optional().isLength({ max: 1000 }).withMessage('Feedback too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const reportId = req.params.id;
    const { status, feedback } = req.body;

    // Update report
    await runQuery(`
      UPDATE reports SET 
        status = ?, reviewed_by = ?, reviewed_at = ?, 
        feedback = ?, updated_at = ?
      WHERE id = ?
    `, [
      status,
      req.user.id,
      new Date().toISOString(),
      feedback || null,
      new Date().toISOString(),
      reportId
    ]);

    // Get updated report
    const updatedReport = await getRow(
      `SELECT r.*, u.username, up.full_name, u.user_type
       FROM reports r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE r.id = ?`,
      [reportId]
    );

    res.json({
      success: true,
      message: 'Report reviewed successfully',
      data: updatedReport
    });
  } catch (error) {
    console.error('Review report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Generate certificate
router.post('/certificates/generate/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if certificate already exists
    const existingCertificate = await getRow(
      'SELECT id FROM certificates WHERE user_id = ?',
      [userId]
    );

    if (existingCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already exists for this user'
      });
    }

    // Get user and registration data
    const userData = await getRow(`
      SELECT u.*, up.full_name, r.start_date, r.end_date, pu.name as placement_unit
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN registrations r ON u.id = r.user_id
      LEFT JOIN placement_units pu ON r.placement_unit_id = pu.id
      WHERE u.id = ?
    `, [userId]);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate attendance percentage (mock calculation)
    const attendanceStats = await getRow(`
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'hadir' THEN 1 END) as present_days
      FROM attendance_records 
      WHERE user_id = ?
    `, [userId]);

    const attendancePercentage = attendanceStats.total_days > 0 
      ? (attendanceStats.present_days / attendanceStats.total_days) * 100 
      : 0;

    // Generate certificate number
    const year = new Date().getFullYear();
    const count = await getRow(
      'SELECT COUNT(*) as count FROM certificates WHERE strftime("%Y", issued_at) = ?',
      [year.toString()]
    );
    const certificateNumber = `BBPBAT/CERT/${year}/${String(count.count + 1).padStart(4, '0')}`;

    // Generate verification code
    const verificationCode = uuidv4().replace(/-/g, '').substring(0, 12).toUpperCase();

    // Create certificate
    const result = await runQuery(`
      INSERT INTO certificates (
        user_id, certificate_number, participant_name, institution_name, 
        placement_unit, training_period_start, training_period_end,
        final_score, attendance_percentage, verification_code, issued_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      certificateNumber,
      userData.full_name || userData.username,
      userData.institution,
      userData.placement_unit,
      userData.start_date,
      userData.end_date,
      85.0, // Mock final score
      attendancePercentage,
      verificationCode,
      req.user.id
    ]);

    const certificate = await getRow(
      'SELECT * FROM certificates WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully',
      data: certificate
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get certificate statistics
router.get('/certificates/stats', async (req, res) => {
  try {
    const stats = await getRow(`
      SELECT 
        COUNT(*) as total_certificates,
        COUNT(CASE WHEN u.user_type = 'pelajar' THEN 1 END) as student_certificates,
        COUNT(CASE WHEN u.user_type = 'umum' THEN 1 END) as general_certificates,
        COUNT(CASE WHEN c.is_verified = 1 THEN 1 END) as verified_certificates
      FROM certificates c
      JOIN users u ON c.user_id = u.id
    `);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get certificate stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;