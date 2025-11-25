import { PortfolioMetrics, PerformanceResponse } from '../types';
import PerformanceChart from './PerformanceChart';
import PositionsTable from './PositionsTable';
import MetricsCards from './MetricsCards';
import './PortfolioDashboard.css';

interface Props {
  metrics: PortfolioMetrics;
  performance: PerformanceResponse;
}

function PortfolioDashboard({ metrics, performance }: Props) {
  return (
    <div className="portfolio-dashboard">
      <div className="dashboard-header">
        <h2>Portfolio Overview</h2>
        <div className="last-updated">
          Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
        </div>
      </div>

      <MetricsCards metrics={metrics} />

      <div className="dashboard-grid">
        <div className="chart-container">
          <h3>Performance (30 Days)</h3>
          <PerformanceChart data={performance.data} />
        </div>

        <div className="positions-container">
          <h3>Positions</h3>
          <PositionsTable positions={metrics.positions} />
        </div>
      </div>
    </div>
  );
}

export default PortfolioDashboard;

