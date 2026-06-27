import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { DashboardStore } from '../../store';

@Component({
  selector: 'app-nf-heatmap-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './nf-heatmap.page.html',
  styleUrl: './nf-heatmap.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NfHeatmapPageComponent {
  readonly store = inject(DashboardStore);

  constructor() {
    this.store.load();
  }
}
