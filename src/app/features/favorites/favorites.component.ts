import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { JobCardComponent } from '../jobs/components/job-card/job-card.component';
import { AuthService } from '../../core/services/auth.service';
import { Job } from '../../core/models/job.model';
import { Favorite } from '../../core/models/favorite.model';
import * as FavActions from '../../store/favorites/favorites.actions';
import { selectAllFavorites } from '../../store/favorites/favorites.selectors';
import { selectAllApplications } from '../../store/applications/applications.selectors';
import { Application } from '../../core/models/application.model';
import * as AppActions from '../../store/applications/applications.actions';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, NavbarComponent, JobCardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  favorites$ = this.store.select(selectAllFavorites);
  favoritesList = toSignal(this.favorites$, { initialValue: [] as Favorite[] });

  applications$ = this.store.select(selectAllApplications);
  applicationsList = toSignal(this.applications$, { initialValue: [] as Application[] });

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.store.dispatch(FavActions.loadFavorites({ userId }));
      this.store.dispatch(AppActions.loadApps({ userId }));
    }
  }

  mapToJob(fav: Favorite): Job {
  return {
    slug: fav.offerId,
    title: fav.title,
    company_name: fav.company,
    location: fav.location,

    description: fav.description,
    remote: false,
    url: fav.url,
    tags: [],
    created_at: Date.now(),
    isFavorite: true,
  };
}
}