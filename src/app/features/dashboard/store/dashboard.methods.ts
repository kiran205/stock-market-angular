import { inject } from '@angular/core';
import { patchState, withMethods } from '@ngrx/signals';
import { Subscription } from 'rxjs';
import { NiftyFuturesApiService } from '@core/services/nifty-futures-api.service';
import { NiftyFuturesRealtimeService } from '@core/services/nifty-futures-realtime.service';
import { DashboardService } from '../services/dashboard.service';
import {
  DashboardMarketSummary,
  MarketStructureEvent,
  NiftyFutureApiCandle,
  NiftyFutureCandle
} from '../models/dashboard.models';
import {
  DashboardDuration,
  MARKET_CLOSE_MINUTES,
  MARKET_OPEN_MINUTES,
  MARKET_TIME_ZONE
} from './dashboard.types';
import { emptyMarketSummary, initialDashboardState } from './dashboard.state';

function toNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function toApiCandle(candle: NiftyFutureCandle): NiftyFutureApiCandle {
  return {
    timestamp: candle.timestamp,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
    oi: candle.oi,
    symbol: 'NIFTY FUT',
    expiry: ''
  };
}

function getMarketMinutes(timestamp: string): number | null {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: MARKET_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value);
  const minute = Number(parts.find((part) => part.type === 'minute')?.value);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  return hour * 60 + minute;
}

function isMarketHoursCandle(candle: NiftyFutureApiCandle | NiftyFutureCandle): boolean {
  const minutes = getMarketMinutes(candle.timestamp);

  return minutes !== null && minutes >= MARKET_OPEN_MINUTES && minutes <= MARKET_CLOSE_MINUTES;
}

export function withDashboardMethods() {
  return withMethods((store) => {
    const dashboardService = inject(DashboardService);
    const apiService = inject(NiftyFuturesApiService);
    const realtimeService = inject(NiftyFuturesRealtimeService);
    let realtimeSubscription: Subscription | null = null;

    const calculateOIDelta = (current: NiftyFutureApiCandle, previous: NiftyFutureApiCandle | null): number => {
      return previous ? toNumber(current.oi) - toNumber(previous.oi) : 0;
    };

    const calculateMarketStructure = (
      current: NiftyFutureApiCandle,
      previous: NiftyFutureApiCandle | null
    ): MarketStructureEvent => {
      const priceDelta = previous ? toNumber(current.close) - toNumber(previous.close) : toNumber(current.close) - toNumber(current.open);
      const oiDelta = calculateOIDelta(current, previous);

      if (priceDelta >= 0 && oiDelta >= 0) {
        return 'LONG_BUILDUP';
      }

      if (priceDelta < 0 && oiDelta >= 0) {
        return 'SHORT_BUILDUP';
      }

      if (priceDelta < 0 && oiDelta < 0) {
        return 'LONG_UNWINDING';
      }

      return 'SHORT_COVERING';
    };

    const enrichCandles = (candles: readonly NiftyFutureApiCandle[]): readonly NiftyFutureCandle[] => {
      const marketHoursCandles = candles.filter(isMarketHoursCandle);

      return marketHoursCandles.map((candle, index) => {
        const previous = index > 0 ? marketHoursCandles[index - 1] : null;

        return {
          timestamp: candle.timestamp,
          open: toNumber(candle.open),
          high: toNumber(candle.high),
          low: toNumber(candle.low),
          close: toNumber(candle.close),
          volume: toNumber(candle.volume),
          oi: toNumber(candle.oi),
          oiDelta: calculateOIDelta(candle, previous),
          marketStructure: calculateMarketStructure(candle, previous)
        };
      });
    };

    const createSummary = (candles: readonly NiftyFutureCandle[]): DashboardMarketSummary => {
      const latest = candles.at(-1);
      const previous = candles.at(-2);

      if (!latest) {
        return emptyMarketSummary();
      }

      const priceChange = previous ? latest.close - previous.close : latest.close - latest.open;
      const previousClose = previous?.close || latest.open || latest.close;
      const priceChangePercent = previousClose ? (priceChange / previousClose) * 100 : 0;
      const currentSentiment = latest.marketStructure === 'LONG_BUILDUP' || latest.marketStructure === 'SHORT_COVERING'
        ? 'Bullish'
        : latest.marketStructure === 'SHORT_BUILDUP' || latest.marketStructure === 'LONG_UNWINDING'
          ? 'Bearish'
          : 'Neutral';

      return {
        latestPrice: latest.close,
        priceChange,
        priceChangePercent,
        oiChange: latest.oiDelta,
        volume: latest.volume,
        currentSentiment,
        marketStructure: latest.marketStructure
      };
    };

    const patchCandles = (candles: readonly NiftyFutureCandle[]): void => {
      const trimmedCandles = candles.slice(-1000);

      patchState(store, {
        historicalCandles: trimmedCandles,
        latestCandle: trimmedCandles.at(-1) ?? null,
        marketSummary: createSummary(trimmedCandles),
        lastUpdated: new Date().toISOString()
      });
    };

    const methods = {
      load(): void {
        if (store['loading']()) {
          return;
        }

        patchState(store, { loading: true, error: null });
        dashboardService.load().subscribe({
          next: (data) => {
            patchState(store, {
              nfHeatmap: data.nfHeatmap,
              marketBreadth: data.marketBreadth,
              loading: false,
              lastUpdated: new Date().toISOString()
            });
          },
          error: () => patchState(store, { loading: false, error: 'Unable to load dashboard data.' })
        });
      },

      loadHistoricalData(selectedDate = store['selectedDate']()): void {
        patchState(store, {
          selectedDate,
          loading: true,
          error: null
        });

        apiService.getHistoricalCandles(selectedDate).subscribe({
          next: (candles) => {
            const enrichedCandles = enrichCandles(candles);
            patchState(store, { loading: false });
            patchCandles(enrichedCandles);
          },
          error: () => {
            patchState(store, {
              loading: false,
              error: 'Unable to load Nifty Futures historical data.'
            });
          }
        });
      },

      calculateOIDelta,

      calculateMarketStructure,

      appendRealtimeCandle(candle: NiftyFutureApiCandle): void {
        if (!isMarketHoursCandle(candle)) {
          return;
        }

        const candles = store['historicalCandles']();
        const previous = candles.at(-1);
        const enriched = enrichCandles([...(previous ? [toApiCandle(previous)] : []), candle]).at(-1);

        if (!enriched) {
          return;
        }

        patchCandles([...candles, enriched]);
      },

      updateRealtimeCandle(candle: NiftyFutureApiCandle): void {
        if (!isMarketHoursCandle(candle)) {
          return;
        }

        const candles = store['historicalCandles']();
        const previous = candles.at(-2);
        const enriched = enrichCandles([...(previous ? [toApiCandle(previous)] : []), candle]).at(-1);

        if (!enriched) {
          return;
        }

        patchCandles([...candles.slice(0, -1), enriched]);
      },

      connectSocket(): void {
        patchState(store, { socketConnected: true });
      },

      disconnectSocket(): void {
        realtimeSubscription?.unsubscribe();
        realtimeSubscription = null;
        patchState(store, { socketConnected: false });
      },

      handleSocketMessage(message: unknown): void {
        methods.updateRealtimeData(message);
      },

      appendRealtimeData(data: unknown): void {
        methods.appendRealtimeCandle(data as NiftyFutureApiCandle);
      },

      updateRealtimeData(data: unknown): void {
        methods.updateRealtimeCandle(data as NiftyFutureApiCandle);
      },

      startRealtime(lastCandle: NiftyFutureCandle): void {
        realtimeSubscription?.unsubscribe();
        realtimeSubscription = realtimeService.stream(toApiCandle(lastCandle)).subscribe({
          next: (candle) => {
            const latest = store['latestCandle']();

            if (latest?.timestamp === candle.timestamp) {
              methods.updateRealtimeCandle(candle);
            } else {
              methods.appendRealtimeCandle(candle);
            }
          },
          error: () => {
            patchState(store, { error: 'Realtime stream disconnected. Historical data remains available.' });
          }
        });
        patchState(store, { socketConnected: true });
      },

      refresh(): void {
        methods.loadHistoricalData(store['selectedDate']());
      },

      setSelectedDate(selectedDate: string): void {
        patchState(store, { selectedDate });
      },

      setSelectedDuration(selectedDuration: DashboardDuration): void {
        patchState(store, { selectedDuration });
      },

      clear(): void {
        methods.disconnectSocket();
        patchState(store, initialDashboardState);
      },

      destroy(): void {
        methods.disconnectSocket();
      }
    };

    return methods;
  });
}
