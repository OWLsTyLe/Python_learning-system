import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent implements OnInit {
  activeFilter = 'all';
  topics: any[] = [];

  filters = [
    { id: 'all', label: 'Всі теми' },
    { id: 'python', label: 'Python' },
    { id: 'django', label: 'Django' },
    { id: 'rest', label: 'REST API' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getCourses().subscribe(courses => {
      if (courses.length > 0) {
        this.topics = courses[0].topics;
      }
    });
  }

  get filtered() {
    if (this.activeFilter === 'all') return this.topics;
    return this.topics.filter(t => t.tag === this.activeFilter);
  }

  setFilter(id: string) {
    this.activeFilter = id;
  }

  get progress() {
    return this.topics.length ? Math.round((3 / this.topics.length) * 100) : 0;
  }
}
