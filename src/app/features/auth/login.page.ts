import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    ThemeToggleComponent
  ],
  template: `
    <main class="auth-shell">
      <section class="market-panel">
        <div class="brand">
          <div class="logo">SAP</div>
          <div>
            <strong>Stock Analytics Pro</strong>
            <span>Fintech intelligence workspace</span>
          </div>
        </div>

        <div class="hero">
          <p>Live market operating system</p>
          <h1>Analyze regimes, sectors, flows, and risk from one command center.</h1>
          <div class="chart" aria-hidden="true">
            <i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
        </div>

        <div class="ticker" aria-label="Live market ticker mock">
          <div>
            <span>NIFTY 50 +0.84%</span>
            <span>BANKNIFTY -0.12%</span>
            <span>INDIA VIX +1.42%</span>
            <span>FINNIFTY +0.38%</span>
          </div>
        </div>
      </section>

      <section class="login-panel">
        <div class="theme">
          <app-theme-toggle />
        </div>
        <mat-card class="login-card app-card">
          <mat-card-header>
            <mat-card-title>Welcome back</mat-card-title>
            <mat-card-subtitle>Sign in to continue to your analytics workspace.</mat-card-subtitle>
          </mat-card-header>

          <form [formGroup]="form" (ngSubmit)="login()">
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" autocomplete="email">
              <mat-icon matPrefix>mail</mat-icon>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" autocomplete="current-password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" aria-label="Show password" (click)="togglePasswordVisibility()">
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
            </mat-form-field>

            <div class="form-row">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a routerLink="/auth/forgot-password">Forgot password?</a>
            </div>

            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
              Login
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </form>

          <footer>
            <span>Version 1.0.0</span>
            <span>Environment: Production Shell</span>
          </footer>
        </mat-card>
      </section>
    </main>
  `,
  styles: [`
    .auth-shell {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
      min-height: 100vh;
      background: var(--app-bg);
    }

    .market-panel {
      display: grid;
      grid-template-rows: auto 1fr auto;
      min-height: 100vh;
      padding: clamp(28px, 5vw, 64px);
      overflow: hidden;
      position: relative;
      background:
        radial-gradient(circle at 30% 25%, color-mix(in srgb, var(--app-primary) 30%, transparent), transparent 28rem),
        linear-gradient(135deg, #020617, #0b1220 60%, #111827);
      color: #f8fafc;
    }

    .market-panel::after {
      content: '';
      position: absolute;
      inset: auto -20% -28% 10%;
      height: 380px;
      background: radial-gradient(circle, color-mix(in srgb, var(--app-success) 18%, transparent), transparent 70%);
    }

    .brand,
    .form-row,
    footer {
      display: flex;
      align-items: center;
    }

    .brand {
      gap: 14px;
    }

    .logo {
      display: grid;
      width: 54px;
      height: 54px;
      place-items: center;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--app-primary), var(--app-success));
      color: #04111f;
      font-weight: 900;
      letter-spacing: -0.08em;
    }

    .brand span,
    .hero p,
    footer,
    mat-card-subtitle {
      color: var(--app-muted);
    }

    .hero {
      align-self: center;
      max-width: 760px;
      z-index: 1;
    }

    .hero p {
      margin: 0 0 12px;
      color: var(--app-primary);
      font-weight: 800;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(42px, 7vw, 78px);
      line-height: 0.95;
      letter-spacing: -0.07em;
    }

    .chart {
      display: flex;
      gap: 16px;
      align-items: end;
      height: 180px;
      margin-top: 42px;
    }

    .chart i {
      width: 46px;
      border-radius: 18px 18px 8px 8px;
      background: linear-gradient(var(--app-primary), var(--app-success));
      opacity: 0.9;
      animation: chart-rise 1.8s ease-in-out infinite alternate;
    }

    .chart i:nth-child(1) { height: 64px; }
    .chart i:nth-child(2) { height: 112px; animation-delay: 120ms; }
    .chart i:nth-child(3) { height: 86px; animation-delay: 240ms; }
    .chart i:nth-child(4) { height: 146px; animation-delay: 360ms; }
    .chart i:nth-child(5) { height: 122px; animation-delay: 480ms; }
    .chart i:nth-child(6) { height: 170px; animation-delay: 600ms; }

    .ticker {
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.72);
    }

    .ticker div {
      display: flex;
      gap: 36px;
      width: max-content;
      padding: 12px 22px;
      animation: ticker 16s linear infinite;
    }

    .ticker span {
      color: var(--app-success);
      font-size: 13px;
      font-weight: 800;
      white-space: nowrap;
    }

    .login-panel {
      display: grid;
      place-items: center;
      padding: clamp(22px, 4vw, 58px);
      position: relative;
    }

    .theme {
      position: absolute;
      top: 20px;
      right: 20px;
    }

    .login-card {
      width: min(100%, 480px);
      padding: 28px;
    }

    mat-card-title {
      color: var(--app-text);
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.04em;
    }

    form {
      display: grid;
      gap: 18px;
      margin-top: 28px;
    }

    .form-row {
      justify-content: space-between;
    }

    .form-row a {
      color: var(--app-primary);
      font-weight: 700;
    }

    button[type='submit'] {
      height: 52px;
      border-radius: 16px;
      font-weight: 800;
    }

    footer {
      justify-content: space-between;
      margin-top: 28px;
      font-size: 12px;
    }

    @keyframes ticker {
      to {
        transform: translateX(-50%);
      }
    }

    @keyframes chart-rise {
      to {
        transform: scaleY(0.72);
      }
    }

    @media (max-width: 900px) {
      .auth-shell {
        grid-template-columns: 1fr;
      }

      .market-panel {
        min-height: 44vh;
      }

      .login-panel {
        min-height: 56vh;
      }
    }

    @media (max-width: 520px) {
      .market-panel {
        display: none;
      }

      .login-panel {
        min-height: 100vh;
      }

      .login-card {
        padding: 20px;
      }

      footer {
        display: grid;
        gap: 6px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['demo@stockanalytics.pro', [Validators.required, Validators.email]],
    password: ['Password@123', [Validators.required, Validators.minLength(8)]],
    rememberMe: [true]
  });

  login(): void {
    void this.router.navigate(['/dashboard/nf-dashboard']);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }
}
