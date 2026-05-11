import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-lesson-view',
  standalone: true,
  imports: [RouterLink, ],
  templateUrl: './lesson-view.component.html',
  styleUrl: './lesson-view.component.scss'
})
export class LessonViewComponent implements OnInit {
  lesson: any = null;
  topic: any = null;

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.getLesson(+id).subscribe(lesson => {
        this.lesson = lesson;
        this.api.getTopic(lesson.topic).subscribe(topic => {
          this.topic = topic;
        });
      });
    }
  }
}
