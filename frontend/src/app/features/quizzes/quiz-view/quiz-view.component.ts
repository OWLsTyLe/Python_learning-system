import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-quiz-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './quiz-view.component.html',
  styleUrl: './quiz-view.component.scss'
})
export class QuizViewComponent implements OnInit {
  quiz: any = null;
  currentIndex = 0;
  selectedAnswer: number | null = null;
  showExplanation = false;
  user: any = null;

  correctCount = 0;
  quizFinished = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
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

    if (id === this.correctAnswerId) {
      this.correctCount++;
    }
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

  finishQuiz() {
    if (this.quizFinished) return;
    this.quizFinished = true;

    const total = this.quiz.questions.length;
    const score = this.correctCount;
    const quizId = this.quiz.id;
    const topicId = this.quiz.topic_id ?? this.quiz.topic;

    this.api.completeQuiz(quizId, topicId, score, total).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        console.error('Помилка збереження тесту:', err);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  logout() {
    this.auth.logout();
  }
}
