from rest_framework import serializers
from .models import Course, Topic, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order', 'duration_minutes', 'topic']

class TopicSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    lessons_count = serializers.SerializerMethodField()
    quiz_id = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'title', 'description', 'icon', 'order', 'difficulty', 'lessons_count', 'lessons', 'quiz_id',
                  'tag']
    def get_lessons_count(self, obj):
        return obj.lessons.count()

    def get_quiz_id(self, obj):
        try:
            return obj.quiz.id
        except:
            return None

class CourseSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'created_at', 'topics']