import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  stats = [
    { icon: '🔥', value: '7', label: 'Днів поспіль' },
    { icon: '', value: '24', label: 'Уроків пройдено' },
    { icon: '', value: '840', label: 'Балів за тести' },
    { icon: '', value: '1', label: 'Сертифікатів' },
  ];

  topics = [
    { title: 'Вступ до Python', progress: 100 },
    { title: 'Умови та цикли', progress: 100 },
    { title: 'Функції та модулі', progress: 75 },
    { title: 'ООП в Python', progress: 28 },
    { title: 'Django основи', progress: 0 },
    { title: 'Django ORM', progress: 0 },
  ];

  activity = [
    { text: 'Урок: Методи та self', time: '2 год тому', color: '#7c6af7' },
    { text: 'Тест: Змінні — 90%', time: 'вчора', color: '#22d3a5' },
    { text: 'Урок: Lambda функції', time: 'вчора', color: '#7c6af7' },
    { text: 'Тест: Цикли — 100%', time: '2 дні тому', color: '#f59e0b' },
  ];

  achievements = [
    { icon: '🏆', label: 'Відмінник' },
    { icon: '🔥', label: 'Тиждень' },
    { icon: '🐍', label: 'Python pro' },
    { icon: '⚡', label: 'Швидкий' },
  ];
}
