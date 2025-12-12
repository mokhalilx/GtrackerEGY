export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface GoldData {
  price24k: number;
  price21k: number;
  price18k: number;
  usdRate: number;
  workmanshipMin: number;
  workmanshipMax: number;
  lastUpdated: string;
}

export interface HistoricalDataPoint {
  date: string;
  price21k: number;
  usdRate: number;
}

export interface NewsItem {
  headline: string;
  source: string;
}

export interface MarketAnalysis {
  prediction: 'UP' | 'DOWN' | 'STABLE';
  summary: string;
  reasoning: string[];
  sources: Array<{ title: string; url: string }>;
  news: NewsItem[];
}

export interface AppState {
  theme: Theme;
  language: Language;
  isLoading: boolean;
  error: string | null;
  data: GoldData | null;
  analysis: MarketAnalysis | null;
  nextUpdate: number; // Timestamp
}

export enum TrendDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  STABLE = 'STABLE'
}