from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.http import HttpResponse
from .models import Certificate, CertificateTemplate
from .serializers import CertificateSerializer, CertificateTemplateSerializer

class CertificateDetailView(generics.RetrieveAPIView):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            return Certificate.objects.get(user=self.request.user)
        except Certificate.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({
                'message': 'Sertifikat belum tersedia',
                'available': False
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(instance)
        return Response({
            'certificate': serializer.data,
            'available': True
        })

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def verify_certificate(request, verification_code):
    """Verify certificate by verification code"""
    try:
        certificate = Certificate.objects.get(verification_code=verification_code, is_verified=True)
        serializer = CertificateSerializer(certificate)
        return Response({
            'valid': True,
            'certificate': serializer.data
        })
    except Certificate.DoesNotExist:
        return Response({
            'valid': False,
            'message': 'Sertifikat tidak ditemukan atau tidak valid'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_certificate(request):
    """Download certificate file"""
    try:
        certificate = Certificate.objects.get(user=request.user)
        if certificate.certificate_file:
            response = HttpResponse(certificate.certificate_file.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="Certificate_{certificate.certificate_number}.pdf"'
            return response
        else:
            return Response({'error': 'File sertifikat tidak tersedia'}, status=status.HTTP_404_NOT_FOUND)
    except Certificate.DoesNotExist:
        return Response({'error': 'Sertifikat tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)

# Admin Views
class AdminCertificateListView(generics.ListCreateAPIView):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            return Certificate.objects.none()
        return Certificate.objects.all().order_by('-issued_at')

    def perform_create(self, serializer):
        serializer.save(issued_by=self.request.user)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def generate_certificate(request, user_id):
    """Generate certificate for a user"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        from users.models import User
        user = User.objects.get(id=user_id)
        
        # Check if certificate already exists
        if hasattr(user, 'certificate'):
            return Response({'error': 'Sertifikat sudah ada untuk user ini'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user profile and registration data
        profile = user.profile
        registration = user.registration
        
        # Create certificate
        certificate = Certificate.objects.create(
            user=user,
            participant_name=profile.full_name,
            institution_name=profile.institution_name,
            placement_unit=profile.placement_unit,
            training_period_start=registration.start_date,
            training_period_end=registration.end_date,
            attendance_percentage=85.0,  # Calculate from attendance records
            final_score=85.0,  # Calculate from reports/evaluations
            issued_by=request.user
        )
        
        serializer = CertificateSerializer(certificate)
        return Response({
            'certificate': serializer.data,
            'message': 'Sertifikat berhasil dibuat'
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response({'error': 'User tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def certificate_stats(request):
    """Get certificate statistics"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    stats = {
        'total_certificates': Certificate.objects.count(),
        'student_certificates': Certificate.objects.filter(user__user_type='student').count(),
        'general_certificates': Certificate.objects.filter(user__user_type='general').count(),
        'verified_certificates': Certificate.objects.filter(is_verified=True).count(),
    }
    
    return Response(stats)