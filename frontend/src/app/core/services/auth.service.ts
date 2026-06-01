import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private googleInitialized = false;

  constructor(private api: ApiService, private router: Router) {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.api.getMe().subscribe({
        next: user => this.userSubject.next(user),
        error: () => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      });
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

  initGoogleLogin(callback: (credential: string) => void) {
    if (this.googleInitialized) return;
    this.googleInitialized = true;

    google.accounts.id.initialize({
      client_id: '867080911580-pdlpkpatierapgpm0tcs0lj6fh20ecml.apps.googleusercontent.com',
      callback: (response: any) => callback(response.credential)
    });
  }

  loginWithGoogle(credential: string) {
    return this.api.googleAuth(credential);
  }
}
