from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Registration, PlacementUnit, RegistrationPeriod
from .serializers import (
    RegistrationCreateSerializer, RegistrationSerializer, 
    PlacementUnitSerializer, RegistrationPeriodSerializer,
    RegistrationApprovalSerializer
)

class PlacementUnitListView(generics.ListAPIView):
    queryset = PlacementUnit.objects.filter(is_active=True)
    serializer_class = PlacementUnitSerializer
    permission_classes = [permissions.AllowAny]

class StudentRegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationCreateSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user_type'] = 'student'
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
        
        return Response({
            'registration': RegistrationSerializer(registration).data,
            'message': 'Pendaftaran berhasil diajukan. Anda akan dihubungi via WhatsApp untuk konfirmasi.'
        }, status=status.HTTP_201_CREATED)

class GeneralRegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationCreateSerializer
    permission_classes = [permissions.AllowAny]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user_type'] = 'general'
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        registration = serializer.save()
        
        return Response({
            'registration': RegistrationSerializer(registration).data,
            'message': 'Pendaftaran berhasil diajukan. Silakan lakukan pembayaran dan upload bukti pembayaran.'
        }, status=status.HTTP_201_CREATED)

# Admin Views
class RegistrationListView(generics.ListAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Registration.objects.all().order_by('-created_at')
        status_filter = self.request.query_params.get('status', None)
        user_type = self.request.query_params.get('user_type', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if user_type:
            queryset = queryset.filter(user__user_type=user_type)
            
        return queryset

class RegistrationDetailView(generics.RetrieveUpdateAPIView):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def approve_registration(request, pk):
    try:
        registration = Registration.objects.get(pk=pk)
    except Registration.DoesNotExist:
        return Response({'error': 'Pendaftaran tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = RegistrationApprovalSerializer(registration, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    
    if request.data.get('status') == 'approved':
        registration.approved_by = request.user
        registration.approved_at = timezone.now()
    
    serializer.save()
    
    return Response({
        'registration': RegistrationSerializer(registration).data,
        'message': f'Pendaftaran berhasil {registration.get_status_display().lower()}'
    })

class RegistrationPeriodListView(generics.ListCreateAPIView):
    queryset = RegistrationPeriod.objects.all()
    serializer_class = RegistrationPeriodSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def registration_stats(request):
    """Get registration statistics"""
    stats = {
        'total_registrations': Registration.objects.count(),
        'pending_registrations': Registration.objects.filter(status='pending').count(),
        'approved_registrations': Registration.objects.filter(status='approved').count(),
        'active_participants': Registration.objects.filter(status='active').count(),
        'completed_participants': Registration.objects.filter(status='completed').count(),
        'graduated_participants': Registration.objects.filter(status='graduated').count(),
        'student_registrations': Registration.objects.filter(user__user_type='student').count(),
        'general_registrations': Registration.objects.filter(user__user_type='general').count(),
    }
    
    # Placement unit statistics
    placement_stats = []
    for unit in PlacementUnit.objects.filter(is_active=True):
        placement_stats.append({
            'name': unit.name,
            'student_quota': unit.student_quota,
            'student_used': unit.student_used_quota,
            'student_available': unit.student_available_quota,
            'general_quota': unit.general_quota,
            'general_used': unit.general_used_quota,
            'general_available': unit.general_available_quota,
        })
    
    stats['placement_units'] = placement_stats
    
    return Response(stats)