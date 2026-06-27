import { Injectable, computed, signal } from '@angular/core';

const AUTH_STORAGE_KEY = 'stock-analytics-pro.authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal(localStorage.getItem(AUTH_STORAGE_KEY) === 'true');

  readonly isAuthenticated = computed(() => this.authenticated());

  login(): void {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
    this.authenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.authenticated.set(false);
  }
}
