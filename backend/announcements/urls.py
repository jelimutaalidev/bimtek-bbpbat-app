from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('', views.AnnouncementListView.as_view(), name='announcement-list'),
    path('<int:pk>/', views.AnnouncementDetailView.as_view(), name='announcement-detail'),
    path('<int:pk>/mark-read/', views.mark_as_read, name='mark-announcement-read'),
    path('unread-count/', views.unread_count, name='unread-announcements-count'),
    
    # Admin endpoints
    path('admin/', views.AdminAnnouncementListCreateView.as_view(), name='admin-announcement-list-create'),
    path('admin/<int:pk>/', views.AdminAnnouncementDetailView.as_view(), name='admin-announcement-detail'),
    path('admin/stats/', views.admin_announcement_stats, name='admin-announcement-stats'),
]