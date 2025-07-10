from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, Document

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'user_type', 'is_profile_complete', 'is_documents_complete', 'created_at']
    list_filter = ['user_type', 'is_profile_complete', 'is_documents_complete', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'institution']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('BBPBAT Info', {
            'fields': ('user_type', 'phone_number', 'institution', 'registration_number', 'access_code')
        }),
        ('Completion Status', {
            'fields': ('is_profile_complete', 'is_documents_complete', 'is_payment_complete')
        }),
    )

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'institution_name', 'placement_unit', 'created_at']
    list_filter = ['placement_unit', 'blood_type']
    search_fields = ['user__username', 'full_name', 'institution_name']

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ['user', 'document_type', 'original_filename', 'is_verified', 'created_at']
    list_filter = ['document_type', 'is_verified']
    search_fields = ['user__username', 'original_filename']