import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { NiftyFutureApiCandle } from '@core/models/nifty-future-candle.model';
import { environment } from '../../../environments/environment';

const NIFTY_FUTURES_API_URL = `${environment.api.baseUrl}${environment.api.endpoints.niftyFutures}`;

@Injectable({ providedIn: 'root' })
export class NiftyFuturesApiService {
  private readonly http = inject(HttpClient);

  getHistoricalCandles(selectedDate: string, limit = 1000): Observable<readonly NiftyFutureApiCandle[]> {
    const params = new HttpParams()
      .set('date', selectedDate)
      .set('limit', limit);

    return this.http.get<readonly NiftyFutureApiCandle[] | { data: readonly NiftyFutureApiCandle[] }>(
      NIFTY_FUTURES_API_URL,
      { params }
    ).pipe(
      map((response) => this.isWrappedResponse(response) ? response.data : response)
    );
  }

  private isWrappedResponse(
    response: readonly NiftyFutureApiCandle[] | { data: readonly NiftyFutureApiCandle[] }
  ): response is { data: readonly NiftyFutureApiCandle[] } {
    return 'data' in response;
  }
}
