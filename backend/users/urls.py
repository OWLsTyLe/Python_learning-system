from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, MeView, EmailTokenObtainPairView, ProgressView, CompleteLessonView, CompleteQuizView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', EmailTokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view()),
    path('progress/', ProgressView.as_view()),
    path('complete-lesson/', CompleteLessonView.as_view()),
    path('complete-quiz/', CompleteQuizView.as_view()),
]