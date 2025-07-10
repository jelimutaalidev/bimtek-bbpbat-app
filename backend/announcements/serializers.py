from rest_framework import serializers
from .models import Announcement, AnnouncementRead

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    target_audience_display = serializers.CharField(source='get_target_audience_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['created_by', 'published_at', 'created_at', 'updated_at']

    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return AnnouncementRead.objects.filter(announcement=obj, user=request.user).exists()
        return False

class AnnouncementCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['title', 'content', 'priority', 'target_audience', 'specific_placement', 
                 'status', 'expires_at', 'attachment']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        if validated_data.get('status') == 'published':
            from django.utils import timezone
            validated_data['published_at'] = timezone.now()
        return super().create(validated_data)

class AnnouncementReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnnouncementRead
        fields = '__all__'
        read_only_fields = ['user', 'read_at']