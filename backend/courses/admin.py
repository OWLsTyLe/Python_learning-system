from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Course, Topic, Lesson


class LessonInline(TabularInline):
    model = Lesson
    extra = 0
    fields = ['title', 'order', 'duration_minutes']


class TopicInline(TabularInline):
    model = Topic
    extra = 0
    fields = ['title', 'icon', 'order', 'difficulty', 'tag']


@admin.register(Course)
class CourseAdmin(ModelAdmin):
    list_display = ['title', 'created_at']
    search_fields = ['title']
    inlines = [TopicInline]


@admin.register(Topic)
class TopicAdmin(ModelAdmin):
    list_display = ['title', 'course', 'difficulty', 'tag', 'order']
    list_filter = ['course', 'difficulty', 'tag']
    search_fields = ['title']
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(ModelAdmin):
    list_display = ['title', 'topic', 'order', 'duration_minutes']
    list_filter = ['topic']
    search_fields = ['title']