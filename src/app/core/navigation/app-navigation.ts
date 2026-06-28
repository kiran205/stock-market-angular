import { NavSection } from '@core/models/navigation.model';

export const APP_NAVIGATION: readonly NavSection[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    items: [
      { label: 'NF Dashboard', route: '/dashboard/nf-dashboard', icon: 'space_dashboard' },
      { label: 'NF Heatmap', route: '/dashboard/nf-heatmap', icon: 'grid_view' },
      { label: 'Support & Resistance', route: '/dashboard/support-resistance', icon: 'ssid_chart' }
    ]
  },
  {
    label: 'Nifty50',
    icon: 'stacked_line_chart',
    items: [
      { label: 'Intel Timeline', route: '/nifty50/intel-timeline', icon: 'timeline' },
      { label: 'Sector Intelligence', route: '/nifty50/sector-intelligence', icon: 'hub' },
      { label: 'Weightage Matrix', route: '/nifty50/weightage-matrix', icon: 'account_tree' }
    ]
  },
  {
    label: 'Order Book',
    icon: 'candlestick_chart',
    items: [
      { label: 'Market Structure', route: '/order-book/market-structure', icon: 'candlestick_chart' }
    ]
  },
  {
    label: 'GEX',
    icon: 'insights',
    items: [
      { label: 'Market Regime', route: '/gex/market-regime', icon: 'insights' },
      { label: 'Market Intelligence', route: '/gex/market-intelligence', icon: 'query_stats' },
      { label: 'GEX Momentum', route: '/gex/gex-momentum', icon: 'speed' }
    ]
  },
  {
    label: 'Administration',
    icon: 'admin_panel_settings',
    items: [
      { label: 'Users', route: '/admin/users', icon: 'group' },
      { label: 'Roles', route: '/admin/roles', icon: 'badge' },
      { label: 'Audit Logs', route: '/admin/audit-logs', icon: 'fact_check' }
    ]
  },
  {
    label: 'Settings',
    icon: 'settings',
    items: [
      { label: 'Settings', route: '/settings', icon: 'settings' }
    ]
  }
];
