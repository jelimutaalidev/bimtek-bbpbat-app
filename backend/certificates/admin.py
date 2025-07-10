from django.contrib import admin
from .models import Certificate, CertificateTemplate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_number', 'participant_name', 'institution_name', 'placement_unit', 'issued_at']
    list_filter = ['is_verified', 'issued_at', 'user__user_type']
    search_fields = ['certificate_number', 'participant_name', 'institution_name', 'verification_code']
    readonly_fields = ['certificate_number', 'verification_code', 'issued_at', 'created_at', 'updated_at']

@admin.register(CertificateTemplate)
class CertificateTemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']