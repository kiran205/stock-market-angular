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

export const STOCK_WEIGHTS: Record<string, number> = {
  HDFCBANK: 11.2,
  RELIANCE: 9.8,
  ICICIBANK: 8.7,
  INFY: 6.4,
  TCS: 5.8,
  BHARTIARTL: 4.7,
  ITC: 4.4,
  LT: 4.1,
  SBIN: 3.2,
  AXISBANK: 2.8,
  KOTAKBANK: 2.4,
  HINDUNILVR: 2.2,
  BAJFINANCE: 2.0,
  SUNPHARMA: 1.9,
  'M&M': 1.8,
  MARUTI: 1.7,
  ULTRACEMCO: 1.6,
  HCLTECH: 1.6,
  BAJAJFINSV: 1.5,
  TITAN: 1.4,
  NESTLEIND: 1.3,
  ADANIENT: 1.2,
  ADANIPORTS: 1.2,
  TECHM: 1.1,
  ASIANPAINT: 1.1,
  POWERGRID: 1.1,
  BEL: 1.0,
  TATASTEEL: 0.9,
  JSWSTEEL: 0.9,
  HINDALCO: 0.8,
  GRASIM: 0.8,
  DRREDDY: 0.8,
  CIPLA: 0.8,
  EICHERMOT: 0.7,
  BAJAJ_AUTO: 0.7,
  APOLLOHOSP: 0.7,
  NTPC: 0.7,
  ONGC: 0.7,
  BPCL: 0.6,
  COALINDIA: 0.6,
  HEROMOTOCO: 0.5,
  ETERNAL: 0.4,
  INDUSINDBK: 0.4,
  JIOFIN: 0.4,
  SBILIFE: 0.4,
  HDFCLIFE: 0.4,
  SHRIRAMFIN: 0.3,
  BRITANNIA: 0.3,
  TATACONSUM: 0.3
};

export type SupportResistanceDays = 15 | 30 | 45 | 60 | 90 | 120 | 150;

export interface SupportResistanceRequest {
  readonly days: SupportResistanceDays;
  readonly symbols: readonly string[];
}

export interface SupportResistanceLevel {
  readonly price: number;
  readonly strength: number;
  readonly touches: number;
  readonly volume_score: number;
}

export interface SupportResistanceOiAnalysis {
  readonly status: string;
  readonly oi_change: number;
  readonly volume_change: number;
  readonly price_change: number;
}

export interface SupportResistanceStock {
  readonly symbol: string;
  readonly current_price: number;
  readonly support: readonly SupportResistanceLevel[];
  readonly resistance: readonly SupportResistanceLevel[];
  readonly oi_analysis?: SupportResistanceOiAnalysis;
}

export interface SupportResistanceResponse {
  readonly generated_at: string;
  readonly days: number;
  readonly stocks: readonly SupportResistanceStock[];
}
