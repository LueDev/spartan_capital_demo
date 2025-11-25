import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PerformanceDataPoint } from '../types';
import './PerformanceChart.css';

interface Props {
  data: PerformanceDataPoint[];
}

function PerformanceChart({ data }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-date">{formatDate(payload[0].payload.date)}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="performance-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickFormatter={formatDate}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="var(--text-secondary)"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--success)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: 'var(--success)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PerformanceChart;

