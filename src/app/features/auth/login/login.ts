import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  private cdr = inject(ChangeDetectorRef); 

  loginForm: FormGroup;
  isLoading = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        
        this.cdr.detectChanges(); 

        if (user) {
          Swal.fire({
            icon: 'success',
            title: `Bienvenue !`,
            showConfirmButton: false,
            timer: 1500,
            background: '#1b1e23',
            color: '#fff'
          });
          this.router.navigate(['/jobs']);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Email ou mot de passe incorrect.',
            background: '#1b1e23',
            color: '#fff',
            confirmButtonColor: '#ff4757'
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        
        this.cdr.detectChanges(); 

        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur Serveur',
          background: '#1b1e23',
          color: '#fff'
        });
      }
    });
  }
}