import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDark = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDark.asObservable();

  constructor() {
    const saved = localStorage.getItem('theme');
    const dark = saved ? saved === 'dark' : true;
    this.isDark.next(dark);
    this.apply(dark);
  }

  toggle() {
    const next = !this.isDark.value;
    this.isDark.next(next);
    this.apply(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  private apply(dark: boolean) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  get current() {
    return this.isDark.value;
  }
}
