from django.db import models
from ckeditor.fields import RichTextField
from markdownx.models import MarkdownxField


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курси'


class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=10, default='📚')
    order = models.PositiveIntegerField(default=0)
    difficulty = models.CharField(max_length=20, choices=[
        ('easy', 'Легко'),
        ('medium', 'Середньо'),
        ('hard', 'Складно'),
    ], default='easy')
    tag = models.CharField(max_length=20, choices=[
        ('python', 'Python'),
        ('django', 'Django'),
        ('rest', 'REST API'),
    ], default='python', blank=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
        verbose_name = 'Тема'
        verbose_name_plural = 'Теми'

class Lesson(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200)
    content = MarkdownxField()
    order = models.PositiveIntegerField(default=0)
    duration_minutes = models.PositiveIntegerField(default=10)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['order']
        verbose_name = 'Урок'
        verbose_name_plural = 'Уроки'