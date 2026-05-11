import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { LessonViewComponent } from './features/lessons/lesson-view/lesson-view.component';
import { QuizViewComponent } from './features/quizzes/quiz-view/quiz-view.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'courses/:id', component: CourseListComponent },
  { path: 'lesson/:id', component: LessonViewComponent },
  { path: 'quiz/:id', component: QuizViewComponent },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
];
