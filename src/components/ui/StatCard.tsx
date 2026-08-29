import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  className = '',
}: StatCardProps) {
  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
  };

  const trendColors = {
    up: 'text-success bg-success/10',
    down: 'text-error bg-error/10',
    neutral: 'text-on-surface-variant bg-surface-container',
  };

  return (
    <Card className={`hover:shadow-card-hover transition-shadow duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-label-md text-on-surface-variant mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-stat-value font-bold text-on-surface">{value}</span>
            {unit && <span className="text-body-md text-on-surface-variant">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${trendColors[trend]}`}>
              {trendIcons[trend]}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
