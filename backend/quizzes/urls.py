from django.urls import path
from .views import QuizDetailView

urlpatterns = [
    path('quizzes/<int:pk>/', QuizDetailView.as_view()),
]