import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length > 0) {
          const user = users[0];
          this.setSession(user);
          return user;
        }
        return null;
      }),
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  getUser(): User | null {
    const session = localStorage.getItem('user_session');
    if (session) {
      return JSON.parse(session) as User;
    }
    return null;
  }

  getCurrentUserId(): number | null {
    const user = this.getUser(); 
    return user ? user.id : null;
  }

  private setSession(user: User): void {
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('user_session', JSON.stringify(userWithoutPassword));
  }

  logout(): void {
    localStorage.removeItem('user_session');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user_session');
  }
}
