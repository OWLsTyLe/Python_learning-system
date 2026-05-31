from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline
from .models import Quiz, Question, Answer


class AnswerInline(TabularInline):
    model = Answer
    extra = 4


class QuestionInline(TabularInline):
    model = Question
    extra = 1


@admin.register(Quiz)
class QuizAdmin(ModelAdmin):
    list_display = ['title', 'topic', 'time_limit_minutes']
    search_fields = ['title']
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(ModelAdmin):
    list_display = ['text', 'quiz', 'order']
    search_fields = ['text']
    inlines = [AnswerInline]