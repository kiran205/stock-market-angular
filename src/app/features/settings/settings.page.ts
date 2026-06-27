import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { SettingsStore } from './stores/settings.store';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsPageComponent {
  readonly store = inject(SettingsStore);

  constructor() {
    this.store.load();
  }
}
