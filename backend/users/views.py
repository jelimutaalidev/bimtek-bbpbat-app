from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import login
from .models import User, UserProfile, Document
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, AdminLoginSerializer,
    UserSerializer, UserProfileSerializer, DocumentSerializer
)

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Create JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'Registrasi berhasil'
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def user_login(request):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        },
        'message': 'Login berhasil'
    })

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        },
        'message': 'Login admin berhasil'
    })

@api_view(['POST'])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout berhasil'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Token tidak valid'}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def perform_update(self, serializer):
        serializer.save()
        # Check if profile is complete
        profile = serializer.instance
        required_fields = [
            'full_name', 'address', 'place_of_birth', 'date_of_birth', 'blood_type',
            'institution_name', 'institution_address', 'institution_email',
            'planned_start_date', 'planned_end_date', 'placement_unit',
            'medical_history', 'special_needs'
        ]
        
        is_complete = all(getattr(profile, field) for field in required_fields)
        profile.user.is_profile_complete = is_complete
        profile.user.save()

class DocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
        # Check if all required documents are uploaded
        user = self.request.user
        required_docs = ['ktp', 'ktm', 'photo', 'proposal', 'transcript', 'statement_letter']
        if user.user_type == 'general':
            required_docs.append('payment_proof')
        
        uploaded_docs = user.documents.values_list('document_type', flat=True)
        is_complete = all(doc_type in uploaded_docs for doc_type in required_docs)
        
        if user.user_type == 'general':
            user.is_payment_complete = 'payment_proof' in uploaded_docs
        
        user.is_documents_complete = is_complete
        user.save()

class DocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Document.objects.filter(user=self.request.user)

@api_view(['GET'])
def user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
def update_user_status(request):
    """Update user completion status"""
    user = request.user
    data = request.data
    
    if 'is_profile_complete' in data:
        user.is_profile_complete = data['is_profile_complete']
    if 'is_documents_complete' in data:
        user.is_documents_complete = data['is_documents_complete']
    if 'is_payment_complete' in data:
        user.is_payment_complete = data['is_payment_complete']
    
    user.save()
    return Response(UserSerializer(user).data)