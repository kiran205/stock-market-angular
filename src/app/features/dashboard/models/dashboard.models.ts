export type {
  DashboardMarketSummary,
  MarketStructureEvent,
  NiftyFutureApiCandle,
  NiftyFutureCandle
} from '@core/models/nifty-future-candle.model';

export interface DashboardModuleData {
  readonly nfHeatmap: readonly unknown[];
  readonly marketSummary: Record<string, unknown>;
  readonly marketBreadth: Record<string, unknown>;
}
