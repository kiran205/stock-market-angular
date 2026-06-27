import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-navigation',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav" aria-label="Mobile navigation">
      <a routerLink="/dashboard/nf-dashboard" routerLinkActive="active">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>
      <a routerLink="/nifty50/intel-timeline" routerLinkActive="active">
        <mat-icon>stacked_line_chart</mat-icon>
        <span>Nifty50</span>
      </a>
      <a routerLink="/order-book/market-structure" routerLinkActive="active">
        <mat-icon>candlestick_chart</mat-icon>
        <span>Order Book</span>
      </a>
      <a routerLink="/gex/market-regime" routerLinkActive="active">
        <mat-icon>insights</mat-icon>
        <span>GEX</span>
      </a>
      <button type="button" (click)="more.emit()">
        <mat-icon>more_horiz</mat-icon>
        <span>More</span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 30;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      height: var(--app-bottom-nav-height);
      border-top: 1px solid var(--app-border);
      background: color-mix(in srgb, var(--app-sidebar) 94%, transparent);
      backdrop-filter: blur(16px);
    }

    a,
    button {
      display: grid;
      gap: 2px;
      place-items: center;
      border: 0;
      background: transparent;
      color: var(--app-muted);
      font: inherit;
      font-size: 11px;
    }

    a.active,
    button:hover {
      color: var(--app-primary);
    }

    mat-icon {
      font-size: 24px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileNavigationComponent {
  readonly more = output<void>();
}
