import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses/`);
  }

  getCourse(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/courses/${id}/`);
  }

  getLesson(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/lessons/${id}/`);
  }

  getTopic(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/topics/${id}/`);
  }
}
