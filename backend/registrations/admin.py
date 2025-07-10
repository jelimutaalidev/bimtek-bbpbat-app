from django.contrib import admin
from .models import PlacementUnit, Registration, RegistrationPeriod

@admin.register(PlacementUnit)
class PlacementUnitAdmin(admin.ModelAdmin):
    list_display = ['name', 'student_quota', 'general_quota', 'student_used_quota', 'general_used_quota', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'user', 'placement_unit', 'status', 'created_at']
    list_filter = ['status', 'placement_unit', 'user__user_type']
    search_fields = ['full_name', 'user__username', 'institution']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(RegistrationPeriod)
class RegistrationPeriodAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']