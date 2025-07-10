const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { runQuery, getRow } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
function generateToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

// User login (with username and access code)
router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('accessCode').notEmpty().withMessage('Access code is required')
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

    const { username, accessCode } = req.body;

    // Find user by username and access code
    const user = await getRow(
      'SELECT * FROM users WHERE username = ? AND access_code = ? AND is_active = 1',
      [username, accessCode]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or access code'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Get user profile
    const profile = await getRow(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [user.id]
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.user_type,
          phoneNumber: user.phone_number,
          institution: user.institution,
          profileComplete: user.profile_complete,
          documentsComplete: user.documents_complete,
          paymentComplete: user.payment_complete
        },
        profile: profile || null,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin login (with username and password)
router.post('/admin-login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { username, password } = req.body;

    // Find admin user
    const user = await getRow(
      'SELECT * FROM users WHERE username = ? AND user_type = ? AND is_active = 1',
      [username, 'admin']
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Admin login successful',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.user_type
        },
        token
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user profile
    const profile = await getRow(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [user.id]
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.user_type,
          phoneNumber: user.phone_number,
          institution: user.institution,
          profileComplete: user.profile_complete,
          documentsComplete: user.documents_complete,
          paymentComplete: user.payment_complete
        },
        profile: profile || null
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const newToken = generateToken(req.user.id);
    
    res.json({
      success: true,
      data: {
        token: newToken
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;