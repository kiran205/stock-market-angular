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

  chartCandles(stock: StockHistoryStock): readonly StockHistoryCandle[] {
    return [...stock.history].reverse();
  }

  priceLinePoints(stock: StockHistoryStock): string {
    const candles = this.chartCandles(stock);
    const min = this.priceMin(candles);
    const range = this.priceMax(candles) - min || 1;

    return candles
      .map((candle, index) => {
        const x = candles.length > 1 ? (index / (candles.length - 1)) * 100 : 50;
        const y = 12 + ((this.priceMax(candles) - candle.close) / range) * 62;

        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }

  oiLinePoints(stock: StockHistoryStock): string {
    const candles = this.chartCandles(stock);
    const min = Math.min(...candles.map((candle) => candle.oi));
    const max = Math.max(...candles.map((candle) => candle.oi));
    const range = max - min || 1;

    return candles
      .map((candle, index) => {
        const x = candles.length > 1 ? (index / (candles.length - 1)) * 100 : 50;
        const y = 20 + ((max - candle.oi) / range) * 52;

        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }

  chartPointX(index: number, candles: readonly StockHistoryCandle[]): number {
    return candles.length > 1 ? (index / (candles.length - 1)) * 100 : 50;
  }

  pricePointY(candle: StockHistoryCandle, candles: readonly StockHistoryCandle[]): number {
    const min = this.priceMin(candles);
    const range = this.priceMax(candles) - min || 1;

    return 12 + ((this.priceMax(candles) - candle.close) / range) * 62;
  }

  oiPointY(candle: StockHistoryCandle, candles: readonly StockHistoryCandle[]): number {
    const min = Math.min(...candles.map((item) => item.oi));
    const max = Math.max(...candles.map((item) => item.oi));
    const range = max - min || 1;

    return 20 + ((max - candle.oi) / range) * 52;
  }

  priceMin(candles: readonly StockHistoryCandle[]): number {
    return Math.min(...candles.map((candle) => candle.low));
  }

  priceMax(candles: readonly StockHistoryCandle[]): number {
    return Math.max(...candles.map((candle) => candle.high));
  }

  volumeMax(candles: readonly StockHistoryCandle[]): number {
    return Math.max(...candles.map((candle) => candle.spot_volume + candle.futures_volume)) || 1;
  }

  volumeHeight(candle: StockHistoryCandle, candles: readonly StockHistoryCandle[]): number {
    return Math.max(5, ((candle.spot_volume + candle.futures_volume) / this.volumeMax(candles)) * 22);
  }

  volumeY(candle: StockHistoryCandle, candles: readonly StockHistoryCandle[]): number {
    return 92 - this.volumeHeight(candle, candles);
  }

  chartBarX(index: number, candles: readonly StockHistoryCandle[]): number {
    return candles.length > 1 ? (index / candles.length) * 100 : 46;
  }

  chartBarWidth(candles: readonly StockHistoryCandle[]): number {
    return Math.max(1.8, Math.min(5, 70 / candles.length));
  }

  chartTooltip(candle: StockHistoryCandle): string {
    return [
      this.formatChartDate(candle.date),
      `Open: ${candle.open.toFixed(2)}`,
      `High: ${candle.high.toFixed(2)}`,
      `Low: ${candle.low.toFixed(2)}`,
      `Close: ${candle.close.toFixed(2)}`,
      `Change: ${this.priceChange(candle).toFixed(2)} (${this.priceChangePercent(candle).toFixed(2)}%)`,
      `Spot Vol: ${this.formatCompactNumber(candle.spot_volume)}`,
      `Fut Vol: ${this.formatCompactNumber(candle.futures_volume)}`,
      `OI: ${this.formatCompactNumber(candle.oi)}`,
      `Expiry: ${this.formatChartDate(candle.expiry)}`
    ].join('\n');
  }

  formatCompactNumber(value: number): string {
    const absoluteValue = Math.abs(value);

    if (absoluteValue >= 10000000) {
      return `${(value / 10000000).toFixed(2).replace(/\.?0+$/, '')}cr`;
    }

    if (absoluteValue >= 100000) {
      return `${(value / 100000).toFixed(2).replace(/\.?0+$/, '')}lakh`;
    }

    if (absoluteValue >= 1000) {
      return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }

    return value.toFixed(0);
  }

  private formatChartDate(value: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(value));
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
