import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { Nifty50Store } from '../stores/nifty50.store';

@Component({
  selector: 'app-sector-intelligence-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './sector-intelligence.page.html',
  styleUrl: './sector-intelligence.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectorIntelligencePageComponent {
  readonly store = inject(Nifty50Store);

  constructor() {
    this.store.load();
  }
}
