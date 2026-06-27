import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { Nifty50Store } from '../stores/nifty50.store';

@Component({
  selector: 'app-weightage-matrix-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './weightage-matrix.page.html',
  styleUrl: './weightage-matrix.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeightageMatrixPageComponent {
  readonly store = inject(Nifty50Store);

  constructor() {
    this.store.load();
  }
}
