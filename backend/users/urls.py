from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('login/', views.user_login, name='user-login'),
    path('admin-login/', views.admin_login, name='admin-login'),
    path('logout/', views.logout, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    
    # User Profile
    path('profile/', views.user_profile, name='user-profile'),
    path('profile/update/', views.UserProfileView.as_view(), name='user-profile-update'),
    path('status/update/', views.update_user_status, name='update-user-status'),
    
    # Documents
    path('documents/', views.DocumentListCreateView.as_view(), name='document-list-create'),
    path('documents/<int:pk>/', views.DocumentDetailView.as_view(), name='document-detail'),
]