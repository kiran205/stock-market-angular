export type MarketStructureEvent =
  | 'LONG_BUILDUP'
  | 'SHORT_BUILDUP'
  | 'LONG_UNWINDING'
  | 'SHORT_COVERING';

export interface NiftyFutureApiCandle {
  readonly timestamp: string;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly oi: number;
  readonly symbol: string;
  readonly expiry: string;
}

export interface NiftyFutureCandle {
  readonly timestamp: string;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly oi: number;
  readonly oiDelta: number;
  readonly marketStructure: MarketStructureEvent;
}

export interface DashboardMarketSummary {
  readonly latestPrice: number;
  readonly priceChange: number;
  readonly priceChangePercent: number;
  readonly oiChange: number;
  readonly volume: number;
  readonly currentSentiment: 'Bullish' | 'Bearish' | 'Neutral';
  readonly marketStructure: MarketStructureEvent | null;
}
