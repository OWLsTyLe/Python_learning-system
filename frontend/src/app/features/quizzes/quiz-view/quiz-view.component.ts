import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.scss'
})
export class QuizViewComponent {
  currentQuestion = 1;
  totalQuestions = 5;
  selectedAnswer: number | null = null;
  showExplanation = false;
  timeLeft = '08:42';

  question = {
    text: 'Що виведе наступний код?',
    code: [
      { type: 'kw', text: 'class' }, { type: 'plain', text: ' ' },
      { type: 'cls', text: 'Animal' }, { type: 'plain', text: ':' },
    ]
  };

  answers = [
    { id: 1, label: 'A', text: 'Animal.speak()' },
    { id: 2, label: 'B', text: 'Я Кіт' },
    { id: 3, label: 'C', text: 'Кіт.name' },
    { id: 4, label: 'D', text: 'TypeError' },
  ];

  correctAnswer = 2;

  explanation = 'Метод speak() повертає рядок. При виклику Python підставляє імʼя з атрибута self.name.';

  selectAnswer(id: number) {
    if (this.showExplanation) return;
    this.selectedAnswer = id;
    this.showExplanation = true;
  }

  get progress() {
    return (this.currentQuestion / this.totalQuestions) * 100;
  }
}
