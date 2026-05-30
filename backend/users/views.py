import os

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, EmailTokenObtainPairSerializer
from .models import LessonProgress, QuizResult
from .serializers import LessonProgressSerializer, QuizResultSerializer, UserProgressSerializer
from django.utils import timezone



from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

User = get_user_model()

GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')


class GoogleAuthView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Токен відсутній'}, status=400)

        try:
            info = id_token.verify_oauth2_token(
                token,
                google_requests.Request(),
                GOOGLE_CLIENT_ID
            )
        except ValueError:
            return Response({'error': 'Невалідний токен'}, status=400)

        email = info.get('email')
        if not email:
            return Response({'error': 'Email не знайдено'}, status=400)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': email.split('@')[0],
                'first_name': info.get('given_name', ''),
                'last_name': info.get('family_name', ''),
            }
        )

        if created and User.objects.filter(username=user.username).exclude(pk=user.pk).exists():
            user.username = f"{user.username}_{user.pk}"
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data,
        })


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class ProgressView(generics.RetrieveAPIView):
    serializer_class = UserProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class CompleteLessonView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        lesson_id = request.data.get('lesson_id')
        topic_id = request.data.get('topic_id')
        LessonProgress.objects.get_or_create(
            user=request.user,
            lesson_id=lesson_id,
            defaults={'topic_id': topic_id}
        )
        return Response({'status': 'ok'})


class CompleteQuizView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        quiz_id = request.data.get('quiz_id')
        topic_id = request.data.get('topic_id')
        score = int(request.data.get('score', 0))
        total = int(request.data.get('total', 0))

        existing = QuizResult.objects.filter(
            user=request.user,
            quiz_id=quiz_id
        ).first()

        if existing:
            if score > existing.score:
                existing.score = score
                existing.total = total
                existing.completed_at = timezone.now()
                existing.save()
        else:
            QuizResult.objects.create(
                user=request.user,
                quiz_id=quiz_id,
                topic_id=topic_id,
                score=score,
                total=total,
            )

        return Response({'status': 'ok'})