from django.contrib import admin
from .models import Course, Topic, Lesson


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ['title', 'order', 'duration_minutes']


class TopicInline(admin.TabularInline):
    model = Topic
    extra = 0
    fields = ['title', 'icon', 'order', 'difficulty', 'tag']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at']
    inlines = [TopicInline]


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'difficulty', 'tag', 'order']
    list_filter = ['course', 'difficulty', 'tag']
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'topic', 'order', 'duration_minutes']