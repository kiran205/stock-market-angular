import { inject } from '@angular/core';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AdminModuleData, AdminService } from '../services/admin.service';

interface AdminState {
  readonly loaded: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly data: AdminModuleData | null;
  readonly socketConnected: boolean;
  readonly lastUpdated: string | null;
}

const initialState: AdminState = {
  loaded: false,
  loading: false,
  error: null,
  data: null,
  socketConnected: false,
  lastUpdated: null
};

export const AdminStore = signalStore(
  { providedIn: 'root' },
  withDevtools('admin'),
  withState<AdminState>(initialState),
  withMethods((store) => {
    const adminService = inject(AdminService);

    const methods = {
      load(): void {
        if (store.loaded() || store.loading()) {
          return;
        }

        patchState(store, { loading: true, error: null });
        adminService.load().subscribe({
          next: (data) => patchState(store, {
            data,
            loaded: true,
            loading: false,
            lastUpdated: new Date().toISOString()
          }),
          error: () => patchState(store, { loading: false, error: 'Unable to load administration data.' })
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
