import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NotificationMenuComponent } from '@shared/components/notification-menu/notification-menu.component';
import { ProfileMenuComponent } from '@shared/components/profile-menu/profile-menu.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { WebSocketService } from '@core/services/web-socket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    NotificationMenuComponent,
    ProfileMenuComponent,
    ThemeToggleComponent
  ],
  template: `
    <header class="header">
      <div class="brand">
        <button class="menu-button" mat-icon-button type="button" aria-label="Toggle sidebar" (click)="sidebarToggle.emit()">
          <mat-icon>menu</mat-icon>
        </button>
        <div class="logo">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="brand-copy">
          <strong>StockAnalytics</strong>
          <span>Market Intelligence Platform</span>
        </div>
      </div>

      <div class="exchange">
        <button type="button">
          NSE
          <mat-icon>expand_more</mat-icon>
        </button>
        <span>Live</span>
      </div>

      <div class="search">
        <mat-icon>search</mat-icon>
        <input placeholder="Search stocks, indices, sectors..." aria-label="Global search">
        <button type="button">Ctrl + K</button>
      </div>

      <div class="actions">
        <span class="market-status">
          <strong>NSE</strong>
          <small>09:45:12 AM</small>
          <b>Open</b>
        </span>
        <span class="socket" [class.connected]="webSocket.state() === 'connected'">
          <i></i>
          <span>
            <strong>WebSocket</strong>
            <small>{{ webSocket.label() }}</small>
          </span>
        </span>
        <app-notification-menu />
        <app-theme-toggle />
        <app-profile-menu />
      </div>
    </header>
  `,
  styles: [`
    .header {
      display: grid;
      grid-template-columns: minmax(210px, 300px) auto minmax(260px, 560px) auto;
      gap: 14px;
      align-items: center;
      height: var(--app-header-height);
      padding: 0 14px;
      border-bottom: 1px solid var(--app-border);
      background: color-mix(in srgb, var(--app-bg) 92%, var(--app-sidebar));
      backdrop-filter: blur(18px);
      box-shadow: 0 1px 0 color-mix(in srgb, var(--app-primary) 8%, transparent);
    }

    .brand,
    .actions,
    .exchange,
    .market-status,
    .socket,
    .search {
      display: flex;
      align-items: center;
    }

    .brand {
      gap: 10px;
      min-width: 0;
    }

    .menu-button {
      color: var(--app-muted);
    }

    .logo {
      display: flex;
      gap: 3px;
      align-items: end;
      justify-content: center;
      min-width: 34px;
      height: 34px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--app-primary) 14%, transparent);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--app-primary) 26%, transparent);
    }

    .logo span {
      width: 4px;
      border-radius: 999px;
      background: linear-gradient(var(--app-primary), #2563eb);
    }

    .logo span:nth-child(1) {
      height: 12px;
    }

    .logo span:nth-child(2) {
      height: 20px;
    }

    .logo span:nth-child(3) {
      height: 27px;
    }

    .brand-copy {
      display: grid;
      line-height: 1.1;
    }

    .brand-copy strong {
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.03em;
    }

    .brand-copy span {
      color: var(--app-muted);
      font-size: 10px;
    }

    .exchange {
      gap: 8px;
      justify-self: start;
    }

    .exchange button {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      border: 1px solid var(--app-border);
      border-radius: 8px;
      background: var(--app-card);
      color: var(--app-text);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.04em;
    }

    .exchange mat-icon {
      width: 16px;
      height: 16px;
      font-size: 16px;
    }

    .exchange span {
      height: 28px;
      padding: 0 10px;
      border: 1px solid color-mix(in srgb, var(--app-success) 35%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--app-success) 10%, transparent);
      color: var(--app-success);
      font-size: 10px;
      font-weight: 900;
      line-height: 28px;
      text-transform: uppercase;
    }

    .search {
      height: 36px;
      padding: 0 10px;
      border: 1px solid var(--app-border);
      border-radius: 9px;
      background: color-mix(in srgb, var(--app-card) 86%, transparent);
      box-shadow: inset 0 1px 0 color-mix(in srgb, #ffffff 5%, transparent);
    }

    .search mat-icon {
      width: 18px;
      height: 18px;
      margin-right: 8px;
      color: var(--app-muted);
      font-size: 18px;
    }

    .search input {
      width: 100%;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--app-text);
      font: inherit;
      font-size: 12px;
    }

    .search button {
      min-width: 54px;
      height: 22px;
      border: 1px solid var(--app-border);
      border-radius: 6px;
      background: var(--app-card-soft);
      color: var(--app-muted);
      font-size: 10px;
    }

    .actions {
      justify-content: end;
      gap: 8px;
    }

    .market-status,
    .socket {
      gap: 8px;
      min-height: 38px;
      color: var(--app-text);
      font-size: 11px;
      white-space: nowrap;
    }

    .market-status {
      display: grid;
      grid-template-columns: auto auto;
      column-gap: 10px;
      min-width: 96px;
      line-height: 1.1;
    }

    .market-status strong {
      font-size: 11px;
    }

    .market-status small {
      grid-column: 1;
      color: var(--app-muted);
      font-size: 10px;
    }

    .market-status b {
      grid-row: 1 / span 2;
      grid-column: 2;
      align-self: center;
      color: var(--app-success);
      font-size: 10px;
      text-transform: uppercase;
    }

    .socket strong,
    .socket small {
      display: block;
      line-height: 1.1;
    }

    .socket small {
      color: var(--app-success);
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
    }

    i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--app-warning);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--app-warning) 18%, transparent);
    }

    .market-status i,
    .socket.connected i {
      background: var(--app-success);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--app-success) 18%, transparent);
    }

    @media (max-width: 1180px) {
      .header {
        grid-template-columns: 1fr minmax(220px, 420px) auto;
      }

      .exchange,
      .market-status {
        display: none;
      }
    }

    @media (max-width: 720px) {
      .header {
        height: 64px;
        padding: 0 12px;
      }

      .brand-copy,
      .search,
      .socket {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHeaderComponent {
  readonly sidebarToggle = output<void>();
  readonly webSocket = inject(WebSocketService);
}
