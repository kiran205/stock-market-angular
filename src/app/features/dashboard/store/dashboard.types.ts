import {
  DashboardMarketSummary,
  NiftyFutureApiCandle,
  NiftyFutureCandle,
  StockHistoryResponse,
  SupportResistanceResponse
} from '../models/dashboard.models';

export type DashboardDuration = '1m' | '3m' | '5m' | '15m';

export interface DashboardState {
  readonly historicalCandles: readonly NiftyFutureCandle[];
  readonly latestCandle: NiftyFutureCandle | null;
  readonly selectedDate: string;
  readonly selectedDuration: DashboardDuration;
  readonly loading: boolean;
  readonly error: string | null;
  readonly marketSummary: DashboardMarketSummary;
  readonly nfHeatmap: readonly unknown[];
  readonly marketBreadth: Record<string, unknown>;
  readonly supportResistanceLoading: boolean;
  readonly supportResistanceError: string | null;
  readonly supportResistanceResult: SupportResistanceResponse | null;
  readonly stockHistoryLoading: boolean;
  readonly stockHistoryError: string | null;
  readonly stockHistoryResult: StockHistoryResponse | null;
  readonly stockHistoryPageIndexes: Record<string, number>;
  readonly socketConnected: boolean;
  readonly lastUpdated: string | null;
}

export type RealtimeCandlePayload = NiftyFutureApiCandle;

export const MARKET_OPEN_MINUTES = 9 * 60;
export const MARKET_CLOSE_MINUTES = 15 * 60 + 30;
export const MARKET_TIME_ZONE = 'Asia/Kolkata';
