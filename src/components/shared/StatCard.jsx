import { cn } from '../../utils/helpers';

export default function StatCard({ icon: Icon, value, label, trend, trendValue, className }) {
  return (
    <div className={cn('bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{label}</p>
          <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
            {value}
          </h3>
        </div>
        <div className="p-3 rounded-xl bg-surface border border-white/5">
          <Icon className="w-5 h-5 text-primary-light" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <span className={cn('font-medium', trend === 'up' ? 'text-green-400' : 'text-red-400')}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </span>
          <span className="text-text-muted ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
