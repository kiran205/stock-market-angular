import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AuthUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  loadCurrentUser(): Observable<AuthUser | null> {
    return of(null);
  }
}
