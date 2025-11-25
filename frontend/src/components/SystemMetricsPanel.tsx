import { SystemMetrics } from '../types';
import './SystemMetricsPanel.css';

interface Props {
  metrics: SystemMetrics;
}

function SystemMetricsPanel({ metrics }: Props) {
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const memoryPercent = (metrics.memory.used / metrics.memory.total) * 100;

  const cpuUsage = metrics.cpu?.usage || 0;
  const cpuColor = cpuUsage > 80 ? 'var(--highlight)' : cpuUsage > 60 ? 'var(--warning)' : 'var(--success)';

  return (
    <div className="system-metrics-panel">
      <h2>System Metrics</h2>
      <div className="metrics-grid">
        <div className="metric-item">
          <div className="metric-label">Memory Usage</div>
          <div className="metric-bar-container">
            <div 
              className="metric-bar" 
              style={{ width: `${memoryPercent}%` }}
            ></div>
          </div>
          <div className="metric-detail">
            {metrics.memory.used} MB / {metrics.memory.total} MB ({memoryPercent.toFixed(1)}%)
          </div>
        </div>

        {metrics.cpu && (
          <div className="metric-item">
            <div className="metric-label">CPU Usage</div>
            <div className="metric-bar-container">
              <div 
                className="metric-bar" 
                style={{ width: `${cpuUsage}%`, background: cpuColor }}
              ></div>
            </div>
            <div className="metric-detail" style={{ color: cpuColor }}>
              {cpuUsage.toFixed(1)}%
            </div>
          </div>
        )}

        {metrics.requests && (
          <>
            <div className="metric-item">
              <div className="metric-label">Request Rate</div>
              <div className="metric-value-large">{metrics.requests.perSecond.toFixed(2)}</div>
              <div className="metric-subvalue">requests/sec</div>
            </div>

            <div className="metric-item">
              <div className="metric-label">Total Requests</div>
              <div className="metric-value-large">{metrics.requests.total.toLocaleString()}</div>
              <div className="metric-subvalue">
                {metrics.requests.errors > 0 && (
                  <span style={{ color: 'var(--highlight)' }}>
                    {metrics.requests.errors} errors ({metrics.requests.errorRate}%)
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {metrics.responseTime && (
          <div className="metric-item">
            <div className="metric-label">Response Time</div>
            <div className="metric-detail">
              <div>Avg: <strong>{metrics.responseTime.average}ms</strong></div>
              <div>P50: {metrics.responseTime.p50}ms</div>
              <div>P95: {metrics.responseTime.p95}ms</div>
              <div>P99: {metrics.responseTime.p99}ms</div>
            </div>
          </div>
        )}

        <div className="metric-item">
          <div className="metric-label">Uptime</div>
          <div className="metric-value-large">{formatUptime(metrics.uptime)}</div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Node.js Version</div>
          <div className="metric-value-large">{metrics.nodeVersion}</div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Platform</div>
          <div className="metric-value-large">{metrics.platform}</div>
        </div>
      </div>
    </div>
  );
}

export default SystemMetricsPanel;

