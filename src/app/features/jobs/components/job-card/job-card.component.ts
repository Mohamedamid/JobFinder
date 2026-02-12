import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Job } from '../../../../core/models/job.model';
import { Favorite } from '../../../../core/models/favorite.model';
import { Application } from '../../../../core/models/application.model';

import * as FavActions from '../../../../store/favorites/favorites.actions';
import * as AppActions from '../../../../store/applications/applications.actions';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-card.component.html',
  styleUrl: './job-card.component.scss',
})
export class JobCardComponent {
  @Input({ required: true }) job!: Job;
  @Input() favoritesList: Favorite[] = [];
  @Input() applicationsList: Application[] = [];

  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  isFav(): boolean {
    return this.favoritesList?.some((f) => f.offerId === this.job.slug);
  }

  toggleFav() {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.showAuthAlert(); return;
    }

    const existingFav = this.favoritesList.find((f) => f.offerId === this.job.slug);

    if (existingFav && existingFav.id) {
      this.store.dispatch(FavActions.removeFavorite({ id: existingFav.id, offerId: this.job.slug }));
    } else {
      const newFav: Favorite = {
        userId: userId,
        offerId: this.job.slug,
        title: this.job.title,
        company: this.job.company_name,
        location: this.job.location,
      
      };
      this.store.dispatch(FavActions.addFavorite({ favorite: newFav }));
    }
  }

  isApplied(): boolean {
    return this.applicationsList?.some((app) => app.offerId === this.job.slug);
  }

  apply() {
  
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.showAuthAlert(); return;
    }

    if (this.isApplied()) {
      Swal.fire({
        icon: 'info',
        title: 'Déjà suivi',
        text: 'Vous suivez déjà cette candidature.',
        background: '#1b1e23', color: '#fff', confirmButtonColor: '#f09819'
      });
      return;
    }

    const newApp: Application = {
      userId: userId,
      offerId: this.job.slug,
      title: this.job.title,
      company: this.job.company_name,
      location: this.job.location,
      url: this.job.url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString()
    };

    this.store.dispatch(AppActions.addApp({ app: newApp }));

    Swal.fire({
      icon: 'success',
      title: 'Candidature suivie !',
      text: 'Retrouvez-la dans votre espace "Suivi".',
      showConfirmButton: false,
      timer: 2000,
      background: '#1b1e23', color: '#fff'
    });
  }

  private showAuthAlert() {
    Swal.fire({
      icon: 'warning',
      title: 'Connexion requise',
      text: 'Veuillez vous connecter pour effectuer cette action.',
      showConfirmButton: true,
      confirmButtonText: 'Se connecter',
      background: '#1b1e23', color: '#fff', confirmButtonColor: '#f09819'
    }).then((res) => {
      if (res.isConfirmed) this.router.navigate(['/login']);
    });
  }
}