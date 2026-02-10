import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
//   { path: 'jobs', component: JobSearchComponent, canActivate: [authGuard] },
//   { path: 'jobs/:slug', component: JobDetailsComponent, canActivate: [authGuard] },
//   { path: 'applications', component: ApplicationsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];