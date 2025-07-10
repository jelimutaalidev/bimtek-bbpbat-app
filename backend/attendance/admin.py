from django.contrib import admin
from .models import AttendanceRecord, AttendanceSettings

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'status', 'check_in_time', 'check_out_time', 'check_in_distance']
    list_filter = ['status', 'date', 'user__user_type']
    search_fields = ['user__username', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'

@admin.register(AttendanceSettings)
class AttendanceSettingsAdmin(admin.ModelAdmin):
    list_display = ['bbpbat_latitude', 'bbpbat_longitude', 'allowed_radius', 'updated_at']