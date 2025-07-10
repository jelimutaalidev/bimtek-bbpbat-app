const express = require('express');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get announcements for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's placement unit
    const registration = await getRow(
      `SELECT pu.name as placement_unit FROM registrations r
       JOIN placement_units pu ON r.placement_unit_id = pu.id
       WHERE r.user_id = ?`,
      [user.id]
    );

    // Build query based on user type and placement
    let query = `
      SELECT a.*, 
             CASE WHEN ar.id IS NOT NULL THEN 1 ELSE 0 END as is_read
      FROM announcements a
      LEFT JOIN announcement_reads ar ON a.id = ar.announcement_id AND ar.user_id = ?
      WHERE a.status = 'published' 
      AND (a.expires_at IS NULL OR a.expires_at > datetime('now'))
      AND (
        a.target_audience = 'all' 
        OR a.target_audience = ?
    `;

    let params = [user.id, user.user_type === 'pelajar' ? 'student' : 'general'];

    if (registration && registration.placement_unit) {
      query += ` OR (a.target_audience = 'specific_placement' AND a.specific_placement = ?)`;
      params.push(registration.placement_unit);
    }

    query += `) ORDER BY a.priority DESC, a.published_at DESC`;

    const announcements = await getAllRows(query, params);

    res.json({
      success: true,
      data: announcements
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get announcement detail
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const announcementId = req.params.id;

    const announcement = await getRow(
      'SELECT * FROM announcements WHERE id = ? AND status = ?',
      [announcementId, 'published']
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Mark as read
    await runQuery(
      'INSERT OR IGNORE INTO announcement_reads (announcement_id, user_id) VALUES (?, ?)',
      [announcementId, req.user.id]
    );

    res.json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Get announcement detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark announcement as read
router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    const announcementId = req.params.id;

    // Check if announcement exists
    const announcement = await getRow(
      'SELECT id FROM announcements WHERE id = ? AND status = ?',
      [announcementId, 'published']
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    // Mark as read
    await runQuery(
      'INSERT OR IGNORE INTO announcement_reads (announcement_id, user_id) VALUES (?, ?)',
      [announcementId, req.user.id]
    );

    res.json({
      success: true,
      message: 'Announcement marked as read'
    });
  } catch (error) {
    console.error('Mark announcement as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unread announcements count
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Get user's placement unit
    const registration = await getRow(
      `SELECT pu.name as placement_unit FROM registrations r
       JOIN placement_units pu ON r.placement_unit_id = pu.id
       WHERE r.user_id = ?`,
      [user.id]
    );

    // Build query for unread announcements
    let query = `
      SELECT COUNT(*) as unread_count
      FROM announcements a
      LEFT JOIN announcement_reads ar ON a.id = ar.announcement_id AND ar.user_id = ?
      WHERE a.status = 'published' 
      AND (a.expires_at IS NULL OR a.expires_at > datetime('now'))
      AND ar.id IS NULL
      AND (
        a.target_audience = 'all' 
        OR a.target_audience = ?
    `;

    let params = [user.id, user.user_type === 'pelajar' ? 'student' : 'general'];

    if (registration && registration.placement_unit) {
      query += ` OR (a.target_audience = 'specific_placement' AND a.specific_placement = ?)`;
      params.push(registration.placement_unit);
    }

    query += `)`;

    const result = await getRow(query, params);

    res.json({
      success: true,
      data: {
        unreadCount: result.unread_count
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;