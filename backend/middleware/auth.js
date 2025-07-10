const jwt = require('jsonwebtoken');
const { getRow } = require('../config/database');

// Middleware to verify JWT token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await getRow(
      'SELECT * FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
}

// Middleware to check if user type matches
function requireUserType(...allowedTypes) {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireUserType
};