from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator

class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('student', 'Pelajar/Mahasiswa'),
        ('general', 'Masyarakat Umum/Dinas'),
        ('admin', 'Administrator'),
    ]
    
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='student')
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Format nomor telepon tidak valid.")
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    institution = models.CharField(max_length=255, blank=True)
    is_profile_complete = models.BooleanField(default=False)
    is_documents_complete = models.BooleanField(default=False)
    is_payment_complete = models.BooleanField(default=False)
    registration_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    access_code = models.CharField(max_length=50, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.get_user_type_display()}"

    def save(self, *args, **kwargs):
        if not self.registration_number:
            # Generate registration number
            from django.utils import timezone
            year = timezone.now().year
            count = User.objects.filter(user_type=self.user_type).count() + 1
            prefix = 'BBPBAT' if self.user_type == 'admin' else self.user_type.upper()
            self.registration_number = f"{prefix}-{year}-{count:06d}"
        
        if not self.access_code and self.user_type != 'admin':
            # Generate access code
            import random
            import string
            self.access_code = 'BBPBAT' + ''.join(random.choices(string.digits, k=4))
        
        super().save(*args, **kwargs)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Personal Information
    full_name = models.CharField(max_length=255)
    address = models.TextField()
    place_of_birth = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    blood_type = models.CharField(max_length=3, choices=[
        ('A', 'A'), ('B', 'B'), ('AB', 'AB'), ('O', 'O')
    ], blank=True)
    parent_name = models.CharField(max_length=255, blank=True)
    parent_phone = models.CharField(max_length=17, blank=True)
    
    # Institution Information
    institution_name = models.CharField(max_length=255)
    student_id = models.CharField(max_length=50, blank=True)
    institution_address = models.TextField()
    institution_email = models.EmailField()
    institution_phone = models.CharField(max_length=17, blank=True)
    supervisor_name = models.CharField(max_length=255, blank=True)
    supervisor_phone = models.CharField(max_length=17, blank=True)
    supervisor_email = models.EmailField(blank=True)
    
    # Internship/Training Plan
    planned_start_date = models.DateField(null=True, blank=True)
    planned_end_date = models.DateField(null=True, blank=True)
    placement_unit = models.CharField(max_length=255)
    
    # Health Information
    medical_history = models.TextField()
    special_needs = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile - {self.user.username}"

class Document(models.Model):
    DOCUMENT_TYPES = [
        ('ktp', 'KTP'),
        ('ktm', 'KTM/KTS'),
        ('kk', 'Kartu Keluarga'),
        ('photo', 'Pas Photo'),
        ('proposal', 'Proposal'),
        ('transcript', 'Transkrip Nilai'),
        ('certificate_format', 'Format Sertifikat'),
        ('statement_letter', 'Surat Pernyataan'),
        ('payment_proof', 'Bukti Pembayaran'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/%Y/%m/')
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField()
    is_verified = models.BooleanField(default=False)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_documents')
    verified_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'document_type']

    def __str__(self):
        return f"{self.user.username} - {self.get_document_type_display()}"