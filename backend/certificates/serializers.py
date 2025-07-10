from rest_framework import serializers
from .models import Certificate, CertificateTemplate

class CertificateSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Certificate
        fields = '__all__'
        read_only_fields = ['user', 'certificate_number', 'verification_code', 'issued_by', 'issued_at', 'created_at', 'updated_at']

class CertificateTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CertificateTemplate
        fields = '__all__'