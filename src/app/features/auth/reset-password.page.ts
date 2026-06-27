import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterLink],
  template: `
    <main class="auth-simple">
      <mat-card class="app-card">
        <mat-icon>lock_reset</mat-icon>
        <h1>Reset password</h1>
        <p>Create a strong password for your Stock Analytics Pro account.</p>
        <mat-form-field>
          <mat-label>New password</mat-label>
          <input matInput [type]="showPassword() ? 'text' : 'password'" autocomplete="new-password">
          <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()">
            <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Confirm password</mat-label>
          <input matInput type="password" autocomplete="new-password">
        </mat-form-field>
        <button mat-flat-button color="primary" type="button">Update password</button>
        <a routerLink="/auth/login">Back to login</a>
      </mat-card>
    </main>
  `,
  styles: [`
    .auth-simple {
      display: grid;
      min-height: 100vh;
      place-items: center;
      padding: 20px;
    }

    mat-card {
      display: grid;
      gap: 16px;
      width: min(100%, 440px);
      padding: 34px;
    }

    mat-icon:first-child {
      justify-self: center;
      width: 58px;
      height: 58px;
      color: var(--app-primary);
      font-size: 58px;
    }

    h1,
    p {
      margin: 0;
      text-align: center;
    }

    p,
    a {
      color: var(--app-muted);
      text-align: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordPageComponent {
  readonly showPassword = signal(false);

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
