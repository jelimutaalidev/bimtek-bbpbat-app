const express = require('express');
const { body, validationResult } = require('express-validator');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await getRow(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      data: profile || {}
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('fullName').optional().isLength({ min: 1 }).withMessage('Full name is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().isLength({ min: 10 }).withMessage('Valid phone number is required')
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

    const userId = req.user.id;
    const profileData = req.body;

    // Check if profile exists
    const existingProfile = await getRow(
      'SELECT id FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    let result;
    if (existingProfile) {
      // Update existing profile
      const updateFields = [];
      const updateValues = [];
      
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined) {
          // Convert camelCase to snake_case
          const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updateFields.push(`${dbField} = ?`);
          updateValues.push(profileData[key]);
        }
      });

      if (updateFields.length > 0) {
        updateValues.push(new Date().toISOString());
        updateValues.push(userId);
        
        result = await runQuery(
          `UPDATE user_profiles SET ${updateFields.join(', ')}, updated_at = ? WHERE user_id = ?`,
          updateValues
        );
      }
    } else {
      // Create new profile
      const fields = ['user_id'];
      const values = [userId];
      const placeholders = ['?'];

      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined) {
          const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          fields.push(dbField);
          values.push(profileData[key]);
          placeholders.push('?');
        }
      });

      result = await runQuery(
        `INSERT INTO user_profiles (${fields.join(', ')}) VALUES (${placeholders.join(', ')})`,
        values
      );
    }

    // Check if profile is complete
    const updatedProfile = await getRow(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [userId]
    );

    const requiredFields = [
      'full_name', 'address', 'place_of_birth', 'date_of_birth', 'blood_type',
      'institution_name', 'institution_address', 'institution_email',
      'planned_start_date', 'planned_end_date', 'placement_unit',
      'medical_history', 'special_needs'
    ];

    const isComplete = requiredFields.every(field => 
      updatedProfile && updatedProfile[field] && updatedProfile[field].toString().trim() !== ''
    );

    // Update user completion status
    await runQuery(
      'UPDATE users SET profile_complete = ?, updated_at = ? WHERE id = ?',
      [isComplete ? 1 : 0, new Date().toISOString(), userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile: updatedProfile,
        profileComplete: isComplete
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user documents
router.get('/documents', authenticateToken, async (req, res) => {
  try {
    const documents = await getAllRows(
      'SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user status
router.put('/status', authenticateToken, async (req, res) => {
  try {
    const { profileComplete, documentsComplete, paymentComplete } = req.body;
    const userId = req.user.id;

    const updateFields = [];
    const updateValues = [];

    if (profileComplete !== undefined) {
      updateFields.push('profile_complete = ?');
      updateValues.push(profileComplete ? 1 : 0);
    }

    if (documentsComplete !== undefined) {
      updateFields.push('documents_complete = ?');
      updateValues.push(documentsComplete ? 1 : 0);
    }

    if (paymentComplete !== undefined) {
      updateFields.push('payment_complete = ?');
      updateValues.push(paymentComplete ? 1 : 0);
    }

    if (updateFields.length > 0) {
      updateValues.push(new Date().toISOString());
      updateValues.push(userId);

      await runQuery(
        `UPDATE users SET ${updateFields.join(', ')}, updated_at = ? WHERE id = ?`,
        updateValues
      );
    }

    // Get updated user
    const updatedUser = await getRow(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        profileComplete: updatedUser.profile_complete,
        documentsComplete: updatedUser.documents_complete,
        paymentComplete: updatedUser.payment_complete
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;