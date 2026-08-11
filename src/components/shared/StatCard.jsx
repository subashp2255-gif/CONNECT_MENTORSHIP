import { cn } from '../../utils/helpers';

export default function StatCard({ icon: Icon, value, label, trend, trendValue, progress, accentColor, iconColor, iconBg, className }) {
  return (
    <div 
      className={cn('bg-white/5 backdrop-blur-md border border-white/10 p-6 stat-card-glow', className)}
      style={{
        borderRadius: '0 0 12px 12px',
        borderTop: accentColor ? `2px solid ${accentColor}` : undefined
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{label}</p>
          <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">
            {value}
          </h3>
        </div>
        <div 
          className="flex items-center justify-center shrink-0"
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: iconBg || 'rgba(124,111,247,0.12)', 
            color: iconColor || '#a78bfa'
          }}
        >
          <Icon style={{ width: '20px', height: '20px', color: 'currentColor' }} />
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
      
      {progress !== undefined && (
        <div className="w-full mt-[10px]" style={{ height: '3px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ background: accentColor, width: `${Math.min(100, Math.max(0, progress))}%`, height: '100%', borderRadius: '99px' }}></div>
        </div>
      )}
    </div>
  );
}
