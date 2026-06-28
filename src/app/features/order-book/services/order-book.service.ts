import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface OrderBookModuleData {
  readonly marketStructure: readonly unknown[];
  readonly orderFlow: readonly unknown[];
}

export interface OrderBookHistoryRequest {
  readonly date: string;
}

export interface OrderBookHistoryRecord {
  readonly id: number;
  readonly timestamp: string;
  readonly atm: number;
  readonly exec_delta: number;
  readonly book_delta: number;
  readonly ask_removed: number;
  readonly bid_removed: number;
  readonly cum_exec_delta_30: number;
  readonly cum_book_delta_30: number;
  readonly imbalance: number;
  readonly strike_shift: number;
  readonly score: number;
  readonly regime: string;
  readonly created_at: string;
}

export interface OrderBookHistoryResponse {
  readonly generated_at: string;
  readonly date: string;
  readonly total_records: number;
  readonly data: readonly OrderBookHistoryRecord[];
}

const ORDER_BOOK_HISTORY_URL = 'https://asia-south1-stock-anaysis.cloudfunctions.net/get-order-book-history';

@Injectable({ providedIn: 'root' })
export class OrderBookService {
  constructor(private readonly http: HttpClient) {}

  load(): Observable<OrderBookModuleData> {
    return of({
      marketStructure: [],
      orderFlow: []
    });
  }

  getOrderBookHistory(payload: OrderBookHistoryRequest): Observable<OrderBookHistoryResponse> {
    return this.http.post<OrderBookHistoryResponse>(ORDER_BOOK_HISTORY_URL, payload);
  }
}
