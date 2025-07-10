from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('', views.AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('<int:pk>/', views.AttendanceDetailView.as_view(), name='attendance-detail'),
    path('stats/', views.attendance_stats, name='attendance-stats'),
    path('settings/', views.attendance_settings, name='attendance-settings'),
    
    # Admin endpoints
    path('admin/', views.AdminAttendanceListView.as_view(), name='admin-attendance-list'),
    path('admin/stats/', views.admin_attendance_stats, name='admin-attendance-stats'),
]