import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { NavbarComponent } from '../../shared/components/navbar/navbar';
import { AuthService } from '../../core/services/auth.service';
import { Application } from '../../core/models/application.model';
import * as AppActions from '../../store/applications/applications.actions';
import Swal from 'sweetalert2';
import { selectAllApplications } from '../../store/applications/applications.selectors';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, RouterLink],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  apps$ = this.store.select(selectAllApplications);

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.store.dispatch(AppActions.loadApps({ userId }));
    }
  }

  updateStatus(app: Application, newStatus: any) {
    this.store.dispatch(AppActions.updateApp({ 
      app: { ...app, status: newStatus } 
    }));

    const toast = Swal.mixin({
      toast: true, position: 'top-end', showConfirmButton: false, timer: 2000,
      background: '#1b1e23', color: '#fff'
    });
    toast.fire({ icon: 'success', title: 'Statut mis à jour' });
  }

  deleteApp(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: '#1b1e23',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(AppActions.deleteApp({ id }));
        Swal.fire({
          title: 'Supprimé!',
          text: 'La candidature a été retirée.',
          icon: 'success',
          background: '#1b1e23',
          color: '#fff',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}