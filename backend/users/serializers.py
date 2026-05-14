from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import LessonProgress, QuizResult

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Паролі не співпадають")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username']


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ['lesson_id', 'topic_id', 'completed_at']


class QuizResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizResult
        fields = ['quiz_id', 'topic_id', 'score', 'total', 'completed_at']


class UserProgressSerializer(serializers.ModelSerializer):
    lesson_progress = LessonProgressSerializer(many=True, read_only=True)
    quiz_results = QuizResultSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'lesson_progress', 'quiz_results']