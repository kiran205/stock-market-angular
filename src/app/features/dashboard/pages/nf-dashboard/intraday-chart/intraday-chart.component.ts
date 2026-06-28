import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ECharts, init } from 'echarts';
import {
  createIntradayChartOption,
  createIntradayChartUpdateOption
} from './intraday-chart.config';
import { IntradayPoint } from './intraday-chart.types';

@Component({
  selector: 'app-intraday-chart',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './intraday-chart.component.html',
  styleUrl: './intraday-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntradayChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chartContainer') private readonly chartContainer?: ElementRef<HTMLElement>;

  readonly points = input.required<readonly IntradayPoint[]>();
  readonly expiry = input('JUN');
  readonly loading = input(false);
  readonly error = input<string | null>(null);

  private chart?: ECharts;
  private initialized = false;
  private readonly resizeObserver = new ResizeObserver(() => this.chart?.resize());

  constructor() {
    effect(() => {
      this.render(this.points(), this.expiry());
    });
  }

  ngAfterViewInit(): void {
    if (!this.chartContainer) {
      return;
    }

    this.chart = init(this.chartContainer.nativeElement, undefined, { renderer: 'canvas' });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
    this.render(this.points(), this.expiry());
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.chart?.dispose();
  }

  exportPng(): void {
    if (!this.chart) {
      return;
    }

    const link = document.createElement('a');

    link.href = this.chart.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#1f2937'
    });
    link.download = `intraday-trend-${this.expiry().toLowerCase()}.png`;
    link.click();
  }

  private render(points: readonly IntradayPoint[], expiry: string): void {
    if (!this.chart || points.length === 0) {
      return;
    }

    if (!this.initialized) {
      this.chart.setOption(createIntradayChartOption(points, expiry), true, true);
      this.initialized = true;
      return;
    }

    this.chart.setOption(createIntradayChartUpdateOption(points, expiry), false, true);
  }
}
