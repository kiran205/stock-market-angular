import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { GexModuleData, GexService } from '../services/gex.service';

interface GexState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly data: GexModuleData | null;
  readonly socketConnected: boolean;
  readonly lastUpdated: string | null;
}

const initialState: GexState = {
  loaded: false,
  loading: false,
  error: null,
  data: null,
  socketConnected: false,
  lastUpdated: null
};

export const GexStore = signalStore(
  { providedIn: 'root' },
  withDevtools('gex'),
  withState<GexState>(initialState),
  withMethods((store) => {
    const gexService = inject(GexService);

    const methods = {
      load(): void {
        if (store.loaded() || store.loading()) {
          return;
        }

        patchState(store, { loading: true, error: null });
        gexService.load().subscribe({
          next: (data) => {
            patchState(store, {
              data,
              loaded: true,
              loading: false,
              lastUpdated: new Date().toISOString()
            });
            methods.connectSocket();
          },
          error: () => patchState(store, { loading: false, error: 'Unable to load GEX data.' })
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
