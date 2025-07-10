from rest_framework import serializers
from .models import Report, ReportComment

class ReportCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = ReportComment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class ReportSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    comments = ReportCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = '__all__'
        read_only_fields = ['user', 'reviewed_by', 'reviewed_at', 'submission_date', 'created_at', 'updated_at']

class ReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['title', 'report_type', 'content', 'file', 'report_date']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ReportReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['status', 'feedback']