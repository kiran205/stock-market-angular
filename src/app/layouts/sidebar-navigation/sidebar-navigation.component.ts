import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { APP_NAVIGATION } from '@core/navigation/app-navigation';

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed()">
      <nav aria-label="Primary navigation">
        @for (section of navigation; track section.label) {
          <section [class.open]="isOpen(section.label)" [class.single]="section.items.length === 1">
            <button
              class="section-trigger"
              type="button"
              [attr.aria-controls]="sectionId(section.label)"
              [attr.aria-expanded]="isOpen(section.label)"
              (click)="toggleSection(section.label)"
            >
              <span class="icon-box">
                <mat-icon>{{ section.icon }}</mat-icon>
              </span>
              <span class="section-title">{{ section.label }}</span>
              @if (!collapsed()) {
                <mat-icon class="chevron">expand_more</mat-icon>
              }
            </button>

            @if (isOpen(section.label) && !collapsed()) {
              <div class="section-items" [id]="sectionId(section.label)">
                @for (item of section.items; track item.route) {
                  <a [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                    <span class="route-dot"></span>
                    <span>{{ item.label }}</span>
                  </a>
                }
              </div>
            }
          </section>
        }
      </nav>

      @if (!collapsed()) {
        <div class="market-card">
          <div>
            <strong>NIFTY 50</strong>
            <mat-icon>chevron_right</mat-icon>
          </div>
          <h3>22,548.70</h3>
          <p>+124.30 (0.55%)</p>
          <span class="sparkline"></span>
          <button type="button">View Market</button>
        </div>
      }
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100%;
      overflow: hidden auto;
      border-right: 1px solid var(--app-border);
      background:
        linear-gradient(180deg, color-mix(in srgb, var(--app-sidebar) 94%, #020617), var(--app-sidebar)),
        var(--app-sidebar);
      transition: width 220ms ease;
    }

    .sidebar.collapsed {
      width: 80px;
    }

    nav {
      display: grid;
      gap: 8px;
      padding: 12px 10px;
    }

    section {
      display: grid;
      border-radius: 12px;
    }

    .section-trigger {
      display: flex;
      align-items: center;
      width: 100%;
      height: 42px;
      gap: 10px;
      border: 0;
      border-radius: 10px;
      background: transparent;
      color: var(--app-text);
      cursor: pointer;
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      padding: 0 10px;
      text-align: left;
      white-space: nowrap;
      transition: background 180ms ease, color 180ms ease;
    }

    .section-trigger:hover,
    section.open .section-trigger {
      background: color-mix(in srgb, var(--app-primary) 13%, transparent);
      color: var(--app-primary);
    }

    .icon-box {
      display: grid;
      min-width: 28px;
      height: 28px;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--app-primary) 24%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--app-primary) 8%, transparent);
      color: var(--app-primary);
    }

    .icon-box mat-icon {
      width: 17px;
      height: 17px;
      font-size: 17px;
    }

    .section-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chevron {
      width: 18px;
      height: 18px;
      color: var(--app-muted);
      font-size: 18px;
      transition: transform 180ms ease;
    }

    section.open .chevron {
      transform: rotate(180deg);
    }

    .section-items {
      display: grid;
      gap: 2px;
      margin: 4px 0 8px 23px;
      padding-left: 14px;
      position: relative;
    }

    .section-items::before {
      content: '';
      position: absolute;
      top: 6px;
      bottom: 6px;
      left: 0;
      width: 1px;
      background: color-mix(in srgb, var(--app-muted) 24%, transparent);
    }

    a {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 30px;
      border-radius: 8px;
      padding: 0 8px;
      color: color-mix(in srgb, var(--app-text) 84%, transparent);
      font-size: 12px;
      font-weight: 600;
      transition: background 180ms ease, color 180ms ease, transform 180ms ease;
    }

    a:hover,
    a.active {
      background: color-mix(in srgb, var(--app-primary) 10%, transparent);
      color: var(--app-primary);
      transform: translateX(2px);
    }

    .route-dot {
      width: 6px;
      height: 6px;
      border: 1px solid color-mix(in srgb, currentColor 45%, transparent);
      border-radius: 50%;
      background: var(--app-sidebar);
      box-shadow: 0 0 0 3px var(--app-sidebar);
    }

    a.active .route-dot {
      border-color: var(--app-primary);
      background: var(--app-primary);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--app-primary) 16%, transparent);
    }

    .market-card {
      display: grid;
      gap: 8px;
      margin: 20px 10px 14px;
      padding: 14px;
      border: 1px solid var(--app-border);
      border-radius: 12px;
      background:
        radial-gradient(circle at bottom left, color-mix(in srgb, var(--app-success) 14%, transparent), transparent 12rem),
        color-mix(in srgb, var(--app-card) 86%, transparent);
    }

    .market-card div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--app-muted);
      font-size: 11px;
    }

    .market-card h3,
    .market-card p {
      margin: 0;
    }

    .market-card h3 {
      font-size: 18px;
    }

    .market-card p {
      color: var(--app-success);
      font-size: 12px;
      font-weight: 800;
    }

    .sparkline {
      display: block;
      height: 42px;
      border-radius: 8px;
      background:
        linear-gradient(140deg, transparent 8%, color-mix(in srgb, var(--app-success) 32%, transparent) 9%, transparent 10%),
        linear-gradient(20deg, transparent 22%, color-mix(in srgb, var(--app-success) 55%, transparent) 23%, transparent 24%),
        linear-gradient(160deg, transparent 42%, color-mix(in srgb, var(--app-success) 55%, transparent) 43%, transparent 44%),
        linear-gradient(25deg, transparent 62%, color-mix(in srgb, var(--app-success) 48%, transparent) 63%, transparent 64%);
    }

    .market-card button {
      height: 34px;
      border: 1px solid var(--app-border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--app-primary) 9%, transparent);
      color: var(--app-text);
      cursor: pointer;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }

    .collapsed .section-title,
    .collapsed .market-card {
      opacity: 0;
      pointer-events: none;
    }

    .collapsed .section-trigger {
      justify-content: center;
      padding: 0;
    }

    .collapsed .icon-box {
      min-width: 36px;
      height: 36px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarNavigationComponent {
  readonly collapsed = input(false);
  readonly navigation = APP_NAVIGATION;
  readonly openSections = signal(new Set(['Dashboard']));
  readonly openSectionLabels = computed(() => this.openSections());

  isOpen(sectionLabel: string): boolean {
    return this.openSectionLabels().has(sectionLabel);
  }

  sectionId(sectionLabel: string): string {
    return `sidebar-section-${sectionLabel.toLowerCase().replaceAll(' ', '-')}`;
  }

  toggleSection(sectionLabel: string): void {
    if (this.collapsed()) {
      return;
    }

    this.openSections.update((current) => {
      const next = new Set(current);

      if (next.has(sectionLabel)) {
        next.delete(sectionLabel);
      } else {
        next.add(sectionLabel);
      }

      return next;
    });
  }
}
