from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Announcement(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Rendah'),
        ('medium', 'Sedang'),
        ('high', 'Tinggi'),
    ]

    TARGET_CHOICES = [
        ('all', 'Semua Peserta'),
        ('student', 'Peserta Pelajar'),
        ('general', 'Peserta Umum/Dinas'),
        ('specific_placement', 'Unit Penempatan Tertentu'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    target_audience = models.CharField(max_length=20, choices=TARGET_CHOICES, default='all')
    specific_placement = models.CharField(max_length=255, blank=True, help_text="Untuk target unit penempatan tertentu")
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    
    # Publishing details
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_announcements')
    published_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # Attachments
    attachment = models.FileField(upload_to='announcements/%Y/%m/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class AnnouncementRead(models.Model):
    """Track which users have read which announcements"""
    announcement = models.ForeignKey(Announcement, on_delete=models.CASCADE, related_name='read_by')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='read_announcements')
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['announcement', 'user']

    def __str__(self):
        return f"{self.user.username} read {self.announcement.title}"