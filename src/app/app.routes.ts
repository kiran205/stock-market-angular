import { Routes } from '@angular/router';
import { AppShellComponent } from './layouts/app-shell/app-shell.component';

export const appRoutes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('@features/auth/login.page').then((m) => m.LoginPageComponent),
        title: 'Login | Stock Analytics Pro'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('@features/auth/forgot-password.page').then((m) => m.ForgotPasswordPageComponent),
        title: 'Forgot Password | Stock Analytics Pro'
      },
      {
        path: 'reset-password',
        loadComponent: () => import('@features/auth/reset-password.page').then((m) => m.ResetPasswordPageComponent),
        title: 'Reset Password | Stock Analytics Pro'
      },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  },
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard/nf-dashboard' },
      {
        path: 'dashboard/nf-dashboard',
        loadComponent: () => import('@features/dashboard/pages/nf-dashboard/nf-dashboard.page').then((m) => m.NfDashboardPageComponent),
        title: 'NF Dashboard | Stock Analytics Pro'
      },
      {
        path: 'dashboard/nf-heatmap',
        loadComponent: () => import('@features/dashboard/pages/nf-heatmap/nf-heatmap.page').then((m) => m.NfHeatmapPageComponent),
        title: 'NF Heatmap | Stock Analytics Pro'
      },
      {
        path: 'dashboard/support-resistance',
        loadComponent: () => import('@features/dashboard/pages/support-resistance/support-resistance.page').then((m) => m.SupportResistancePageComponent),
        title: 'Support & Resistance | Stock Analytics Pro'
      },
      {
        path: 'dashboard/stock-history',
        loadComponent: () => import('@features/dashboard/pages/stock-history/stock-history.page').then((m) => m.StockHistoryPageComponent),
        title: 'Stock History | Stock Analytics Pro'
      },
      {
        path: 'nifty50/intel-timeline',
        loadComponent: () => import('@features/nifty50/intel-timeline/intel-timeline.page').then((m) => m.IntelTimelinePageComponent),
        title: 'Intel Timeline | Stock Analytics Pro'
      },
      {
        path: 'nifty50/sector-intelligence',
        loadComponent: () => import('@features/nifty50/sector-intelligence/sector-intelligence.page').then((m) => m.SectorIntelligencePageComponent),
        title: 'Sector Intelligence | Stock Analytics Pro'
      },
      {
        path: 'nifty50/weightage-matrix',
        loadComponent: () => import('@features/nifty50/weightage-matrix/weightage-matrix.page').then((m) => m.WeightageMatrixPageComponent),
        title: 'Nifty Weightage Matrix | Stock Analytics Pro'
      },
      {
        path: 'order-book/market-structure',
        loadComponent: () => import('@features/order-book/market-structure/market-structure.page').then((m) => m.MarketStructurePageComponent),
        title: 'Market Structure | Stock Analytics Pro'
      },
      {
        path: 'order-book/order-book-history',
        loadComponent: () => import('@features/order-book/order-book-history/order-book-history.page').then((m) => m.OrderBookHistoryPageComponent),
        title: 'Order Book History | Stock Analytics Pro'
      },
      {
        path: 'gex/market-regime',
        loadComponent: () => import('@features/gex/market-regime/market-regime.page').then((m) => m.MarketRegimePageComponent),
        title: 'Market Regime | Stock Analytics Pro'
      },
      {
        path: 'gex/market-intelligence',
        loadComponent: () => import('@features/gex/market-intelligence/market-intelligence.page').then((m) => m.GexMarketIntelligencePageComponent),
        title: 'Market Intelligence | Stock Analytics Pro'
      },
      {
        path: 'gex/gex-momentum',
        loadComponent: () => import('@features/gex/gex-momentum/gex-momentum.page').then((m) => m.GexMomentumPageComponent),
        title: 'GEX Momentum | Stock Analytics Pro'
      },
      {
        path: 'admin/users',
        loadComponent: () => import('@features/admin/users/users.page').then((m) => m.UsersPageComponent),
        title: 'Users | Stock Analytics Pro'
      },
      {
        path: 'admin/roles',
        loadComponent: () => import('@features/admin/roles/roles.page').then((m) => m.RolesPageComponent),
        title: 'Roles | Stock Analytics Pro'
      },
      {
        path: 'admin/audit-logs',
        loadComponent: () => import('@features/admin/audit-logs/audit-logs.page').then((m) => m.AuditLogsPageComponent),
        title: 'Audit Logs | Stock Analytics Pro'
      },
      {
        path: 'settings',
        loadComponent: () => import('@features/settings/settings.page').then((m) => m.SettingsPageComponent),
        title: 'Settings | Stock Analytics Pro'
      },
      {
        path: 'profile',
        loadComponent: () => import('@features/profile/my-profile.page').then((m) => m.MyProfilePageComponent),
        title: 'My Profile | Stock Analytics Pro'
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard/nf-dashboard' }
];
