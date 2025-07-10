from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('placement-units/', views.PlacementUnitListView.as_view(), name='placement-units'),
    path('student/', views.StudentRegistrationView.as_view(), name='student-registration'),
    path('general/', views.GeneralRegistrationView.as_view(), name='general-registration'),
    path('stats/', views.registration_stats, name='registration-stats'),
    
    # Admin endpoints
    path('', views.RegistrationListView.as_view(), name='registration-list'),
    path('<int:pk>/', views.RegistrationDetailView.as_view(), name='registration-detail'),
    path('<int:pk>/approve/', views.approve_registration, name='approve-registration'),
    path('periods/', views.RegistrationPeriodListView.as_view(), name='registration-periods'),
]