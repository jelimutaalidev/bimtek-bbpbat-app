from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Report(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('revision_required', 'Revision Required'),
    ]

    REPORT_TYPES = [
        ('daily', 'Laporan Harian'),
        ('weekly', 'Laporan Mingguan'),
        ('monthly', 'Laporan Bulanan'),
        ('final', 'Laporan Akhir'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES, default='daily')
    content = models.TextField()
    file = models.FileField(upload_to='reports/%Y/%m/', null=True, blank=True)
    
    # Status and Review
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_reports')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    
    # Dates
    report_date = models.DateField()
    submission_date = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-report_date']

    def __str__(self):
        return f"{self.user.username} - {self.title}"

class ReportComment(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal admin comments
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment on {self.report.title} by {self.user.username}"