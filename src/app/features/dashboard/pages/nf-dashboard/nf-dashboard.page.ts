import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  inject
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ECharts, EChartsOption, init } from 'echarts';
import { NiftyFutureCandle } from '../../models/dashboard.models';
import { DashboardDuration, DashboardStore } from '../../store';

@Component({
  selector: 'app-nf-dashboard-page',
  standalone: true,
  imports: [DecimalPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './nf-dashboard.page.html',
  styleUrl: './nf-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NfDashboardPageComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') private readonly chartContainer?: ElementRef<HTMLElement>;

  readonly store = inject(DashboardStore);
  private chart?: ECharts;
  private readonly resizeObserver = new ResizeObserver(() => this.chart?.resize());

  constructor() {
    this.store.loadHistoricalData();
    effect(() => {
      const candles = this.store.historicalCandles();
      this.renderChart(candles);
    });
  }

  ngAfterViewInit(): void {
    if (!this.chartContainer) {
      return;
    }

    this.chart = init(this.chartContainer.nativeElement, 'dark', { renderer: 'canvas' });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
    this.renderChart(this.store.historicalCandles());
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.chart?.dispose();
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

  private renderChart(candles: readonly NiftyFutureCandle[]): void {
    if (!this.chart) {
      return;
    }

    this.chart.setOption(this.createChartOptions(candles), true, true);
  }

  private createChartOptions(candles: readonly NiftyFutureCandle[]): EChartsOption {
    const labels = candles.map((candle) => this.formatTime(candle.timestamp));
    const oiDeltaData = candles.map((candle) => ({
      value: candle.oiDelta,
      itemStyle: { color: candle.oiDelta >= 0 ? '#00E676' : '#FF5252' }
    }));
    const volumeData = candles.map((candle) => ({
      value: candle.volume,
      itemStyle: { color: candle.close >= candle.open ? '#00E676' : '#FF5252' }
    }));

    return {
      backgroundColor: 'transparent',
      animation: false,
      color: ['#00D4FF', '#00E676', '#FF5252', '#FFC107'],
      axisPointer: {
        link: [{ xAxisIndex: 'all' }],
        label: { backgroundColor: '#111827' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        backgroundColor: 'rgba(17, 24, 39, 0.96)',
        borderColor: 'rgba(148, 163, 184, 0.24)',
        textStyle: { color: '#F8FAFC' }
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: [0, 1], start: 55, end: 100 },
        { type: 'slider', xAxisIndex: [0, 1], bottom: 10, height: 22, start: 55, end: 100 }
      ],
      grid: [
        { left: 56, right: 28, top: 36, height: '38%' },
        { left: 56, right: 28, top: '54%', height: '30%' }
      ],
      xAxis: [
        this.createXAxis(labels, false),
        this.createXAxis(labels, true, 1)
      ],
      yAxis: [
        this.createYAxis('OI Delta'),
        this.createYAxis('Volume', 1)
      ],
      series: [
        {
          name: 'OI Delta',
          type: 'bar' as const,
          data: oiDeltaData,
          xAxisIndex: 0,
          yAxisIndex: 0,
          barWidth: '62%',
          markLine: {
            silent: true,
            symbol: 'none',
            lineStyle: { color: 'rgba(255,255,255,0.28)', type: 'dashed' as const },
            data: [{ yAxis: 0 }]
          }
        },
        {
          name: 'Volume',
          type: 'bar' as const,
          data: volumeData,
          xAxisIndex: 1,
          yAxisIndex: 1,
          barWidth: '62%'
        }
      ]
    };
  }

  private createXAxis(labels: readonly string[], showLabel: boolean, gridIndex = 0) {
    return {
      type: 'category' as const,
      data: [...labels],
      gridIndex,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.24)' } },
      axisLabel: { show: showLabel, color: '#94A3B8', fontSize: 10 },
      axisTick: { show: false },
      splitLine: { show: true, lineStyle: { color: 'rgba(148, 163, 184, 0.08)' } }
    };
  }

  private createYAxis(name: string, gridIndex = 0) {
    return {
      type: 'value' as const,
      name,
      gridIndex,
      scale: true,
      nameTextStyle: { color: '#94A3B8', fontSize: 10, align: 'left' as const },
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.1)' } }
    };
  }

  private formatTime(timestamp: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date(timestamp));
  }
}
