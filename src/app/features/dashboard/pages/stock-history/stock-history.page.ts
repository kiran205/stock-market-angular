import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  STOCK_WEIGHTS,
  StockHistoryCandle,
  StockHistoryStock,
  SupportResistanceDays
} from '../../models/dashboard.models';
import { DashboardStore } from '../../store';

@Component({
  selector: 'app-stock-history-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './stock-history.page.html',
  styleUrl: './stock-history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockHistoryPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly store = inject(DashboardStore);

  readonly daysOptions: readonly SupportResistanceDays[] = [15, 30, 45, 60, 90, 120, 150];
  readonly stockOptions = Object.entries(STOCK_WEIGHTS)
    .map(([symbol, weight]) => ({ symbol, weight }))
    .sort((left, right) => right.weight - left.weight);
  readonly defaultSymbols = this.stockOptions.slice(0, 3).map((option) => option.symbol);
  readonly pageSize = 10;

  readonly form = this.formBuilder.nonNullable.group({
    symbols: [this.defaultSymbols, Validators.required],
    days: [this.daysOptions[0], Validators.required]
  });

  loadHistory(): void {
    this.form.markAllAsTouched();

    const symbols = this.form.controls.symbols.value;

    if (this.form.invalid || symbols.length === 0) {
      this.store.setStockHistoryError('Select at least one symbol before loading stock history.');
      return;
    }

    this.store.loadStockHistory({
      days: this.form.controls.days.value,
      symbols
    });
  }

  latestClose(stock: StockHistoryStock): number {
    return stock.history[0]?.close ?? 0;
  }

  priceChange(candle: StockHistoryCandle): number {
    return candle.close - candle.open;
  }

  priceChangePercent(candle: StockHistoryCandle): number {
    return candle.open ? (this.priceChange(candle) / candle.open) * 100 : 0;
  }

  pagedHistory(stock: StockHistoryStock): readonly StockHistoryCandle[] {
    const pageIndex = this.store.stockHistoryPageIndexes()[stock.symbol] ?? 0;
    const start = pageIndex * this.pageSize;

    return stock.history.slice(start, start + this.pageSize);
  }

  pageIndex(symbol: string): number {
    return this.store.stockHistoryPageIndexes()[symbol] ?? 0;
  }

  handlePageChange(symbol: string, event: PageEvent): void {
    this.store.setStockHistoryPageIndex(symbol, event.pageIndex);
  }

  trackHistory(index: number, candle: StockHistoryCandle): string {
    return `${candle.date}-${candle.expiry}-${index}`;
  }
}
