import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth-guard.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [noAuthGuard] },
  { path: 'register', component: Register, canActivate: [noAuthGuard] },
  { path: 'jobs', loadComponent: () => import('./features/jobs/job-search/job-search.component').then(m => m.JobSearchComponent)},
  { path: 'favorites', loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent), canActivate: [authGuard]},
  { path: 'applications', loadComponent: () => import('./features/applications/applications.component').then(m => m.ApplicationsComponent), canActivate: [authGuard]},
  { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard]},
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: '**', redirectTo: 'jobs', pathMatch: 'full' },
];
