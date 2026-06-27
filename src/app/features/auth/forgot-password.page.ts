import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, RouterLink],
  template: `
    <main class="auth-simple">
      <mat-card class="app-card">
        <mat-icon>mark_email_unread</mat-icon>
        <h1>Forgot password</h1>
        <p>Enter your registered email and we will send secure reset instructions.</p>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput type="email" autocomplete="email">
        </mat-form-field>
        <button mat-flat-button color="primary" type="button">Send reset link</button>
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
      text-align: center;
    }

    mat-icon {
      justify-self: center;
      width: 58px;
      height: 58px;
      color: var(--app-primary);
      font-size: 58px;
    }

    h1,
    p {
      margin: 0;
    }

    p,
    a {
      color: var(--app-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordPageComponent {}
