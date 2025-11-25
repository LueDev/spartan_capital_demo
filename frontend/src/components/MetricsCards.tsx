import { PortfolioMetrics } from '../types';
import './MetricsCards.css';

interface Props {
  metrics: PortfolioMetrics;
}

function MetricsCards({ metrics }: Props) {
  const isPositive = metrics.dailyChange >= 0;
  const changeColor = isPositive ? 'var(--success)' : 'var(--highlight)';
  const changeIcon = isPositive ? '↑' : '↓';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  return (
    <div className="metrics-cards">
      <div className="metric-card primary">
        <div className="metric-label">Total Portfolio Value</div>
        <div className="metric-value">{formatCurrency(metrics.totalValue)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Daily Change</div>
        <div className="metric-value" style={{ color: changeColor }}>
          {changeIcon} {formatCurrency(Math.abs(metrics.dailyChange))}
        </div>
        <div className="metric-subvalue" style={{ color: changeColor }}>
          {formatPercent(metrics.dailyChangePercent)}
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Positions</div>
        <div className="metric-value">{metrics.positions.length}</div>
        <div className="metric-subvalue">Active holdings</div>
      </div>
    </div>
  );
}

export default MetricsCards;

