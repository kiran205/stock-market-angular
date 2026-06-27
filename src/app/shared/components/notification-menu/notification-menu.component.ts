import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-notification-menu',
  standalone: true,
  imports: [MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <button mat-icon-button type="button" [matMenuTriggerFor]="notifications" aria-label="Open notifications">
      <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
    </button>
    <mat-menu #notifications="matMenu" xPosition="before" class="panel">
      <div class="notification-panel">
        <strong>Notifications</strong>
        <span>Market alerts and system events will appear here.</span>
      </div>
    </mat-menu>
  `,
  styles: [`
    .notification-panel {
      display: grid;
      gap: 8px;
      min-width: 280px;
      padding: 16px;
      color: var(--app-text);
    }

    span {
      color: var(--app-muted);
      font-size: 13px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationMenuComponent {}
