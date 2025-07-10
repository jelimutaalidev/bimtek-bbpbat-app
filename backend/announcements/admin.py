from django.contrib import admin
from .models import Announcement, AnnouncementRead

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'priority', 'target_audience', 'status', 'created_by', 'published_at']
    list_filter = ['priority', 'target_audience', 'status', 'created_at']
    search_fields = ['title', 'content']
    readonly_fields = ['published_at', 'created_at', 'updated_at']

@admin.register(AnnouncementRead)
class AnnouncementReadAdmin(admin.ModelAdmin):
    list_display = ['announcement', 'user', 'read_at']
    list_filter = ['read_at']
    search_fields = ['announcement__title', 'user__username']