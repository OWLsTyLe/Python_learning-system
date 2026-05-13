from rest_framework import generics
from .models import Quiz
from .serializers import QuizSerializer


class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer