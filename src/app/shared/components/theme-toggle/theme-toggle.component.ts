import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <button mat-icon-button type="button" matTooltip="Toggle theme" (click)="themeService.toggleTheme()">
      <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  readonly themeService = inject(ThemeService);
}
