import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, RouterLink],
  template: `
    <button mat-button type="button" [matMenuTriggerFor]="profile" class="profile-trigger">
      <span class="avatar">RA</span>
      <span class="identity">
        <strong>Raja</strong>
        <small>Principal Trader</small>
      </span>
      <mat-icon>expand_more</mat-icon>
    </button>

    <mat-menu #profile="matMenu" xPosition="before">
      <a mat-menu-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>My Profile</span>
      </a>
      <a mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </a>
      <button mat-menu-item type="button" (click)="logout()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .profile-trigger {
      height: 48px;
      border: 1px solid var(--app-border);
      border-radius: 999px;
      padding: 0 10px 0 6px;
    }

    .avatar {
      display: grid;
      width: 36px;
      height: 36px;
      place-items: center;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--app-primary), var(--app-success));
      color: #04111f;
      font-size: 12px;
      font-weight: 800;
    }

    .identity {
      display: grid;
      margin: 0 8px;
      line-height: 1.1;
      text-align: left;
    }

    small {
      color: var(--app-muted);
      font-size: 11px;
    }

    @media (max-width: 960px) {
      .identity {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileMenuComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
