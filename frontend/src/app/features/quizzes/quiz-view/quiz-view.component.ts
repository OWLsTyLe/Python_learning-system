import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

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
  isDark = true;
  correctCount = 0;
  quizFinished = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    private theme: ThemeService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.theme.isDark$.subscribe(dark => this.isDark = dark);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getQuiz(+id).subscribe(quiz => { this.quiz = quiz; });
    }
  }

  toggleTheme() { this.theme.toggle(); }

showLogoutModal = false;

logout() {
  this.showLogoutModal = true;
}

confirmLogout() {
  this.showLogoutModal = false;
  this.auth.logout();
}


  get currentQuestion() { return this.quiz?.questions[this.currentIndex]; }

  get progress() {
    if (!this.quiz) return 0;
    return ((this.currentIndex + 1) / this.quiz.questions.length) * 100;
  }

  selectAnswer(id: number) {
    if (this.showExplanation) return;
    this.selectedAnswer = id;
    this.showExplanation = true;
    if (id === this.correctAnswerId) this.correctCount++;
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
      error: () => this.router.navigate(['/dashboard']),
    });
  }
}
