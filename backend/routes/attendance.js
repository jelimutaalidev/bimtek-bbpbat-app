const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user attendance
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC',
    [req.user.userId],
    (err, attendance) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(attendance);
    }
  );
});

// Mark attendance
router.post('/', authenticateToken, (req, res) => {
  const { eventId, date, status } = req.body;

  db.run(
    'INSERT OR REPLACE INTO attendance (user_id, event_id, date, status) VALUES (?, ?, ?, ?)',
    [req.user.userId, eventId, date, status],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to mark attendance' });
      }

      res.json({ message: 'Attendance marked successfully' });
    }
  );
});

module.exports = router;