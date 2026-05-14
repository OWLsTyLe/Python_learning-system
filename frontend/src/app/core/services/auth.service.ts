import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.api.getMe().subscribe(user => this.userSubject.next(user));
    }
  }

  login(email: string, password: string) {
    return this.api.login({ email, password });
  }

  register(email: string, username: string, password: string, password2: string) {
    return this.api.register({ email, username, password, password2 });
  }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  get currentUser() {
    return this.userSubject.value;
  }

  get isLoggedIn() {
    return !!localStorage.getItem('access_token');
  }
}
