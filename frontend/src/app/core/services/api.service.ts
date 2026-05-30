import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses/`);
  }
  getLesson(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/lessons/${id}/`);
  }

  getTopic(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/topics/${id}/`);
  }

  getQuiz(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/quizzes/${id}/`);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register/`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, data);
  }

  getMe(): Observable<any> {
  return this.http.get(`${this.baseUrl}/auth/me/`); // прибрали ручний headers
}

getProgress(): Observable<any> {
  return this.http.get(`${this.baseUrl}/auth/progress/`);
}

completeLesson(lessonId: number, topicId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/complete-lesson/`, {
    lesson_id: lessonId,
    topic_id: topicId
  });
}

completeQuiz(quizId: number, topicId: number, score: number, total: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/auth/complete-quiz/`, {
    quiz_id: quizId,
    topic_id: topicId,
    score,
    total
  });
}
googleAuth(token: string): Observable<{ access: string; refresh: string }> {
  return this.http.post<{ access: string; refresh: string }>(
    `${this.baseUrl}/auth/google/`,
    { token }
  );
  }
}
