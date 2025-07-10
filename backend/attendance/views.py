from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from .models import AttendanceRecord, AttendanceSettings
from .serializers import AttendanceRecordSerializer, AttendanceCreateSerializer, AttendanceSettingsSerializer

class AttendanceListCreateView(generics.ListCreateAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AttendanceRecord.objects.filter(user=self.request.user)
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
            
        return queryset.order_by('-date')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AttendanceCreateSerializer
        return AttendanceRecordSerializer

class AttendanceDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AttendanceRecord.objects.filter(user=self.request.user)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def attendance_stats(request):
    """Get attendance statistics for current user"""
    user = request.user
    today = timezone.now().date()
    
    # Current month stats
    current_month = today.replace(day=1)
    next_month = (current_month + timedelta(days=32)).replace(day=1)
    
    monthly_records = AttendanceRecord.objects.filter(
        user=user,
        date__gte=current_month,
        date__lt=next_month
    )
    
    stats = {
        'total_days': monthly_records.count(),
        'hadir': monthly_records.filter(status='hadir').count(),
        'izin': monthly_records.filter(status='izin').count(),
        'sakit': monthly_records.filter(status='sakit').count(),
        'alpha': monthly_records.filter(status='alpha').count(),
    }
    
    # Calculate attendance percentage
    if stats['total_days'] > 0:
        stats['attendance_percentage'] = round((stats['hadir'] / stats['total_days']) * 100, 2)
    else:
        stats['attendance_percentage'] = 0
    
    # Today's attendance
    try:
        today_attendance = AttendanceRecord.objects.get(user=user, date=today)
        stats['today_status'] = today_attendance.status
        stats['today_check_in'] = today_attendance.check_in_time
        stats['today_check_out'] = today_attendance.check_out_time
    except AttendanceRecord.DoesNotExist:
        stats['today_status'] = None
        stats['today_check_in'] = None
        stats['today_check_out'] = None
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def attendance_settings(request):
    """Get attendance settings"""
    try:
        settings = AttendanceSettings.objects.first()
        if not settings:
            settings = AttendanceSettings.objects.create()
        serializer = AttendanceSettingsSerializer(settings)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Admin Views
class AdminAttendanceListView(generics.ListAPIView):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.user_type == 'admin':
            return AttendanceRecord.objects.none()
        
        queryset = AttendanceRecord.objects.all()
        date = self.request.query_params.get('date', None)
        user_type = self.request.query_params.get('user_type', None)
        status_filter = self.request.query_params.get('status', None)
        
        if date:
            queryset = queryset.filter(date=date)
        if user_type:
            queryset = queryset.filter(user__user_type=user_type)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
            
        return queryset.order_by('-date', 'user__username')

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_attendance_stats(request):
    """Get attendance statistics for admin dashboard"""
    if request.user.user_type != 'admin':
        return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
    
    today = timezone.now().date()
    
    # Today's stats
    today_records = AttendanceRecord.objects.filter(date=today)
    today_stats = {
        'total': today_records.count(),
        'hadir': today_records.filter(status='hadir').count(),
        'izin': today_records.filter(status='izin').count(),
        'sakit': today_records.filter(status='sakit').count(),
        'alpha': today_records.filter(status='alpha').count(),
    }
    
    # Monthly stats
    current_month = today.replace(day=1)
    next_month = (current_month + timedelta(days=32)).replace(day=1)
    
    monthly_records = AttendanceRecord.objects.filter(
        date__gte=current_month,
        date__lt=next_month
    )
    
    monthly_stats = {
        'total': monthly_records.count(),
        'hadir': monthly_records.filter(status='hadir').count(),
        'izin': monthly_records.filter(status='izin').count(),
        'sakit': monthly_records.filter(status='sakit').count(),
        'alpha': monthly_records.filter(status='alpha').count(),
    }
    
    # By user type
    student_stats = monthly_records.filter(user__user_type='student').aggregate(
        total=Count('id'),
        hadir=Count('id', filter=Q(status='hadir')),
        izin=Count('id', filter=Q(status='izin')),
        sakit=Count('id', filter=Q(status='sakit')),
        alpha=Count('id', filter=Q(status='alpha')),
    )
    
    general_stats = monthly_records.filter(user__user_type='general').aggregate(
        total=Count('id'),
        hadir=Count('id', filter=Q(status='hadir')),
        izin=Count('id', filter=Q(status='izin')),
        sakit=Count('id', filter=Q(status='sakit')),
        alpha=Count('id', filter=Q(status='alpha')),
    )
    
    return Response({
        'today': today_stats,
        'monthly': monthly_stats,
        'student': student_stats,
        'general': general_stats,
    })