import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home-page/home-page.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardPageComponent },
];
