import { Injectable } from '@angular/core';
import { Observable, interval, map, scan, shareReplay } from 'rxjs';
import { NiftyFutureApiCandle } from '@core/models/nifty-future-candle.model';

@Injectable({ providedIn: 'root' })
export class NiftyFuturesRealtimeService {
  stream(lastCandle: NiftyFutureApiCandle): Observable<NiftyFutureApiCandle> {
    return interval(2500).pipe(
      scan((previous) => {
        const drift = (Math.random() - 0.46) * 42;
        const close = Math.max(1, previous.close + drift);
        const open = previous.close;
        const high = Math.max(open, close) + Math.random() * 18;
        const low = Math.min(open, close) - Math.random() * 18;
        const volume = Math.max(1, Math.round(previous.volume * (0.84 + Math.random() * 0.35)));
        const oi = Math.max(1, Math.round(previous.oi + (Math.random() - 0.48) * 8500));
        const nextTimestamp = new Date(new Date(previous.timestamp).getTime() + 60_000).toISOString();

        return {
          ...previous,
          timestamp: nextTimestamp,
          open,
          high,
          low,
          close,
          volume,
          oi
        };
      }, lastCandle),
      map((candle) => candle),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
