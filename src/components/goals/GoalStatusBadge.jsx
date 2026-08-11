import { cn } from '../../utils/helpers';

const STATUS_STYLES = {
  'Not Started': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  'In Progress': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Under Review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  'Completed': 'bg-green-500/10 text-green-400 border-green-500/30',
  'Paused': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'Overdue': 'bg-red-500/10 text-red-400 border-red-500/30'
};

export default function GoalStatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all', style, className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
}
