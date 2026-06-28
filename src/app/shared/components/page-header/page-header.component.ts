import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <header class="page-header">
      <div class="icon-shell">
        <mat-icon>{{ icon() }}</mat-icon>
      </div>
      <div>
        <p>{{ eyebrow() }}</p>
        <h1>{{ title() }}</h1>
        <span>{{ description() }}</span>
      </div>
    </header>
  `,
  styles: [`
    .page-header {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 10px;
    }

    .icon-shell {
      display: grid;
      width: 42px;
      height: 42px;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--app-primary) 35%, transparent);
      border-radius: 12px;
      background: color-mix(in srgb, var(--app-primary) 14%, transparent);
      color: var(--app-primary);
    }

    .icon-shell mat-icon {
      width: 22px;
      height: 22px;
      font-size: 22px;
    }

    p {
      margin: 0 0 2px;
      color: var(--app-primary);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(22px, 2.6vw, 30px);
      line-height: 1;
      letter-spacing: -0.04em;
    }

    span {
      color: var(--app-muted);
      font-size: 12px;
      line-height: 1.25;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly icon = input('insights');
  readonly eyebrow = input('Workspace');
}
