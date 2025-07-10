from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('', views.ReportListCreateView.as_view(), name='report-list-create'),
    path('<int:pk>/', views.ReportDetailView.as_view(), name='report-detail'),
    path('<int:report_id>/comments/', views.ReportCommentListCreateView.as_view(), name='report-comments'),
    path('stats/', views.report_stats, name='report-stats'),
    
    # Admin endpoints
    path('admin/', views.AdminReportListView.as_view(), name='admin-report-list'),
    path('admin/<int:pk>/', views.AdminReportDetailView.as_view(), name='admin-report-detail'),
]