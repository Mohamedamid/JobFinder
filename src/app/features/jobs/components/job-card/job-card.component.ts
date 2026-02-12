// import { Component, Input, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Store } from '@ngrx/store';
// import { Job, Favorite } from '../../../../core/models/job.model';
// import * as FavActions from '../../../../store/favorites/favorites.actions';
// import { AuthService } from '../../../../core/services/auth.service';
// import { Application } from '../../../../core/models/application.model';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';

// @Component({
//   selector: 'app-job-card',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './job-card.component.html',
//   styleUrl: './job-card.component.scss',
// })
// export class JobCardComponent {
//   @Input({ required: true }) job!: Job;
//   @Input() favoritesList: Favorite[] = [];
//   @Input() applicationsList: Application[] = [];

//   private store = inject(Store);
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   isFav(): boolean {
//     return this.favoritesList.some((f) => f.offerId === this.job.slug);
//   }

//   toggleFav() {
//     const currentUserId = this.authService.getCurrentUserId();

//     if (!currentUserId) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Connexion requise',
//         text: 'Veuillez vous connecter pour ajouter des favoris.',
//         showConfirmButton: true,
//         background: '#1b1e23',
//         color: '#fff',
//       }).then(() => {
//         this.router.navigate(['/login']);
//       });
//       return;
//     }

//     const existingFav = this.favoritesList.find((f) => f.offerId === this.job.slug);

//     if (existingFav && existingFav.id) {
//       this.store.dispatch(
//         FavActions.removeFavorite({
//           id: existingFav.id,
//           offerId: this.job.slug,
//         }),
//       );
//     } else {
//       const newFav: Favorite = {
//         userId: currentUserId,
//         offerId: this.job.slug,
//         title: this.job.title,
//         company: this.job.company_name,
//         location: this.job.location,
//       };
//       this.store.dispatch(FavActions.addFavorite({ favorite: newFav }));
//     }
//   }
// }

import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Models
import { Job, Favorite } from '../../../../core/models/job.model';
import { Application } from '../../../../core/models/application.model';

// Actions & Services
import * as FavActions from '../../../../store/favorites/favorites.actions';
import * as AppActions from '../../../../store/applications/applications.actions'; // Assure-toi d'avoir créé ces actions
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
  
  // ✅ NOUVEAU : Liste des candidatures pour vérifier si déjà postulé
  @Input() applicationsList: Application[] = [];

  private store = inject(Store);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ==============================
  // 1. LOGIQUE FAVORIS (Existante)
  // ==============================
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
        // isFavorite: true
      };
      this.store.dispatch(FavActions.addFavorite({ favorite: newFav }));
    }
  }

  // ==============================
  // 2. LOGIQUE CANDIDATURE (Nouvelle)
  // ==============================

  // Vérifie si l'offre est déjà dans la liste des applications
  isApplied(): boolean {
    return this.applicationsList?.some((app) => app.offerId === this.job.slug);
  }

  apply() {
    // A. Vérifier Authentification
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.showAuthAlert(); return;
    }

    // B. Vérifier si déjà postulé
    if (this.isApplied()) {
      Swal.fire({
        icon: 'info',
        title: 'Déjà suivi',
        text: 'Vous suivez déjà cette candidature.',
        background: '#1b1e23', color: '#fff', confirmButtonColor: '#f09819'
      });
      return;
    }

    // C. Créer l'objet Application
    const newApp: Application = {
      userId: userId,
      offerId: this.job.slug,
      title: this.job.title,
      company: this.job.company_name,
      location: this.job.location,
      url: this.job.url,
      status: 'en_attente', // Statut par défaut
      notes: '',
      dateAdded: new Date().toISOString()
    };

    // D. Dispatcher l'action vers le Store
    this.store.dispatch(AppActions.addApp({ app: newApp }));

    // E. Feedback Utilisateur
    Swal.fire({
      icon: 'success',
      title: 'Candidature suivie !',
      text: 'Retrouvez-la dans votre espace "Suivi".',
      showConfirmButton: false,
      timer: 2000,
      background: '#1b1e23', color: '#fff'
    });
  }

  // Helper pour l'alerte de connexion
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