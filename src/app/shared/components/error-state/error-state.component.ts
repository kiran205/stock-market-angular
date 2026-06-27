import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <section class="state app-card">
      <mat-icon>error</mat-icon>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      <button mat-flat-button type="button">Retry</button>
    </section>
  `,
  styles: [`
    .state {
      display: grid;
      gap: 10px;
      place-items: center;
      padding: 36px;
      text-align: center;
    }

    mat-icon {
      color: var(--app-danger);
      font-size: 42px;
      width: 42px;
      height: 42px;
    }

    h3,
    p {
      margin: 0;
    }

    p {
      color: var(--app-muted);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
  readonly title = input('Unable to load data');
  readonly message = input('Please check your connection and try again.');
}
