from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Report, ReportComment
from .serializers import ReportSerializer, ReportCreateSerializer, ReportReviewSerializer, ReportCommentSerializer

class ReportListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReportCreateSerializer
        return ReportSerializer

    def perform_create(self, serializer):
        report = serializer.save()
        if 'submit' in self.request.data:
            report.status = 'submitted'
            report.submission_date = timezone.now()
            report.save()

class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        report = serializer.save()
        if 'submit' in self.request.data and report.status == 'draft':
            report.status = 'submitted'
            report.submission_date = timezone.now()
            report.save()

# Admin Views
class AdminReportListView(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.user_type != 'admin':
            return Report.objects.none()
        
        queryset = Report.objects.all()
        status_filter = self.request.query_params.get('status', None)
        user_type = self.request.query_params.get('user_type', None)
        report_type = self.request.query_params.get('report_type', None)
        
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if user_type:
            queryset = queryset.filter(user__user_type=user_type)
        if report_type:
            queryset = queryset.filter(report_type=report_type)
            
        return queryset.order_by('-created_at')

class AdminReportDetailView(generics.RetrieveUpdateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return ReportReviewSerializer
        return ReportSerializer

    def perform_update(self, serializer):
        if self.request.user.user_type == 'admin':
            report = serializer.save()
            if report.status in ['approved', 'rejected', 'revision_required']:
                report.reviewed_by = self.request.user
                report.reviewed_at = timezone.now()
                report.save()

class ReportCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = ReportCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        report_id = self.kwargs['report_id']
        return ReportComment.objects.filter(report_id=report_id)

    def perform_create(self, serializer):
        report_id = self.kwargs['report_id']
        serializer.save(user=self.request.user, report_id=report_id)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def report_stats(request):
    """Get report statistics"""
    if request.user.user_type == 'admin':
        # Admin stats
        stats = {
            'total_reports': Report.objects.count(),
            'submitted': Report.objects.filter(status='submitted').count(),
            'under_review': Report.objects.filter(status='under_review').count(),
            'approved': Report.objects.filter(status='approved').count(),
            'rejected': Report.objects.filter(status='rejected').count(),
            'revision_required': Report.objects.filter(status='revision_required').count(),
        }
        
        # By report type
        report_types = {}
        for choice in Report.REPORT_TYPES:
            report_types[choice[0]] = Report.objects.filter(report_type=choice[0]).count()
        stats['by_type'] = report_types
        
    else:
        # User stats
        user_reports = Report.objects.filter(user=request.user)
        stats = {
            'total_reports': user_reports.count(),
            'draft': user_reports.filter(status='draft').count(),
            'submitted': user_reports.filter(status='submitted').count(),
            'under_review': user_reports.filter(status='under_review').count(),
            'approved': user_reports.filter(status='approved').count(),
            'rejected': user_reports.filter(status='rejected').count(),
            'revision_required': user_reports.filter(status='revision_required').count(),
        }
    
    return Response(stats)