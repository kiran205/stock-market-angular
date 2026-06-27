import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ComingSoonComponent } from '@shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { OrderBookStore } from '../stores/order-book.store';

@Component({
  selector: 'app-market-structure-page',
  standalone: true,
  imports: [ComingSoonComponent, PageHeaderComponent],
  templateUrl: './market-structure.page.html',
  styleUrl: './market-structure.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketStructurePageComponent {
  readonly store = inject(OrderBookStore);

  constructor() {
    this.store.load();
  }
}
