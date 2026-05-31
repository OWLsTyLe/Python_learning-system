import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

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
  user: any = null;
  isDark = true;

  filters = [
    { id: 'all', label: 'Всі теми' },
    { id: 'python', label: 'Python' },
    { id: 'django', label: 'Django' },
    { id: 'rest', label: 'REST API' },
  ];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private theme: ThemeService,
    private route: ActivatedRoute  // ← додано
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => this.user = user);
    this.theme.isDark$.subscribe(dark => this.isDark = dark);

    this.api.getCourses().subscribe(courses => {
      if (courses.length > 0) {
        this.topics = courses[0].topics;
      }

      // ← читаємо tag з URL після завантаження тем
      this.route.queryParams.subscribe(params => {
        if (params['tag']) {
          this.activeFilter = params['tag'];
        }
      });
    });
  }

  toggleTheme() {
    this.theme.toggle();
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


  showLogoutModal = false;

logout() {
  this.showLogoutModal = true;
}

confirmLogout() {
  this.showLogoutModal = false;
  this.auth.logout();
}
}
