const express = require('express');
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    'SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(users);
    }
  );
});

// Get all registrations (admin only)
router.get('/registrations', authenticateToken, requireAdmin, (req, res) => {
  db.all(
    `SELECT r.*, u.email, u.full_name 
     FROM registrations r 
     JOIN users u ON r.user_id = u.id 
     ORDER BY r.created_at DESC`,
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

// Update registration status (admin only)
router.put('/registrations/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const registrationId = req.params.id;

  db.run(
    'UPDATE registrations SET status = ? WHERE id = ?',
    [status, registrationId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update registration status' });
      }

      res.json({ message: 'Registration status updated successfully' });
    }
  );
});

// Create announcement (admin only)
router.post('/announcements', authenticateToken, requireAdmin, (req, res) => {
  const { title, content, priority } = req.body;

  db.run(
    'INSERT INTO announcements (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
    [title, content, priority || 'normal', req.user.userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create announcement' });
      }

      res.status(201).json({
        message: 'Announcement created successfully',
        announcementId: this.lastID
      });
    }
  );
});

module.exports = router;