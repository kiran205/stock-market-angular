import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  STOCK_WEIGHTS,
  StockHistoryCandle,
  StockHistoryResponse,
  StockHistoryStock,
  SupportResistanceDays
} from '../../models/dashboard.models';
import { DashboardService } from '../../services/dashboard.service';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dashboardService = inject(DashboardService);

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

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<StockHistoryResponse | null>(null);
  readonly pageIndexes = signal<Record<string, number>>({});

  loadHistory(): void {
    this.form.markAllAsTouched();

    const symbols = this.form.controls.symbols.value;

    if (this.form.invalid || symbols.length === 0) {
      this.error.set('Select at least one symbol before loading stock history.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);
    this.pageIndexes.set({});

    this.dashboardService.getStockHistory({
      days: this.form.controls.days.value,
      symbols
    }).pipe(
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => {
        this.pageIndexes.set(Object.fromEntries(response.stocks.map((stock) => [stock.symbol, 0])));
        this.result.set(response);
      },
      error: () => this.error.set('Unable to load stock history. Please try again.')
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
    const pageIndex = this.pageIndexes()[stock.symbol] ?? 0;
    const start = pageIndex * this.pageSize;

    return stock.history.slice(start, start + this.pageSize);
  }

  pageIndex(symbol: string): number {
    return this.pageIndexes()[symbol] ?? 0;
  }

  handlePageChange(symbol: string, event: PageEvent): void {
    this.pageIndexes.update((current) => ({
      ...current,
      [symbol]: event.pageIndex
    }));
  }

  trackHistory(index: number, candle: StockHistoryCandle): string {
    return `${candle.date}-${candle.expiry}-${index}`;
  }
}
