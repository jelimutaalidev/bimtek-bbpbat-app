const express = require('express');
const { body, validationResult } = require('express-validator');
const { runQuery, getRow, getAllRows } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { uploadReport } = require('../middleware/upload');

const router = express.Router();

// Get user reports
router.get('/', authenticateToken, async (req, res) => {
  try {
    const reports = await getAllRows(
      'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create report
router.post('/', authenticateToken, uploadReport, [
  body('title').notEmpty().withMessage('Title is required'),
  body('reportType').isIn(['daily', 'weekly', 'monthly', 'final']).withMessage('Valid report type is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('reportDate').isDate().withMessage('Valid report date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, reportType, content, reportDate, submit } = req.body;
    const status = submit === 'true' ? 'submitted' : 'draft';
    const submissionDate = submit === 'true' ? new Date().toISOString() : null;

    const result = await runQuery(`
      INSERT INTO reports (user_id, title, report_type, content, file_path, status, report_date, submission_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      title,
      reportType,
      content,
      req.file ? req.file.path : null,
      status,
      reportDate,
      submissionDate
    ]);

    const report = await getRow(
      'SELECT * FROM reports WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: status === 'submitted' ? 'Report submitted successfully' : 'Report saved as draft',
      data: report
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update report
router.put('/:id', authenticateToken, uploadReport, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('reportType').optional().isIn(['daily', 'weekly', 'monthly', 'final']).withMessage('Valid report type is required'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('reportDate').optional().isDate().withMessage('Valid report date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const reportId = req.params.id;
    const { title, reportType, content, reportDate, submit } = req.body;

    // Check if report belongs to user
    const existingReport = await getRow(
      'SELECT * FROM reports WHERE id = ? AND user_id = ?',
      [reportId, req.user.id]
    );

    if (!existingReport) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Prepare update data
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }

    if (reportType !== undefined) {
      updateFields.push('report_type = ?');
      updateValues.push(reportType);
    }

    if (content !== undefined) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }

    if (reportDate !== undefined) {
      updateFields.push('report_date = ?');
      updateValues.push(reportDate);
    }

    if (req.file) {
      updateFields.push('file_path = ?');
      updateValues.push(req.file.path);
    }

    // Handle submission
    if (submit === 'true' && existingReport.status === 'draft') {
      updateFields.push('status = ?', 'submission_date = ?');
      updateValues.push('submitted', new Date().toISOString());
    }

    if (updateFields.length > 0) {
      updateFields.push('updated_at = ?');
      updateValues.push(new Date().toISOString());
      updateValues.push(reportId);

      await runQuery(
        `UPDATE reports SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );
    }

    const updatedReport = await getRow(
      'SELECT * FROM reports WHERE id = ?',
      [reportId]
    );

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: updatedReport
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete report
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const reportId = req.params.id;

    // Check if report belongs to user and is still draft
    const report = await getRow(
      'SELECT * FROM reports WHERE id = ? AND user_id = ? AND status = ?',
      [reportId, req.user.id, 'draft']
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or cannot be deleted'
      });
    }

    await runQuery('DELETE FROM reports WHERE id = ?', [reportId]);

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get report statistics for user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await getRow(`
      SELECT 
        COUNT(*) as total_reports,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft,
        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN status = 'revision_required' THEN 1 END) as revision_required
      FROM reports 
      WHERE user_id = ?
    `, [req.user.id]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get report stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;