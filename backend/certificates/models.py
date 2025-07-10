from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Certificate(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='certificate')
    certificate_number = models.CharField(max_length=50, unique=True)
    
    # Certificate Details
    participant_name = models.CharField(max_length=255)
    institution_name = models.CharField(max_length=255)
    placement_unit = models.CharField(max_length=255)
    training_period_start = models.DateField()
    training_period_end = models.DateField()
    
    # Completion Details
    final_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    attendance_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    completion_status = models.CharField(max_length=50, default='Completed')
    
    # Certificate File
    certificate_file = models.FileField(upload_to='certificates/%Y/', null=True, blank=True)
    
    # Issuance Details
    issued_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='issued_certificates')
    issued_at = models.DateTimeField(auto_now_add=True)
    
    # Verification
    is_verified = models.BooleanField(default=True)
    verification_code = models.CharField(max_length=100, unique=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Certificate - {self.participant_name} ({self.certificate_number})"

    def save(self, *args, **kwargs):
        if not self.certificate_number:
            # Generate certificate number
            from django.utils import timezone
            year = timezone.now().year
            count = Certificate.objects.filter(issued_at__year=year).count() + 1
            self.certificate_number = f"BBPBAT/CERT/{year}/{count:04d}"
        
        if not self.verification_code:
            # Generate verification code
            import uuid
            self.verification_code = str(uuid.uuid4()).replace('-', '').upper()[:12]
        
        super().save(*args, **kwargs)

class CertificateTemplate(models.Model):
    name = models.CharField(max_length=100)
    template_file = models.FileField(upload_to='certificate_templates/')
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name