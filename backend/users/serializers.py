from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, UserProfile, Document

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'user_type', 
                 'phone_number', 'institution', 'first_name', 'last_name']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password tidak cocok")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    access_code = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        access_code = attrs.get('access_code')

        if username and access_code:
            try:
                user = User.objects.get(username=username, access_code=access_code)
                if not user.is_active:
                    raise serializers.ValidationError('Akun tidak aktif')
                attrs['user'] = user
            except User.DoesNotExist:
                raise serializers.ValidationError('Username atau kode akses tidak valid')
        else:
            raise serializers.ValidationError('Username dan kode akses wajib diisi')

        return attrs

class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError('Akun tidak aktif')
                if user.user_type != 'admin':
                    raise serializers.ValidationError('Akses ditolak')
                attrs['user'] = user
            else:
                raise serializers.ValidationError('Username atau password tidak valid')
        else:
            raise serializers.ValidationError('Username dan password wajib diisi')

        return attrs

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'
        read_only_fields = ['user', 'file_size', 'original_filename', 'is_verified', 
                           'verified_by', 'verified_at', 'created_at', 'updated_at']

    def create(self, validated_data):
        file = validated_data['file']
        validated_data['original_filename'] = file.name
        validated_data['file_size'] = file.size
        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type',
                 'phone_number', 'institution', 'is_profile_complete', 'is_documents_complete',
                 'is_payment_complete', 'registration_number', 'created_at', 'profile', 'documents']
        read_only_fields = ['id', 'username', 'registration_number', 'created_at']