const express = require('express');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get user certificate
router.get('/', authenticateToken, async (req, res) => {
  try {
    const certificate = await getRow(
      'SELECT * FROM certificates WHERE user_id = ?',
      [req.user.id]
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not available yet',
        available: false
      });
    }

    res.json({
      success: true,
      data: certificate,
      available: true
    });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify certificate by verification code
router.get('/verify/:verificationCode', async (req, res) => {
  try {
    const { verificationCode } = req.params;

    const certificate = await getRow(
      'SELECT * FROM certificates WHERE verification_code = ? AND is_verified = 1',
      [verificationCode]
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Certificate not found or invalid'
      });
    }

    res.json({
      success: true,
      valid: true,
      data: certificate
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Download certificate
router.get('/download', authenticateToken, async (req, res) => {
  try {
    const certificate = await getRow(
      'SELECT * FROM certificates WHERE user_id = ?',
      [req.user.id]
    );

    if (!certificate || !certificate.certificate_file_path) {
      return res.status(404).json({
        success: false,
        message: 'Certificate file not available'
      });
    }

    // In a real implementation, you would serve the actual file
    // For now, we'll return the file path
    res.json({
      success: true,
      message: 'Certificate download ready',
      data: {
        filePath: certificate.certificate_file_path,
        fileName: `Certificate_${certificate.certificate_number}.pdf`
      }
    });
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;