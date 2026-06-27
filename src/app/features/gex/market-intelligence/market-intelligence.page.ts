import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GexStore } from '../stores/gex.store';

@Component({
  selector: 'app-gex-market-intelligence-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './market-intelligence.page.html',
  styleUrl: './market-intelligence.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GexMarketIntelligencePageComponent {
  readonly store = inject(GexStore);

  constructor() {
    this.store.load();
  }
}
