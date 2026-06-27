import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Nifty50ModuleData, Nifty50Service } from '../services/nifty50.service';

interface Nifty50State {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly data: Nifty50ModuleData | null;
  readonly socketConnected: boolean;
  readonly lastUpdated: string | null;
}

const initialState: Nifty50State = {
  loaded: false,
  loading: false,
  error: null,
  data: null,
  socketConnected: false,
  lastUpdated: null
};

export const Nifty50Store = signalStore(
  { providedIn: 'root' },
  withDevtools('nifty50'),
  withState<Nifty50State>(initialState),
  withMethods((store) => {
    const nifty50Service = inject(Nifty50Service);

    const methods = {
      load(): void {
        if (store.loaded() || store.loading()) {
          return;
        }

        patchState(store, { loading: true, error: null });
        nifty50Service.load().subscribe({
          next: (data) => {
            patchState(store, {
              data,
              loaded: true,
              loading: false,
              lastUpdated: new Date().toISOString()
            });
            methods.connectSocket();
          },
          error: () => patchState(store, { loading: false, error: 'Unable to load Nifty50 data.' })
        });
      },

      refresh(): void {
        patchState(store, { loaded: false });
        methods.load();
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
