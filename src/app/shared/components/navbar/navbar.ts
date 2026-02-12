import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import * as FavActions from '../../../store/favorites/favorites.actions';
import * as AppActions from '../../../store/applications/applications.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  authService = inject(AuthService);
  private store = inject(Store);
  private router = inject(Router);

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.store.dispatch(FavActions.clearFavorites());
    this.store.dispatch(AppActions.clearApps());
    this.authService.logout();
    this.router.navigate(['/jobs']);
  }
}