import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { signalStore, withState } from '@ngrx/signals';
import { withDashboardComputed } from './dashboard.computed';
import { withDashboardMethods } from './dashboard.methods';
import { initialDashboardState } from './dashboard.state';

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withDevtools('dashboard'),
  withState(initialDashboardState),
  withDashboardComputed(),
  withDashboardMethods()
);
