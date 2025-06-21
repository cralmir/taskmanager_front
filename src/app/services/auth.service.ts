import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base_url =
    'https://us-central1-taskmanager-1d0a1.cloudfunctions.net/api';

  private tokenKey = 'auth_token';

  login(email: string) {
    return this.http
      .post<{ token: string }>(`${this.base_url}/login`, { email })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  register(email: string) {
    return this.http
      .post<{ token: string }>(`${this.base_url}/register`, {
        email,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
