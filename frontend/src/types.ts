export interface PortfolioMetrics {
  totalValue: number;
  dailyChange: number;
  dailyChangePercent: number;
  positions: Position[];
  timestamp: string;
}

export interface Position {
  symbol: string;
  shares: number;
  price: number;
  change: number;
}

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

export interface PerformanceResponse {
  data: PerformanceDataPoint[];
  period: number;
}

export interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    external: number;
  };
  cpu?: {
    usage: number;
  };
  requests?: {
    total: number;
    perSecond: number;
    errors: number;
    errorRate: number;
  };
  responseTime?: {
    average: number;
    p50: number;
    p95: number;
    p99: number;
  };
  uptime: number;
  nodeVersion: string;
  platform: string;
  timestamp: string;
}
