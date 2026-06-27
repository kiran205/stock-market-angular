import { computed } from '@angular/core';
import { withComputed } from '@ngrx/signals';

export function withDashboardComputed() {
  return withComputed((store) => ({
    candleCount: computed(() => store['historicalCandles']().length),
    hasCandles: computed(() => store['historicalCandles']().length > 0),
    isReady: computed(() => !store['loading']() && !store['error']() && store['historicalCandles']().length > 0)
  }));
}
