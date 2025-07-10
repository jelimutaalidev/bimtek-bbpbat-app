const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, full_name, role, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    }
  );
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { fullName } = req.body;

  db.run(
    'UPDATE users SET full_name = ? WHERE id = ?',
    [fullName, req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;