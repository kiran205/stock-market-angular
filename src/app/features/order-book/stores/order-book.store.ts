import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  OrderBookHistoryRequest,
  OrderBookHistoryResponse,
  OrderBookModuleData,
  OrderBookService
} from '../services/order-book.service';

interface OrderBookState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly data: OrderBookModuleData | null;
  readonly historyDate: string;
  readonly historyLoading: boolean;
  readonly historyError: string | null;
  readonly historyResult: OrderBookHistoryResponse | null;
  readonly historyPageIndex: number;
  readonly socketConnected: boolean;
  readonly lastUpdated: string | null;
}

function todayAsInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

const initialState: OrderBookState = {
  loaded: false,
  loading: false,
  error: null,
  data: null,
  historyDate: todayAsInputValue(),
  historyLoading: false,
  historyError: null,
  historyResult: null,
  historyPageIndex: 0,
  socketConnected: false,
  lastUpdated: null
};

export const OrderBookStore = signalStore(
  { providedIn: 'root' },
  withDevtools('order-book'),
  withState<OrderBookState>(initialState),
  withMethods((store) => {
    const orderBookService = inject(OrderBookService);

    const methods = {
      load(): void {
        if (store.loaded() || store.loading()) {
          return;
        }

        patchState(store, { loading: true, error: null });
        orderBookService.load().subscribe({
          next: (data) => {
            patchState(store, {
              data,
              loaded: true,
              loading: false,
              lastUpdated: new Date().toISOString()
            });
            methods.connectSocket();
          },
          error: () => patchState(store, { loading: false, error: 'Unable to load order-book data.' })
        });
      },

      refresh(): void {
        patchState(store, { loaded: false });
        methods.load();
      },

      loadHistory(payload: OrderBookHistoryRequest = { date: store.historyDate() }): void {
        patchState(store, {
          historyDate: payload.date,
          historyLoading: true,
          historyError: null,
          historyResult: null,
          historyPageIndex: 0
        });

        orderBookService.getOrderBookHistory(payload).subscribe({
          next: (historyResult) => {
            patchState(store, {
              historyLoading: false,
              historyResult,
              lastUpdated: new Date().toISOString()
            });
          },
          error: () => {
            patchState(store, {
              historyLoading: false,
              historyError: 'Unable to load order book history for the selected date.'
            });
          }
        });
      },

      setHistoryDate(historyDate: string): void {
        patchState(store, { historyDate });
      },

      setHistoryError(historyError: string | null): void {
        patchState(store, { historyError });
      },

      setHistoryPageIndex(historyPageIndex: number): void {
        patchState(store, { historyPageIndex });
      },

      connectSocket(): void {
        patchState(store, { socketConnected: true });
      },

      disconnectSocket(): void {
        patchState(store, { socketConnected: false });
      },

      handleSocketMessage(message: unknown): void {
        methods.updateRealtimeData(message);
      },

      appendRealtimeData(_data: unknown): void {
        patchState(store, { lastUpdated: new Date().toISOString() });
      },

      updateRealtimeData(_data: unknown): void {
        patchState(store, { lastUpdated: new Date().toISOString() });
      },

      clear(): void {
        methods.disconnectSocket();
        patchState(store, initialState);
      }
    };

    return methods;
  })
);
