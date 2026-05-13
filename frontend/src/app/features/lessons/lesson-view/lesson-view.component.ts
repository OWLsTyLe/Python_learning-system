import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MarkdownComponent } from 'ngx-markdown';
import { ApiService } from '../../../core/services/api.service';
import hljs from 'highlight.js';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [RouterLink, NgIf, MarkdownComponent],
  templateUrl: './lesson-view.component.html',
  styleUrl: './lesson-view.component.scss'
})
export class LessonViewComponent implements OnInit {
  lesson: any = null;
  topic: any = null;
  nextLesson: any = null;
  isLastLesson = false;
  codeHighlighted = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadLesson(+id);
    });
  }

  loadLesson(id: number) {
    this.api.getLesson(id).subscribe(lesson => {
      this.lesson = lesson;
      this.codeHighlighted = false;
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
