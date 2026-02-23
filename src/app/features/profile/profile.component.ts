import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Observable, map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import { Store } from '@ngrx/store';
import { User } from '../../core/models/user.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
import * as AppActions from '../../store/applications/applications.actions';
import * as FavActions from '../../store/favorites/favorites.actions';
import { selectAllApplications } from '../../store/applications/applications.selectors';
import { selectAllFavorites } from '../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private appService = inject(ApplicationService);
  private store = inject(Store);
  private router = inject(Router);

  user: User | null = null;
  originalUserData: User | null = null;

  favCount$: Observable<number> | undefined;
  appCount$: Observable<number> | undefined;

  isEditing = false;
  isLoading = false;

  ngOnInit() {
    this.user = this.authService.getUser();

    if (this.user) {
      this.originalUserData = { ...this.user };

      const userId = this.user.id; 
      
      this.store.dispatch(AppActions.loadApps({ userId: userId as any })); 
      this.store.dispatch(FavActions.loadFavorites({ userId: userId as any }));

      this.appCount$ = this.store.select(selectAllApplications).pipe(
        map((apps: any[]) => apps ? apps.length : 0)
      );

      this.favCount$ = this.store.select(selectAllFavorites).pipe(
        map((favs: any[]) => favs ? favs.length : 0)
      );

    } else {
      this.router.navigate(['/jobs']);
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user && this.originalUserData) {
      this.user = { ...this.originalUserData };
    }
  }

  saveProfile() {
    if (!this.user) return;
    this.isLoading = true;

    this.authService.updateProfile(this.user).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('user_session', JSON.stringify(updatedUser));
        this.originalUserData = { ...updatedUser };
        this.isEditing = false;
        this.isLoading = false;

        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Profil mis à jour !',
          background: '#1b1e23',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: () => {
        this.isLoading = false;
        Swal.fire({ icon: 'error', title: 'Erreur', background: '#1b1e23', color: '#fff' });
      },
    });
    this.isEditing = false;
  }

  deleteAccount() {
    Swal.fire({
      title: 'Supprimer votre compte ?',
      text: 'Toutes vos données (Favoris & Candidatures) seront perdues !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Oui, tout supprimer',
      cancelButtonText: 'Annuler',
      background: '#1b1e23',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed && this.user) {

        const userId = this.user.id as any; 

        this.store.dispatch(FavActions.deleteAllFavorites({ userId }));
        this.store.dispatch(AppActions.deleteAllApplications({ userId }));

        setTimeout(() => {
          this.authService.deleteAccount(this.user!.id).subscribe(() => {
            this.authService.logout();
            this.router.navigate(['/jobs']);
            Swal.fire({
              title: 'Supprimé!',
              text: 'Compte et données supprimés.',
              icon: 'success',
              background: '#1b1e23',
              color: '#fff',
            });
          });
        }, 500); 
      }
    });
  }
}