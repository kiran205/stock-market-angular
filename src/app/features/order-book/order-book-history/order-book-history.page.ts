import { DatePipe, DecimalPipe, PercentPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ProfileMenuComponent } from '@shared/components/profile-menu/profile-menu.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { OrderBookHistoryRecord } from '../services/order-book.service';
import { OrderBookStore } from '../stores/order-book.store';

@Component({
  selector: 'app-order-book-history-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    PercentPipe,
    ProfileMenuComponent,
    ReactiveFormsModule,
    ThemeToggleComponent
  ],
  templateUrl: './order-book-history.page.html',
  styleUrl: './order-book-history.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBookHistoryPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly store = inject(OrderBookStore);

  readonly today = new Date();
  readonly pageSize = 10;
  readonly timeRanges = ['30 mins', '1 Hr', '2 Hr', 'Full Day'] as const;
  readonly form = this.formBuilder.nonNullable.group({
    date: [this.today, Validators.required],
    atm: ['ALL'],
    timeRange: ['Full Day'],
    time: ['15:30'],
    search: ['']
  });

  constructor() {
    this.store.loadHistory({ date: this.toApiDate(this.today) });
  }

  loadHistory(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.store.setHistoryError('Select a date before loading order book history.');
      return;
    }

    this.store.loadHistory({ date: this.toApiDate(this.form.controls.date.value) });
  }

  refresh(): void {
    this.loadHistory();
  }

  latestRecord(records: readonly OrderBookHistoryRecord[]): OrderBookHistoryRecord | null {
    return records.at(-1) ?? null;
  }

  atmOptions(records: readonly OrderBookHistoryRecord[]): readonly number[] {
    return [...new Set(records.map((record) => record.atm))].sort((left, right) => left - right);
  }

  filteredRecords(records: readonly OrderBookHistoryRecord[]): readonly OrderBookHistoryRecord[] {
    const selectedAtm = this.form.controls.atm.value;
    const search = this.form.controls.search.value.trim().toLowerCase();

    return records.filter((record) => {
      const matchesAtm = selectedAtm === 'ALL' || String(record.atm) === selectedAtm;
      const matchesSearch = !search || [
        record.regime,
        record.timestamp,
        record.created_at,
        String(record.atm),
        String(record.score)
      ].some((value) => value.toLowerCase().includes(search));

      return matchesAtm && matchesSearch;
    });
  }

  totalExecDelta(records: readonly OrderBookHistoryRecord[]): number {
    return records.reduce((total, record) => total + record.exec_delta, 0);
  }

  totalBookDelta(records: readonly OrderBookHistoryRecord[]): number {
    return records.reduce((total, record) => total + record.book_delta, 0);
  }

  averageScore(records: readonly OrderBookHistoryRecord[]): number {
    return records.length
      ? records.reduce((total, record) => total + record.score, 0) / records.length
      : 0;
  }

  averageImbalance(records: readonly OrderBookHistoryRecord[]): number {
    return records.length
      ? records.reduce((total, record) => total + record.imbalance, 0) / records.length
      : 0;
  }

  totalAskRemoved(records: readonly OrderBookHistoryRecord[]): number {
    return records.reduce((total, record) => total + record.ask_removed, 0);
  }

  totalBidRemoved(records: readonly OrderBookHistoryRecord[]): number {
    return records.reduce((total, record) => total + record.bid_removed, 0);
  }

  liquidityRemoved(record: OrderBookHistoryRecord): number {
    return record.ask_removed + record.bid_removed;
  }

  formatReadableNumber(value: number): string {
    const sign = value < 0 ? '-' : '';
    const absoluteValue = Math.abs(value);

    if (absoluteValue >= 10000000) {
      return `${sign}${this.trimNumber(absoluteValue / 10000000)}cr`;
    }

    if (absoluteValue >= 100000) {
      return `${sign}${this.trimNumber(absoluteValue / 100000)}lakh`;
    }

    if (absoluteValue >= 1000) {
      return `${sign}${this.trimNumber(absoluteValue / 1000)}k`;
    }

    return `${sign}${this.trimNumber(absoluteValue)}`;
  }

  scorePercent(score: number): number {
    return Math.max(0, Math.min(100, score));
  }

  scoreZone(score: number): string {
    return score >= 70 ? 'score-bullish' : score >= 40 ? 'score-neutral' : 'score-bearish';
  }

  maxAbs(records: readonly OrderBookHistoryRecord[], key: keyof OrderBookHistoryRecord): number {
    const maxValue = Math.max(...records.map((record) => Math.abs(Number(record[key])) || 0));

    return maxValue || 1;
  }

  barWidth(value: number, maxValue: number): number {
    return Math.max(4, Math.min(100, (Math.abs(value) / maxValue) * 100));
  }

  scorePointTop(score: number): number {
    return 100 - this.scorePercent(score);
  }

  pagedRecords(records: readonly OrderBookHistoryRecord[]): readonly OrderBookHistoryRecord[] {
    const start = this.store.historyPageIndex() * this.pageSize;

    return this.filteredRecords(records).slice(start, start + this.pageSize);
  }

  handlePageChange(event: PageEvent): void {
    this.store.setHistoryPageIndex(event.pageIndex);
  }

  regimeClass(regime: string): string {
    return `regime-${regime.toLowerCase().replaceAll('_', '-')}`;
  }

  exportCsv(): void {
    const records = this.store.historyResult()?.data ?? [];
    const rows = this.filteredRecords(records);
    const headers = ['Time', 'ATM', 'Score', 'Execution Delta', 'Book Delta', 'Ask Removed', 'Bid Removed', 'Imbalance', 'Regime', 'Strike Shift', 'Created Time'];
    const csv = [
      headers.join(','),
      ...rows.map((record) => [
        record.timestamp,
        record.atm,
        record.score,
        record.exec_delta,
        record.book_delta,
        record.ask_removed,
        record.bid_removed,
        record.imbalance,
        record.regime,
        record.strike_shift,
        record.created_at
      ].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `order-book-history-${this.toApiDate(this.form.controls.date.value)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  aiInsight(records: readonly OrderBookHistoryRecord[]): string {
    const latest = this.latestRecord(records);

    if (!latest) {
      return 'Load order book history to generate liquidity and pressure commentary.';
    }

    if (latest.exec_delta >= 0 && latest.book_delta >= 0) {
      return 'Execution Delta increasing while Book Delta remains positive. Buyers currently dominate.';
    }

    if (latest.exec_delta < 0 && latest.book_delta < 0) {
      return 'Execution and Book Delta are both negative. Sellers are controlling near-term order flow.';
    }

    return 'Execution pressure and passive book pressure are diverging. Watch for a regime transition.';
  }

  trackRecord(index: number, record: OrderBookHistoryRecord): string {
    return `${record.id}-${record.timestamp}-${index}`;
  }

  private toApiDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private trimNumber(value: number): string {
    return value >= 100
      ? value.toFixed(0)
      : value >= 10
        ? value.toFixed(1).replace(/\.0$/, '')
        : value.toFixed(2).replace(/\.?0+$/, '');
  }
}
