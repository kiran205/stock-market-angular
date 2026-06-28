import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  STOCK_WEIGHTS,
  SupportResistanceDays,
  SupportResistanceLevel,
  SupportResistanceStock
} from '../../models/dashboard.models';
import { DashboardStore } from '../../store';

@Component({
  selector: 'app-support-resistance-page',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    EmptyStateComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './support-resistance.page.html',
  styleUrl: './support-resistance.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupportResistancePageComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly store = inject(DashboardStore);

  readonly daysOptions: readonly SupportResistanceDays[] = [15, 30, 45, 60, 90, 120, 150];
  readonly stockOptions = Object.entries(STOCK_WEIGHTS)
    .map(([symbol, weight]) => ({ symbol, weight }))
    .sort((left, right) => right.weight - left.weight);
  readonly defaultSymbols = this.stockOptions.slice(0, 3).map((option) => option.symbol);

  readonly form = this.formBuilder.nonNullable.group({
    symbols: [this.defaultSymbols, Validators.required],
    days: [this.daysOptions[0], Validators.required]
  });

  analyze(): void {
    this.form.markAllAsTouched();

    const symbols = this.form.controls.symbols.value;

    if (this.form.invalid || symbols.length === 0) {
      this.store.setSupportResistanceError('Select at least one symbol before running the analysis.');
      return;
    }

    this.store.analyzeSupportResistance({
      days: this.form.controls.days.value,
      symbols
    });
  }

  isMutedStock(stock: SupportResistanceStock): boolean {
    return stock.current_price === 0 && stock.support.length === 0 && stock.resistance.length === 0;
  }

  scorePercent(value: number): number {
    const normalized = value <= 1 ? value * 100 : value;

    return Math.max(0, Math.min(100, normalized));
  }

  scoreLabel(value: number): string {
    return `${this.scorePercent(value).toFixed(0)}%`;
  }

  chartLevels(stock: SupportResistanceStock): readonly SupportResistanceLevel[] {
    return [...stock.support, ...stock.resistance];
  }

  chartMin(stock: SupportResistanceStock): number {
    const prices = [stock.current_price, ...this.chartLevels(stock).map((level) => level.price)].filter((price) => price > 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = Math.max((max - min) * 0.16, stock.current_price * 0.006, 1);

    return min - padding;
  }

  chartMax(stock: SupportResistanceStock): number {
    const prices = [stock.current_price, ...this.chartLevels(stock).map((level) => level.price)].filter((price) => price > 0);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = Math.max((max - min) * 0.16, stock.current_price * 0.006, 1);

    return max + padding;
  }

  priceY(stock: SupportResistanceStock, price: number): number {
    const min = this.chartMin(stock);
    const max = this.chartMax(stock);
    const range = max - min || 1;

    return 92 - ((price - min) / range) * 74;
  }

  priceActionPath(stock: SupportResistanceStock): string {
    const levels = this.chartLevels(stock).map((level) => level.price);
    const anchorPrices = levels.length
      ? [
          Math.min(...levels),
          stock.current_price * 0.992,
          stock.current_price * 1.006,
          stock.current_price * 0.998,
          stock.current_price * 1.012,
          stock.current_price
        ]
      : [
          stock.current_price * 0.985,
          stock.current_price * 0.996,
          stock.current_price * 1.004,
          stock.current_price
        ];

    return anchorPrices
      .map((price, index) => `${index === 0 ? 'M' : 'L'} ${8 + index * (84 / Math.max(anchorPrices.length - 1, 1))} ${this.priceY(stock, price)}`)
      .join(' ');
  }

  strongestSupport(stock: SupportResistanceStock): SupportResistanceLevel | null {
    return [...stock.support].sort((left, right) => right.strength - left.strength)[0] ?? null;
  }

  nearestResistance(stock: SupportResistanceStock): SupportResistanceLevel | null {
    return [...stock.resistance].sort((left, right) => Math.abs(left.price - stock.current_price) - Math.abs(right.price - stock.current_price))[0] ?? null;
  }

  trackLevel(index: number, level: SupportResistanceLevel): string {
    return `${level.price}-${level.strength}-${index}`;
  }
}
