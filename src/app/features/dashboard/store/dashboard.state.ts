import { DashboardMarketSummary } from '../models/dashboard.models';
import { DashboardState } from './dashboard.types';

export function todayAsInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function emptyMarketSummary(): DashboardMarketSummary {
  return {
    latestPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    oiChange: 0,
    volume: 0,
    currentSentiment: 'Neutral',
    marketStructure: null
  };
}

export const initialDashboardState: DashboardState = {
  historicalCandles: [],
  latestCandle: null,
  selectedDate: todayAsInputValue(),
  selectedDuration: '1m',
  loading: false,
  error: null,
  marketSummary: emptyMarketSummary(),
  nfHeatmap: [],
  marketBreadth: {},
  supportResistanceLoading: false,
  supportResistanceError: null,
  supportResistanceResult: null,
  stockHistoryLoading: false,
  stockHistoryError: null,
  stockHistoryResult: null,
  stockHistoryPageIndexes: {},
  socketConnected: false,
  lastUpdated: null
};
