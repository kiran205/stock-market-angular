import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs';
import { AppHeaderComponent } from '../app-header/app-header.component';
import { MobileNavigationComponent } from '../mobile-navigation/mobile-navigation.component';
import { SidebarNavigationComponent } from '../sidebar-navigation/sidebar-navigation.component';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    AppHeaderComponent,
    MatButtonModule,
    MatIconModule,
    MobileNavigationComponent,
    RouterLink,
    RouterOutlet,
    SidebarNavigationComponent
  ],
  template: `
    <div class="shell">
      <app-header (sidebarToggle)="toggleSidebar()" />

      <div class="workspace">
        @if (!isMobile()) {
          <app-sidebar-navigation [collapsed]="sidebarCollapsed()" />
        }

        <main class="content">
          <router-outlet />
        </main>
      </div>

      @if (isMobile()) {
        <app-mobile-navigation (more)="mobileDrawerOpen.set(true)" />
      }

      @if (mobileDrawerOpen()) {
        <button class="drawer-backdrop" type="button" aria-label="Close menu" (click)="mobileDrawerOpen.set(false)"></button>
        <aside class="mobile-drawer app-card fade-in">
          <div class="drawer-header">
            <span class="avatar">RA</span>
            <div>
              <strong>Raja</strong>
              <small>Principal </small>
            </div>
          </div>

          <a routerLink="/profile" (click)="mobileDrawerOpen.set(false)">
            <mat-icon>person</mat-icon>
            Profile
          </a>
          <a routerLink="/admin/users" (click)="mobileDrawerOpen.set(false)">
            <mat-icon>admin_panel_settings</mat-icon>
            Administration
          </a>
          <a routerLink="/settings" (click)="mobileDrawerOpen.set(false)">
            <mat-icon>settings</mat-icon>
            Settings
          </a>
          <button mat-flat-button type="button" (click)="logout()">
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </aside>
      }
    </div>
  `,
  styles: [`
    .shell {
      display: grid;
      grid-template-rows: var(--app-header-height) 1fr;
      min-height: 100vh;
    }

    .workspace {
      display: flex;
      min-width: 0;
      min-height: 0;
    }

    .content {
      flex: 1;
      min-width: 0;
      padding: clamp(18px, 2vw, 34px);
      overflow: auto;
    }

    .drawer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 35;
      border: 0;
      background: rgba(2, 6, 23, 0.6);
    }

    .mobile-drawer {
      position: fixed;
      right: 14px;
      bottom: calc(var(--app-bottom-nav-height) + 14px);
      left: 14px;
      z-index: 40;
      display: grid;
      gap: 10px;
      padding: 18px;
    }

    .drawer-header,
    .mobile-drawer a {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .drawer-header {
      padding-bottom: 12px;
      border-bottom: 1px solid var(--app-border);
    }

    .avatar {
      display: grid;
      width: 44px;
      height: 44px;
      place-items: center;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--app-primary), var(--app-success));
      color: #04111f;
      font-weight: 900;
    }

    small {
      display: block;
      color: var(--app-muted);
    }

    .mobile-drawer a {
      min-height: 46px;
      padding: 0 6px;
      color: var(--app-text);
      font-weight: 700;
    }

    @media (max-width: 767px) {
      .shell {
        grid-template-rows: 64px 1fr;
      }

      .content {
        padding: 16px 14px calc(var(--app-bottom-nav-height) + 24px);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  readonly sidebarCollapsed = signal(false);
  readonly mobileDrawerOpen = signal(false);
  readonly handset = toSignal(
    this.breakpointObserver.observe('(max-width: 767px)').pipe(map((state) => state.matches)),
    { initialValue: false }
  );
  readonly isMobile = computed(() => this.handset());

  toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
