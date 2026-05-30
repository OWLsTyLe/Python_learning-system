import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MarkdownComponent } from 'ngx-markdown';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import hljs from 'highlight.js';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [RouterLink, MarkdownComponent],
  templateUrl: './lesson-view.component.html',
  styleUrl: './lesson-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LessonViewComponent implements OnInit {
  lesson: any = null;
  topic: any = null;
  nextLesson: any = null;
  isLastLesson = false;
  codeHighlighted = false;
  user: any = null;
  isDark = true;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private theme: ThemeService
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.theme.isDark$.subscribe(dark => this.isDark = dark);
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadLesson(+id);
    });
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.auth.logout();
  }

  loadLesson(id: number) {
    this.api.getLesson(id).subscribe(lesson => {
      this.lesson = lesson;
      this.codeHighlighted = false;

      if (this.auth.isLoggedIn) {
        this.api.completeLesson(id, lesson.topic).subscribe({
          error: (err) => console.error('completeLesson error:', err)
        });
      }

      this.api.getTopic(lesson.topic).subscribe(topic => {
        this.topic = topic;
        const lessons = topic.lessons;
        const currentIndex = lessons.findIndex((l: any) => l.id === id);
        if (currentIndex < lessons.length - 1) {
          this.nextLesson = lessons[currentIndex + 1];
          this.isLastLesson = false;
        } else {
          this.nextLesson = null;
          this.isLastLesson = true;
        }
        setTimeout(() => {
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block as HTMLElement);
          });
          this.codeHighlighted = true;
        }, 100);
      });
    });
  }
}
