from django.contrib import admin
from .models import Report, ReportComment

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'report_type', 'status', 'report_date', 'submission_date']
    list_filter = ['status', 'report_type', 'user__user_type']
    search_fields = ['title', 'user__username', 'content']
    readonly_fields = ['created_at', 'updated_at', 'submission_date']
    date_hierarchy = 'report_date'

@admin.register(ReportComment)
class ReportCommentAdmin(admin.ModelAdmin):
    list_display = ['report', 'user', 'comment', 'is_internal', 'created_at']
    list_filter = ['is_internal', 'created_at']
    search_fields = ['report__title', 'user__username', 'comment']