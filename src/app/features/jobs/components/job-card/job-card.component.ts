import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Job, Favorite } from '../../../../core/models/job.model';
import * as FavActions from '../../../../store/favorites/favorites.actions';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  isFav(): boolean {
    return this.favoritesList.some((f) => f.offerId === this.job.slug);
  }

  toggleFav() {
    const currentUserId = this.authService.getCurrentUserId();

    if (!currentUserId) {
      Swal.fire({
        icon: 'warning',
        title: 'Connexion requise',
        text: 'Veuillez vous connecter pour ajouter des favoris.',
        showConfirmButton: true,
        background: '#1b1e23',
        color: '#fff',
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    const existingFav = this.favoritesList.find((f) => f.offerId === this.job.slug);

    if (existingFav && existingFav.id) {
      this.store.dispatch(
        FavActions.removeFavorite({
          id: existingFav.id,
          offerId: this.job.slug,
        }),
      );
    } else {
      const newFav: Favorite = {
        userId: currentUserId,
        offerId: this.job.slug,
        title: this.job.title,
        company: this.job.company_name,
        location: this.job.location,
      };
      this.store.dispatch(FavActions.addFavorite({ favorite: newFav }));
    }
  }
}