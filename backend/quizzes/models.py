from django.db import models
from courses.models import Topic

class Quiz(models.Model):
    topic = models.OneToOneField(Topic, on_delete=models.CASCADE, related_name='quiz')
    title = models.CharField(max_length=200)
    time_limit_minutes = models.PositiveIntegerField(default=10)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Тест'
        verbose_name_plural = 'Тести'

class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    code_snippet = models.TextField(blank=True)
    explanation = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.text[:50]

    class Meta:
        ordering = ['order']
        verbose_name = 'Питання'
        verbose_name_plural = 'Питання'

class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

    class Meta:
        verbose_name = 'Відповідь'
        verbose_name_plural = 'Відповіді'

