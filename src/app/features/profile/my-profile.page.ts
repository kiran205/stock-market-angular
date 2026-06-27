import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-my-profile-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    PageHeaderComponent
  ],
  template: `
    <app-page-header
      title="My Profile"
      description="Manage your account identity, workspace preferences, password, and active sessions."
      icon="person"
      eyebrow="Account"
    />

    <section class="profile-grid fade-in">
      <mat-card class="app-card personal">
        <div class="profile-hero">
          <span class="avatar">RA</span>
          <div>
            <h2>Raj </h2>
            <p>Principal Trader</p>
          </div>
        </div>

        <div class="field-grid">
          <mat-form-field>
            <mat-label>Name</mat-label>
            <input matInput value="Raja">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Email</mat-label>
            <input matInput value="demo@stockanalytics.pro">
          </mat-form-field>
          <mat-form-field>
            <mat-label>Role</mat-label>
            <input matInput value="Administrator">
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card class="app-card">
        <h3>Preferences</h3>
        <div class="stack">
          <mat-slide-toggle [checked]="themeService.isDark()" (change)="themeService.toggleTheme()">
            Dark theme
          </mat-slide-toggle>
          <mat-form-field>
            <mat-label>Language</mat-label>
            <mat-select value="en">
              <mat-option value="en">English</mat-option>
              <mat-option value="hi">Hindi</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-card>

      <mat-card class="app-card">
        <h3>Security</h3>
        <p>Rotate your password regularly and enforce strong authentication for privileged accounts.</p>
        <button mat-flat-button color="primary" type="button">
          <mat-icon>lock_reset</mat-icon>
          Change Password
        </button>
      </mat-card>

      <mat-card class="app-card sessions">
        <h3>Sessions</h3>
        <div class="session">
          <mat-icon>desktop_windows</mat-icon>
          <div>
            <strong>Windows Desktop</strong>
            <span>Current session - Mumbai, India</span>
          </div>
        </div>
        <div class="session">
          <mat-icon>smartphone</mat-icon>
          <div>
            <strong>Mobile Browser</strong>
            <span>Last active 2 hours ago</span>
          </div>
        </div>
      </mat-card>
    </section>
  `,
  styles: [`
    .profile-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
      gap: 20px;
    }

    mat-card {
      display: grid;
      gap: 18px;
      padding: 24px;
    }

    .personal,
    .sessions {
      grid-column: span 1;
    }

    .profile-hero,
    .session {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .avatar {
      display: grid;
      width: 74px;
      height: 74px;
      place-items: center;
      border-radius: 24px;
      background: linear-gradient(135deg, var(--app-primary), var(--app-success));
      color: #04111f;
      font-size: 22px;
      font-weight: 900;
    }

    h2,
    h3,
    p {
      margin: 0;
    }

    p,
    .session span {
      color: var(--app-muted);
    }

    .field-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
    }

    .stack {
      display: grid;
      gap: 18px;
    }

    .session {
      padding: 14px;
      border: 1px solid var(--app-border);
      border-radius: 18px;
      background: var(--app-card-soft);
    }

    .session mat-icon {
      color: var(--app-primary);
    }

    @media (max-width: 980px) {
      .profile-grid,
      .field-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyProfilePageComponent {
  readonly themeService = inject(ThemeService);
}
