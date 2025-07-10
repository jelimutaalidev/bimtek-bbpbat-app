from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Announcement, AnnouncementRead
from .serializers import AnnouncementSerializer, AnnouncementCreateSerializer, AnnouncementReadSerializer

class AnnouncementListView(generics.ListAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Announcement.objects.filter(status='published')
        
        # Filter by target audience
        if user.user_type == 'student':
            queryset = queryset.filter(
                Q(target_audience='all') | 
                Q(target_audience='student') |
                Q(target_audience='specific_placement', specific_placement=user.profile.placement_unit)
            )
        elif user.user_type == 'general':
            queryset = queryset.filter(
                Q(target_audience='all') | 
                Q(target_audience='general') |
                Q(target_audience='specific_placement', specific_placement=user.profile.placement_unit)
            )
        
        # Filter by expiry date
        now = timezone.now()
        queryset = queryset.filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))
        
        return queryset.order_by('-priority', '-published_at')

class AnnouncementDetailView(generics.RetrieveAPIView):
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Announcement.objects.filter(status='published')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Mark as read
        AnnouncementRead.objects.get_or_create(
            announcement=instance,
            user=request.user
        )
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def mark_as_read(request, pk):
    """Mark announcement as read"""
    try:
        announcement = Announcement.objects.get(pk=pk, status='published')
        read_record, created = AnnouncementRead.objects.get_or_create(
            announcement=announcement,
            user=request.user
        )
        return Response({
            'message': 'Pengumuman ditandai sebagai sudah dibaca',
            'created': created
        })
    except Announcement.DoesNotExist:
        return Response({'error': 'Pengumuman tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def unread_count(request):
    """Get count of unread announcements"""
    user = request.user
    
    # Get all published announcements for user
    queryset = Announcement.objects.filter(status='published')
    
    if user.user_type == 'student':
        queryset = queryset.filter(
            Q(target_audience='all') | 
            Q(target_audience='student') |
            Q(target_audience='specific_placement', specific_placement=user.profile.placement_unit)
        )
    elif user.user_type == 'general':
        queryset = queryset.filter(
            Q(target_audience='all') | 
            Q(target_audience='general') |
            Q(target_audience='specific_placement', specific_placement=user.profile.placement_unit)
        )
    
    # Filter by expiry date
    now = timezone.now()
    queryset = queryset.filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))
    
    # Get read announcement IDs
    read_ids = AnnouncementRead.objects.filter(user=user).values_list('announcement_id', flat=True)
    
    # Count unread
    unread_count = queryset.exclude(id__in=read_ids).count()
    
    return Response({'unread_count': unread_count})

# Admin Views
class AdminAnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AnnouncementCreateSerializer
        return AnnouncementSerializer

    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            return Announcement.objects.none()
        return Announcement.objects.all().order_by('-created_at')

class AdminAnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            return Announcement.objects.none()
        return Announcement.objects.all()

    def perform_update(self, serializer):
        announcement = serializer.save()
        if announcement.status == 'published' and not announcement.published_at:
            announcement.published_at = timezone.now()
            announcement.save()

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_announcement_stats(request):
    """Get announcement statistics for admin"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    stats = {
        'total_announcements': Announcement.objects.count(),
        'published': Announcement.objects.filter(status='published').count(),
        'draft': Announcement.objects.filter(status='draft').count(),
        'archived': Announcement.objects.filter(status='archived').count(),
        'high_priority': Announcement.objects.filter(priority='high').count(),
        'medium_priority': Announcement.objects.filter(priority='medium').count(),
        'low_priority': Announcement.objects.filter(priority='low').count(),
    }
    
    return Response(stats)