const express = require('express');
const { body, validationResult } = require('express-validator');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get attendance settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await getRow('SELECT * FROM attendance_settings ORDER BY id DESC LIMIT 1');
    
    if (!settings) {
      // Create default settings
      await runQuery(`
        INSERT INTO attendance_settings (bbpbat_latitude, bbpbat_longitude, allowed_radius) 
        VALUES (?, ?, ?)
      `, [-6.9175, 107.6191, 100]);
      
      settings = await getRow('SELECT * FROM attendance_settings ORDER BY id DESC LIMIT 1');
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get attendance settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user attendance records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;
    let query = 'SELECT * FROM attendance_records WHERE user_id = ?';
    let params = [req.user.id];

    if (dateFrom) {
      query += ' AND date >= ?';
      params.push(dateFrom);
    }

    if (dateTo) {
      query += ' AND date <= ?';
      params.push(dateTo);
    }

    query += ' ORDER BY date DESC';

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

// Create attendance record
router.post('/', authenticateToken, [
  body('date').isDate().withMessage('Valid date is required'),
  body('status').isIn(['hadir', 'izin', 'sakit', 'alpha']).withMessage('Valid status is required'),
  body('checkInTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required'),
  body('checkOutTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required'),
  body('checkInLatitude').optional().isFloat().withMessage('Valid latitude required'),
  body('checkInLongitude').optional().isFloat().withMessage('Valid longitude required'),
  body('checkOutLatitude').optional().isFloat().withMessage('Valid latitude required'),
  body('checkOutLongitude').optional().isFloat().withMessage('Valid longitude required'),
  body('checkInDistance').optional().isInt().withMessage('Valid distance required'),
  body('checkOutDistance').optional().isInt().withMessage('Valid distance required'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes too long')
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

    const {
      date,
      status,
      checkInTime,
      checkOutTime,
      checkInLatitude,
      checkInLongitude,
      checkOutLatitude,
      checkOutLongitude,
      checkInDistance,
      checkOutDistance,
      notes
    } = req.body;

    // Check if attendance already exists for this date
    const existingRecord = await getRow(
      'SELECT id FROM attendance_records WHERE user_id = ? AND date = ?',
      [req.user.id, date]
    );

    let result;
    if (existingRecord) {
      // Update existing record
      result = await runQuery(`
        UPDATE attendance_records SET 
          status = ?, check_in_time = ?, check_out_time = ?, 
          check_in_latitude = ?, check_in_longitude = ?, 
          check_out_latitude = ?, check_out_longitude = ?,
          check_in_distance = ?, check_out_distance = ?, 
          notes = ?, updated_at = ?
        WHERE id = ?
      `, [
        status, checkInTime, checkOutTime,
        checkInLatitude, checkInLongitude,
        checkOutLatitude, checkOutLongitude,
        checkInDistance, checkOutDistance,
        notes, new Date().toISOString(),
        existingRecord.id
      ]);
    } else {
      // Create new record
      result = await runQuery(`
        INSERT INTO attendance_records (
          user_id, date, status, check_in_time, check_out_time,
          check_in_latitude, check_in_longitude, check_out_latitude, check_out_longitude,
          check_in_distance, check_out_distance, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        req.user.id, date, status, checkInTime, checkOutTime,
        checkInLatitude, checkInLongitude, checkOutLatitude, checkOutLongitude,
        checkInDistance, checkOutDistance, notes
      ]);
    }

    // Get the updated/created record
    const record = await getRow(
      'SELECT * FROM attendance_records WHERE user_id = ? AND date = ?',
      [req.user.id, date]
    );

    res.json({
      success: true,
      message: existingRecord ? 'Attendance updated successfully' : 'Attendance recorded successfully',
      data: record
    });
  } catch (error) {
    console.error('Create/update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get attendance statistics for user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    // Monthly stats
    const monthlyStats = await getRow(`
      SELECT 
        COUNT(*) as total_days,
        COUNT(CASE WHEN status = 'hadir' THEN 1 END) as hadir,
        COUNT(CASE WHEN status = 'izin' THEN 1 END) as izin,
        COUNT(CASE WHEN status = 'sakit' THEN 1 END) as sakit,
        COUNT(CASE WHEN status = 'alpha' THEN 1 END) as alpha
      FROM attendance_records 
      WHERE user_id = ? AND date >= ? AND date < ?
    `, [req.user.id, currentMonth.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]]);

    // Calculate attendance percentage
    const attendancePercentage = monthlyStats.total_days > 0 
      ? Math.round((monthlyStats.hadir / monthlyStats.total_days) * 100) 
      : 0;

    // Today's attendance
    const todayDate = today.toISOString().split('T')[0];
    const todayAttendance = await getRow(
      'SELECT * FROM attendance_records WHERE user_id = ? AND date = ?',
      [req.user.id, todayDate]
    );

    res.json({
      success: true,
      data: {
        ...monthlyStats,
        attendancePercentage,
        todayStatus: todayAttendance?.status || null,
        todayCheckIn: todayAttendance?.check_in_time || null,
        todayCheckOut: todayAttendance?.check_out_time || null
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

module.exports = router;