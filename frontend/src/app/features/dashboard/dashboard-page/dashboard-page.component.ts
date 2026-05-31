import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ProgressService } from '../../../core/services/progress.service';
import { ApiService } from '../../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
  user: any = null;
  loading = true;
  isDark = true;

  stats = [
    { icon: '🔥', value: '—', label: 'Днів поспіль' },
    { icon: '', value: '—', label: 'Уроків пройдено' },
    { icon: '', value: '—', label: 'Балів за тести' },
    { icon: '', value: '—', label: 'Сертифікатів' },
  ];

  topics: { id: number; title: string; totalLessons: number; progress: number }[] = [];
  activity: { text: string; time: string; color: string }[] = [];

  achievements = [
    { icon: '🏆', label: 'Відмінник', unlocked: false },
    { icon: '🔥', label: 'Тиждень',   unlocked: false },
    { icon: '🐍', label: 'Python pro', unlocked: false },
    { icon: '⚡', label: 'Швидкий',   unlocked: false },
  ];

  constructor(
    private auth: AuthService,
    private progressService: ProgressService,
    private api: ApiService,
    private theme: ThemeService,
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => { this.user = user; });
    this.theme.isDark$.subscribe(dark => this.isDark = dark);

    this.api.getCourses().subscribe(courses => {
      const allTopics = courses.flatMap((c: any) => c.topics);

      this.topics = allTopics.map((t: any) => ({
        id: t.id,
        title: t.title,
        totalLessons: t.lessons_count,
        progress: 0,
      }));

      this.progressService.getProgress().subscribe({
        next: (data) => this.applyProgress(data),
        error: (err) => console.error('Progress load error:', err),
        complete: () => { this.loading = false; },
      });
    });
  }

  toggleTheme() {
    this.theme.toggle();
  }

  private applyProgress(data: any) {
    const lessons: any[] = data.lesson_progress ?? [];
    const quizzes: any[] = data.quiz_results ?? [];

    const totalLessons = lessons.length;
    const totalScore = quizzes.reduce((sum: number, q: any) => sum + (q.score ?? 0), 0);

    const lessonsByTopic: Record<number, number> = {};
    for (const l of lessons) {
      lessonsByTopic[l.topic_id] = (lessonsByTopic[l.topic_id] ?? 0) + 1;
    }

    const quizByTopic: Record<number, { score: number; total: number }> = {};
    for (const q of quizzes) {
      const existing = quizByTopic[q.topic_id];
      const pct = q.score / (q.total || 1);
      if (!existing || pct > existing.score / (existing.total || 1)) {
        quizByTopic[q.topic_id] = { score: q.score, total: q.total };
      }
    }

    this.topics = this.topics.map(t => {
      const lessonPct = ((lessonsByTopic[t.id] ?? 0) / (t.totalLessons || 1)) * 50;
      const quiz = quizByTopic[t.id];
      const quizPct = quiz ? (quiz.score / (quiz.total || 1)) * 50 : 0;
      return { ...t, progress: Math.round(lessonPct + quizPct) };
    });

    const certs = this.topics.filter(t => t.progress === 100).length;

    this.stats = [
      { icon: '🔥', value: '7',                 label: 'Днів поспіль' },
      { icon: '',   value: String(totalLessons), label: 'Уроків пройдено' },
      { icon: '',   value: String(totalScore),   label: 'Балів за тести' },
      { icon: '',   value: String(certs),        label: 'Сертифікатів' },
    ];

    const allEvents = [
      ...lessons.map((l: any) => ({
        text: `Урок: топік ${l.topic_id}, урок ${l.lesson_id}`,
        time: l.completed_at,
        color: '#7c6af7',
        sort: new Date(l.completed_at).getTime(),
      })),
      ...quizzes.map((q: any) => ({
        text: `Тест: топік ${q.topic_id} — ${Math.round((q.score / q.total) * 100)}%`,
        time: q.completed_at,
        color: '#22d3a5',
        sort: new Date(q.completed_at).getTime(),
      })),
    ];

    this.activity = allEvents
      .sort((a, b) => b.sort - a.sort)
      .slice(0, 5)
      .map(e => ({
        text: e.text,
        time: this.relativeTime(new Date(e.time)),
        color: e.color,
      }));

    this.achievements[0].unlocked = quizzes.some((q: any) => q.score === q.total && q.total > 0);
    this.achievements[1].unlocked = true;
    this.achievements[2].unlocked = totalLessons >= 20;
    this.achievements[3].unlocked = totalLessons >= 5;
  }

  private relativeTime(date: Date): string {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 3600)   return `${Math.floor(diff / 60)} хв тому`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} год тому`;
    if (diff < 172800) return 'вчора';
    return `${Math.floor(diff / 86400)} дні тому`;
  }

  get username() {
    return this.user?.username || this.user?.email?.split('@')[0] || 'Користувач';
  }

  showLogoutModal = false;

logout() {
  this.showLogoutModal = true;
}

confirmLogout() {
  this.showLogoutModal = false;
  this.auth.logout();
}
}
