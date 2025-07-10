const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get user reports
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.userId],
    (err, reports) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(reports);
    }
  );
});

// Upload report
router.post('/upload', authenticateToken, upload.single('report'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { title, description } = req.body;

  db.run(
    'INSERT INTO reports (user_id, title, description, file_path, file_name) VALUES (?, ?, ?, ?, ?)',
    [req.user.userId, title, description, req.file.path, req.file.originalname],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to save report' });
      }

      res.status(201).json({
        message: 'Report uploaded successfully',
        reportId: this.lastID
      });
    }
  );
});

module.exports = router;