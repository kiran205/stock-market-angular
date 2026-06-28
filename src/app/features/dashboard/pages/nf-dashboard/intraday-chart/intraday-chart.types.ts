export type IntradaySentiment = 'LONG_BUILDUP' | 'SHORT_BUILDUP' | 'SHORT_COVERING' | 'LONG_UNWINDING' | string;

export interface IntradayPoint {
  readonly time: string;
  readonly price: number;
  readonly oiChange: number;
  readonly volume: number;
  readonly sentiment: IntradaySentiment;
}

export interface IntradayChartViewModel {
  readonly labels: readonly string[];
  readonly priceData: readonly number[];
  readonly positiveOiData: readonly (number | null)[];
  readonly negativeOiData: readonly (number | null)[];
  readonly oiAxisLimit: number;
  readonly priceMin: number;
  readonly priceMax: number;
  readonly sentiment: IntradaySentiment;
}
