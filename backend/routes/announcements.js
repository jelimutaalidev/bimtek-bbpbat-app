const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get all announcements
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM announcements ORDER BY created_at DESC',
    (err, announcements) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(announcements);
    }
  );
});

module.exports = router;