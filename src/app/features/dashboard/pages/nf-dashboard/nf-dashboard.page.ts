import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  inject
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DashboardDuration, DashboardStore } from '../../store';
import { IntradayChartComponent } from './intraday-chart/intraday-chart.component';

@Component({
  selector: 'app-nf-dashboard-page',
  standalone: true,
  imports: [DecimalPipe, IntradayChartComponent, MatButtonModule, MatIconModule],
  templateUrl: './nf-dashboard.page.html',
  styleUrl: './nf-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NfDashboardPageComponent implements OnDestroy {
  readonly store = inject(DashboardStore);
  readonly intradayPoints = computed(() => this.store.historicalCandles().map((candle) => ({
    time: this.formatTime(candle.timestamp),
    price: candle.close,
    oiChange: candle.oiDelta,
    volume: candle.volume,
    sentiment: candle.marketStructure ?? 'LONG_UNWINDING'
  })));
  readonly selectedExpiry = computed(() => this.formatExpiry(this.store.selectedDate()));

  constructor() {
    this.store.loadHistoricalData();
  }

  ngOnDestroy(): void {
    this.store.destroy();
  }

  handleDateChange(event: Event): void {
    const selectedDate = (event.target as HTMLInputElement).value;

    if (selectedDate) {
      this.store.loadHistoricalData(selectedDate);
    }
  }

  handleDurationChange(event: Event): void {
    this.store.setSelectedDuration((event.target as HTMLSelectElement).value as DashboardDuration);
  }

  private formatTime(timestamp: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(timestamp));
  }

  private formatExpiry(selectedDate: string): string {
    return new Intl.DateTimeFormat('en-IN', { month: 'short' })
      .format(new Date(selectedDate))
      .toUpperCase();
  }
}
