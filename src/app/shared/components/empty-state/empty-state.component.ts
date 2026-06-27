import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <section class="state app-card">
      <mat-icon>{{ icon() }}</mat-icon>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
    </section>
  `,
  styles: [`
    .state {
      display: grid;
      place-items: center;
      padding: 36px;
      text-align: center;
    }

    mat-icon {
      color: var(--app-primary);
      font-size: 42px;
      width: 42px;
      height: 42px;
    }

    h3 {
      margin: 14px 0 6px;
    }

    p {
      margin: 0;
      color: var(--app-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  readonly title = input('Nothing here yet');
  readonly message = input('Data will appear once this workflow is connected.');
  readonly icon = input('inbox');
}
