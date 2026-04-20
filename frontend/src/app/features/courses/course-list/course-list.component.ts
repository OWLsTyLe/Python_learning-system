import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NgFor} from '@angular/common';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.scss'
})
export class CourseListComponent {
  activeFilter = 'all';

  filters = [
    { id: 'all', label: 'Всі теми' },
    { id: 'python', label: 'Python' },
    { id: 'django', label: 'Django' },
    { id: 'rest', label: 'REST API' },
  ];

  topics = [
    { id: 1, icon: '🐍', title: 'Вступ до Python', desc: 'Синтаксис, змінні, типи даних', lessons: 8, difficulty: 'Легко', tag: 'python' },
    { id: 2, icon: '🔀', title: 'Умови та цикли', desc: 'if/else, for, while, break/continue', lessons: 6, difficulty: 'Легко', tag: 'python' },
    { id: 3, icon: '📦', title: 'Функції та модулі', desc: 'def, lambda, *args, **kwargs', lessons: 9, difficulty: 'Середньо', tag: 'python' },
    { id: 4, icon: '🧱', title: 'ООП в Python', desc: 'Класи, спадкування, магічні методи', lessons: 10, difficulty: 'Середньо', tag: 'python' },
    { id: 5, icon: '🌐', title: 'Django основи', desc: 'MTV, URL routing, views, templates', lessons: 12, difficulty: 'Середньо', tag: 'django' },
    { id: 6, icon: '🗄️', title: 'Django ORM', desc: 'Моделі, міграції, QuerySet', lessons: 10, difficulty: 'Середньо', tag: 'django' },
    { id: 7, icon: '🔐', title: 'Аутентифікація', desc: 'User model, login, JWT, permissions', lessons: 8, difficulty: 'Складно', tag: 'django' },
    { id: 8, icon: '🚀', title: 'REST API + DRF', desc: 'Serializers, ViewSets, тести, Docker', lessons: 14, difficulty: 'Складно', tag: 'rest' },
  ];

  get filtered() {
    if (this.activeFilter === 'all') return this.topics;
    return this.topics.filter(t => t.tag === this.activeFilter);
  }

  setFilter(id: string) {
    this.activeFilter = id;
  }

  get progress() {
    return Math.round((3 / this.topics.length) * 100);
  }
}
