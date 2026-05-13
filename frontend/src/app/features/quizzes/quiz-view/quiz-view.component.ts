import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.scss'
})
export class QuizViewComponent implements OnInit {
  quiz: any = null;
  currentIndex = 0;
  selectedAnswer: number | null = null;
  showExplanation = false;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getQuiz(+id).subscribe(quiz => {
        this.quiz = quiz;
      });
    }
  }

  get currentQuestion() {
    return this.quiz?.questions[this.currentIndex];
  }

  get progress() {
    if (!this.quiz) return 0;
    return ((this.currentIndex + 1) / this.quiz.questions.length) * 100;
  }

  selectAnswer(id: number) {
    if (this.showExplanation) return;
    this.selectedAnswer = id;
    this.showExplanation = true;
  }

  get correctAnswerId() {
    return this.currentQuestion?.answers.find((a: any) => a.is_correct)?.id;
  }

  nextQuestion() {
    if (this.currentIndex < this.quiz.questions.length - 1) {
      this.currentIndex++;
      this.selectedAnswer = null;
      this.showExplanation = false;
    }
  }

  get isLastQuestion() {
    return this.quiz && this.currentIndex === this.quiz.questions.length - 1;
  }
}
