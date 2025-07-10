from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()

class AttendanceRecord(models.Model):
    STATUS_CHOICES = [
        ('hadir', 'Hadir'),
        ('izin', 'Izin'),
        ('sakit', 'Sakit'),
        ('alpha', 'Alpha'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    
    # Check-in/out times
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)
    
    # Location data
    check_in_latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    check_in_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    check_out_latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    check_out_longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    
    # Distance from BBPBAT location
    check_in_distance = models.PositiveIntegerField(null=True, blank=True, help_text="Distance in meters")
    check_out_distance = models.PositiveIntegerField(null=True, blank=True, help_text="Distance in meters")
    
    # Notes
    notes = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.get_status_display()}"

class AttendanceSettings(models.Model):
    """Global settings for attendance system"""
    bbpbat_latitude = models.DecimalField(max_digits=10, decimal_places=8, default=-6.9175)
    bbpbat_longitude = models.DecimalField(max_digits=11, decimal_places=8, default=107.6191)
    allowed_radius = models.PositiveIntegerField(default=100, help_text="Allowed radius in meters")
    check_in_start_time = models.TimeField(default='07:00:00')
    check_in_end_time = models.TimeField(default='09:00:00')
    check_out_start_time = models.TimeField(default='15:00:00')
    check_out_end_time = models.TimeField(default='17:00:00')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Attendance Settings"
        verbose_name_plural = "Attendance Settings"

    def __str__(self):
        return f"Attendance Settings - Radius: {self.allowed_radius}m"