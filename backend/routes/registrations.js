const express = require('express');
const { body, validationResult } = require('express-validator');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadApplicationLetter } = require('../middleware/upload');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get placement units
router.get('/placement-units', async (req, res) => {
  try {
    const placementUnits = await getAllRows(
      'SELECT * FROM placement_units WHERE is_active = 1 ORDER BY name'
    );

    // Calculate used quotas
    const unitsWithQuotas = await Promise.all(
      placementUnits.map(async (unit) => {
        const studentUsed = await getRow(
          `SELECT COUNT(*) as count FROM registrations r 
           JOIN users u ON r.user_id = u.id 
           WHERE r.placement_unit_id = ? AND u.user_type = 'pelajar' 
           AND r.status IN ('approved', 'active', 'completed')`,
          [unit.id]
        );

        const generalUsed = await getRow(
          `SELECT COUNT(*) as count FROM registrations r 
           JOIN users u ON r.user_id = u.id 
           WHERE r.placement_unit_id = ? AND u.user_type = 'umum' 
           AND r.status IN ('approved', 'active', 'completed')`,
          [unit.id]
        );

        return {
          ...unit,
          studentUsedQuota: studentUsed.count,
          generalUsedQuota: generalUsed.count,
          studentAvailableQuota: Math.max(0, unit.student_quota - studentUsed.count),
          generalAvailableQuota: Math.max(0, unit.general_quota - generalUsed.count)
        };
      })
    );

    res.json({
      success: true,
      data: unitsWithQuotas
    });
  } catch (error) {
    console.error('Get placement units error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Student registration
router.post('/student', uploadApplicationLetter, [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('institution').notEmpty().withMessage('Institution is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('supervisorName').optional(),
  body('supervisorPhone').optional(),
  body('placementUnit').notEmpty().withMessage('Placement unit is required')
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

    const { fullName, institution, phoneNumber, supervisorName, supervisorPhone, placementUnit } = req.body;

    // Find placement unit
    const unit = await getRow(
      'SELECT * FROM placement_units WHERE name = ? AND is_active = 1',
      [placementUnit]
    );

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placement unit'
      });
    }

    // Check quota
    const usedQuota = await getRow(
      `SELECT COUNT(*) as count FROM registrations r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.placement_unit_id = ? AND u.user_type = 'pelajar' 
       AND r.status IN ('approved', 'active', 'completed')`,
      [unit.id]
    );

    if (usedQuota.count >= unit.student_quota) {
      return res.status(400).json({
        success: false,
        message: 'Placement unit quota is full'
      });
    }

    // Create user
    const tempEmail = `temp_${phoneNumber.replace(/[^0-9]/g, '')}@bbpbat.temp`;
    const tempUsername = `temp_${uuidv4().substring(0, 8)}`;

    const userResult = await runQuery(
      `INSERT INTO users (username, email, user_type, phone_number, institution, access_code) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tempUsername, tempEmail, 'pelajar', phoneNumber, institution, process.env.DEMO_ACCESS_CODE]
    );

    // Create registration
    const registrationResult = await runQuery(
      `INSERT INTO registrations (user_id, placement_unit_id, full_name, institution, phone_number, 
       supervisor_name, supervisor_phone, application_letter_path, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.id,
        unit.id,
        fullName,
        institution,
        phoneNumber,
        supervisorName,
        supervisorPhone,
        req.file ? req.file.path : null,
        'pending'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Student registration submitted successfully',
      data: {
        registrationId: registrationResult.id,
        userId: userResult.id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// General registration
router.post('/general', uploadApplicationLetter, [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('institution').notEmpty().withMessage('Institution is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('placementUnit').notEmpty().withMessage('Placement unit is required')
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

    const { fullName, institution, phoneNumber, placementUnit } = req.body;

    // Find placement unit
    const unit = await getRow(
      'SELECT * FROM placement_units WHERE name = ? AND is_active = 1',
      [placementUnit]
    );

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: 'Invalid placement unit'
      });
    }

    // Check quota
    const usedQuota = await getRow(
      `SELECT COUNT(*) as count FROM registrations r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.placement_unit_id = ? AND u.user_type = 'umum' 
       AND r.status IN ('approved', 'active', 'completed')`,
      [unit.id]
    );

    if (usedQuota.count >= unit.general_quota) {
      return res.status(400).json({
        success: false,
        message: 'Placement unit quota is full'
      });
    }

    // Create user
    const tempEmail = `temp_${phoneNumber.replace(/[^0-9]/g, '')}@bbpbat.temp`;
    const tempUsername = `temp_${uuidv4().substring(0, 8)}`;

    const userResult = await runQuery(
      `INSERT INTO users (username, email, user_type, phone_number, institution, access_code) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tempUsername, tempEmail, 'umum', phoneNumber, institution, process.env.DEMO_ACCESS_CODE]
    );

    // Create registration
    const registrationResult = await runQuery(
      `INSERT INTO registrations (user_id, placement_unit_id, full_name, institution, phone_number, 
       application_letter_path, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.id,
        unit.id,
        fullName,
        institution,
        phoneNumber,
        req.file ? req.file.path : null,
        'pending'
      ]
    );

    res.status(201).json({
      success: true,
      message: 'General registration submitted successfully',
      data: {
        registrationId: registrationResult.id,
        userId: userResult.id,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('General registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get registration statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getRow(`
      SELECT 
        COUNT(*) as total_registrations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_registrations,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_registrations,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_participants,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_participants,
        COUNT(CASE WHEN status = 'graduated' THEN 1 END) as graduated_participants
      FROM registrations
    `);

    const userTypeStats = await getAllRows(`
      SELECT 
        u.user_type,
        COUNT(*) as count
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      GROUP BY u.user_type
    `);

    const placementStats = await getAllRows(`
      SELECT 
        pu.name,
        pu.student_quota,
        pu.general_quota,
        COUNT(CASE WHEN u.user_type = 'pelajar' THEN 1 END) as student_used,
        COUNT(CASE WHEN u.user_type = 'umum' THEN 1 END) as general_used,
        (pu.student_quota - COUNT(CASE WHEN u.user_type = 'pelajar' THEN 1 END)) as student_available,
        (pu.general_quota - COUNT(CASE WHEN u.user_type = 'umum' THEN 1 END)) as general_available
      FROM placement_units pu
      LEFT JOIN registrations r ON pu.id = r.placement_unit_id AND r.status IN ('approved', 'active', 'completed')
      LEFT JOIN users u ON r.user_id = u.id
      WHERE pu.is_active = 1
      GROUP BY pu.id, pu.name, pu.student_quota, pu.general_quota
    `);

    res.json({
      success: true,
      data: {
        ...stats,
        userTypeStats,
        placementStats
      }
    });
  } catch (error) {
    console.error('Get registration stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;