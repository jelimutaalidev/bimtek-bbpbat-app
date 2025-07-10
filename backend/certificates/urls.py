from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('', views.CertificateDetailView.as_view(), name='certificate-detail'),
    path('download/', views.download_certificate, name='download-certificate'),
    path('verify/<str:verification_code>/', views.verify_certificate, name='verify-certificate'),
    
    # Admin endpoints
    path('admin/', views.AdminCertificateListView.as_view(), name='admin-certificate-list'),
    path('admin/generate/<int:user_id>/', views.generate_certificate, name='generate-certificate'),
    path('admin/stats/', views.certificate_stats, name='certificate-stats'),
]