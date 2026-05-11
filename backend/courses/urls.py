from django.urls import path
from .views import CourseListView, CourseDetailView, TopicDetailView, LessonDetailView

urlpatterns = [
    path('courses/', CourseListView.as_view()),
    path('courses/<int:pk>/', CourseDetailView.as_view()),
    path('topics/<int:pk>/', TopicDetailView.as_view()),
    path('lessons/<int:pk>/', LessonDetailView.as_view()),
]