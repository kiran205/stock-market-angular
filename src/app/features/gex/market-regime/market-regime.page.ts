import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GexStore } from '../stores/gex.store';

@Component({
  selector: 'app-market-regime-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './market-regime.page.html',
  styleUrl: './market-regime.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketRegimePageComponent {
  readonly store = inject(GexStore);

  constructor() {
    this.store.load();
  }
}
