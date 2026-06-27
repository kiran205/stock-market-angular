import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AuthApiService, AuthUser } from '../services/auth-api.service';

interface AuthState {
  readonly initialized: boolean;
  readonly loading: boolean;
  readonly authenticated: boolean;
  readonly user: AuthUser | null;
  readonly permissions: readonly string[];
  readonly preferences: Record<string, unknown>;
  readonly error: string | null;
}

const initialState: AuthState = {
  initialized: false,
  loading: false,
  authenticated: false,
  user: null,
  permissions: [],
  preferences: {},
  error: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('auth'),
  withState<AuthState>(initialState),
  withMethods((store) => {
    const authApiService = inject(AuthApiService);

    return {
      initialize(): void {
        if (store.initialized() || store.loading()) {
          return;
        }

        patchState(store, { loading: true, error: null });
        authApiService.loadCurrentUser().subscribe({
          next: (user) => patchState(store, {
            user,
            authenticated: Boolean(user),
            initialized: true,
            loading: false
          }),
          error: () => patchState(store, {
            initialized: true,
            loading: false,
            error: 'Unable to initialize authentication state.'
          })
        });
      },

      setAuthenticatedUser(user: AuthUser): void {
        patchState(store, {
          user,
          authenticated: true,
          initialized: true,
          error: null
        });
      },

      updatePreferences(preferences: Record<string, unknown>): void {
        patchState(store, { preferences });
      },

      clear(): void {
        patchState(store, initialState);
      }
    };
  })
);
