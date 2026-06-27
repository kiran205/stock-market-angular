import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { Nifty50Store } from '../stores/nifty50.store';

@Component({
  selector: 'app-intel-timeline-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './intel-timeline.page.html',
  styleUrl: './intel-timeline.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntelTimelinePageComponent {
  readonly store = inject(Nifty50Store);

  constructor() {
    this.store.load();
  }
}
