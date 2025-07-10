from rest_framework import serializers
from .models import Registration, PlacementUnit, RegistrationPeriod
from users.models import User

class PlacementUnitSerializer(serializers.ModelSerializer):
    student_available_quota = serializers.ReadOnlyField()
    general_available_quota = serializers.ReadOnlyField()
    student_used_quota = serializers.ReadOnlyField()
    general_used_quota = serializers.ReadOnlyField()

    class Meta:
        model = PlacementUnit
        fields = '__all__'

class RegistrationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['full_name', 'institution', 'phone_number', 'supervisor_name', 
                 'supervisor_phone', 'placement_unit', 'application_letter']

    def create(self, validated_data):
        # Create user first
        user_data = {
            'email': f"temp_{validated_data['phone_number']}@bbpbat.temp",
            'user_type': self.context['user_type'],
            'phone_number': validated_data['phone_number'],
            'institution': validated_data['institution'],
            'first_name': validated_data['full_name'].split()[0],
            'last_name': ' '.join(validated_data['full_name'].split()[1:]) if len(validated_data['full_name'].split()) > 1 else '',
        }
        
        # Generate temporary username
        import uuid
        user_data['username'] = f"temp_{str(uuid.uuid4())[:8]}"
        
        user = User.objects.create(**user_data)
        validated_data['user'] = user
        
        return super().create(validated_data)

class RegistrationSerializer(serializers.ModelSerializer):
    placement_unit_name = serializers.CharField(source='placement_unit.name', read_only=True)
    user_type = serializers.CharField(source='user.user_type', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    access_code = serializers.CharField(source='user.access_code', read_only=True)

    class Meta:
        model = Registration
        fields = '__all__'
        read_only_fields = ['user', 'approved_by', 'approved_at', 'created_at', 'updated_at']

class RegistrationApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = ['status', 'rejection_reason', 'start_date', 'end_date', 'admin_notes']

class RegistrationPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistrationPeriod
        fields = '__all__'