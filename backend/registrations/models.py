from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class PlacementUnit(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    student_quota = models.PositiveIntegerField(default=10)
    general_quota = models.PositiveIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def student_used_quota(self):
        return Registration.objects.filter(
            placement_unit=self,
            user__user_type='student',
            status__in=['approved', 'active', 'completed']
        ).count()

    @property
    def general_used_quota(self):
        return Registration.objects.filter(
            placement_unit=self,
            user__user_type='general',
            status__in=['approved', 'active', 'completed']
        ).count()

    @property
    def student_available_quota(self):
        return max(0, self.student_quota - self.student_used_quota)

    @property
    def general_available_quota(self):
        return max(0, self.general_quota - self.general_used_quota)

class Registration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Menunggu Verifikasi'),
        ('approved', 'Disetujui'),
        ('rejected', 'Ditolak'),
        ('active', 'Aktif'),
        ('completed', 'Selesai'),
        ('graduated', 'Lulus'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='registration')
    placement_unit = models.ForeignKey(PlacementUnit, on_delete=models.CASCADE, related_name='registrations')
    
    # Personal Information
    full_name = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=17)
    
    # For Students
    supervisor_name = models.CharField(max_length=255, blank=True)
    supervisor_phone = models.CharField(max_length=17, blank=True)
    
    # Application Documents
    application_letter = models.FileField(upload_to='applications/%Y/%m/', null=True, blank=True)
    
    # Status and Approval
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_registrations')
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    # Training Period
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Notes
    admin_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.full_name} - {self.placement_unit.name}"

    def save(self, *args, **kwargs):
        # Auto-generate username and access code when approved
        if self.status == 'approved' and not self.user.access_code:
            import random
            import string
            
            # Generate username
            if self.user.user_type == 'student':
                prefix = 'pelajar'
            else:
                prefix = 'umum'
            
            count = User.objects.filter(user_type=self.user.user_type).count()
            self.user.username = f"{prefix}{count:03d}"
            
            # Generate access code
            self.user.access_code = 'BBPBAT2025'
            self.user.save()
        
        super().save(*args, **kwargs)

class RegistrationPeriod(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"

    class Meta:
        ordering = ['-start_date']