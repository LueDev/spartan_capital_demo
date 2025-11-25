import { Position } from '../types';
import './PositionsTable.css';

interface Props {
  positions: Position[];
}

function PositionsTable({ positions }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const getTotalValue = (position: Position) => {
    return position.shares * position.price;
  };

  return (
    <div className="positions-table">
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => {
            const isPositive = position.change >= 0;
            const changeColor = isPositive ? 'var(--success)' : 'var(--highlight)';
            
            return (
              <tr key={position.symbol}>
                <td className="symbol-cell">
                  <span className="symbol">{position.symbol}</span>
                  <span className="shares">{position.shares} shares</span>
                </td>
                <td>{formatCurrency(position.price)}</td>
                <td style={{ color: changeColor }}>
                  {isPositive ? '↑' : '↓'} {formatChange(Math.abs(position.change))}
                </td>
                <td className="value-cell">{formatCurrency(getTotalValue(position))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PositionsTable;

