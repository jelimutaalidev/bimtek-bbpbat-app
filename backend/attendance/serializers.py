from rest_framework import serializers
from .models import AttendanceRecord, AttendanceSettings

class AttendanceRecordSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class AttendanceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        fields = ['date', 'status', 'check_in_time', 'check_out_time', 
                 'check_in_latitude', 'check_in_longitude', 'check_out_latitude', 
                 'check_out_longitude', 'check_in_distance', 'check_out_distance', 'notes']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class AttendanceSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceSettings
        fields = '__all__'