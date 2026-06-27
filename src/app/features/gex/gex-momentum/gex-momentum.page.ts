import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { GexStore } from '../stores/gex.store';

@Component({
  selector: 'app-gex-momentum-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './gex-momentum.page.html',
  styleUrl: './gex-momentum.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GexMomentumPageComponent {
  readonly store = inject(GexStore);

  constructor() {
    this.store.load();
  }
}
