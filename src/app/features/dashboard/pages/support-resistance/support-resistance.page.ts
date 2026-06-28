import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import {
  STOCK_WEIGHTS,
  SupportResistanceDays,
  SupportResistanceLevel,
  SupportResistanceResponse,
  SupportResistanceStock
} from '../../models/dashboard.models';
import { DashboardService } from '../../services/dashboard.service';

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
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly dashboardService = inject(DashboardService);

  readonly daysOptions: readonly SupportResistanceDays[] = [15, 30, 45, 60, 90, 120, 150];
  readonly stockOptions = Object.entries(STOCK_WEIGHTS)
    .map(([symbol, weight]) => ({ symbol, weight }))
    .sort((left, right) => right.weight - left.weight);
  readonly defaultSymbols = this.stockOptions.slice(0, 3).map((option) => option.symbol);

  readonly form = this.formBuilder.nonNullable.group({
    symbols: [this.defaultSymbols, Validators.required],
    days: [this.daysOptions[0], Validators.required]
  });

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly result = signal<SupportResistanceResponse | null>(null);

  analyze(): void {
    this.form.markAllAsTouched();

    const symbols = this.form.controls.symbols.value;

    if (this.form.invalid || symbols.length === 0) {
      this.error.set('Select at least one symbol before running the analysis.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.dashboardService.analyzeSupportResistance({
      days: this.form.controls.days.value,
      symbols
    }).pipe(
      finalize(() => this.loading.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response) => this.result.set(response),
      error: () => this.error.set('Unable to analyze support and resistance levels. Please try again.')
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

  trackLevel(index: number, level: SupportResistanceLevel): string {
    return `${level.price}-${level.strength}-${index}`;
  }
}
