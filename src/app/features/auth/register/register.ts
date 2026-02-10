import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;

  constructor() {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    const newUser: User = this.registerForm.value;

    this.authService.register(newUser).subscribe({
      next: () => {
        this.isLoading = false;

        Swal.fire({
          title: 'Succès !',
          text: 'Votre compte a été créé avec succès.',
          icon: 'success',
          confirmButtonText: 'Se connecter',
          confirmButtonColor: '#f09819',
          background: '#1b1e23',
          color: '#ffffff',
          iconColor: '#f09819',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;

        Swal.fire({
          title: 'Erreur',
          text: "Une erreur est survenue lors de l'inscription.",
          icon: 'error',
          confirmButtonColor: '#ff4757',
          background: '#1b1e23',
          color: '#ffffff',
        });
      },
    });
  }
}
