const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create registration
router.post('/', authenticateToken, (req, res) => {
  const { type, eventName, participantData } = req.body;
  
  db.run(
    'INSERT INTO registrations (user_id, type, event_name, participant_data, status) VALUES (?, ?, ?, ?, ?)',
    [req.user.userId, type, eventName, JSON.stringify(participantData), 'pending'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create registration' });
      }

      res.status(201).json({
        message: 'Registration created successfully',
        registrationId: this.lastID
      });
    }
  );
});

// Get user registrations
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM registrations WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, registrations) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const formattedRegistrations = registrations.map(reg => ({
        ...reg,
        participant_data: JSON.parse(reg.participant_data)
      }));

      res.json(formattedRegistrations);
    }
  );
});

module.exports = router;