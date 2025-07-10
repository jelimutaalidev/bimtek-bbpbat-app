const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Get user certificates
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM certificates WHERE user_id = ? ORDER BY issued_date DESC',
    [req.user.userId],
    (err, certificates) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(certificates);
    }
  );
});

// Request certificate
router.post('/request', authenticateToken, (req, res) => {
  const { eventId, eventName } = req.body;

  db.run(
    'INSERT INTO certificates (user_id, event_id, event_name, status) VALUES (?, ?, ?, ?)',
    [req.user.userId, eventId, eventName, 'pending'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to request certificate' });
      }

      res.status(201).json({
        message: 'Certificate request submitted successfully',
        certificateId: this.lastID
      });
    }
  );
});

module.exports = router;