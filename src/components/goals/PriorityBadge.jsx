import { cn } from '../../utils/helpers';

const PRIORITY_STYLES = {
  'Low': 'bg-green-500/10 text-green-400 border-green-500/30',
  'Medium': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'High': 'bg-red-500/10 text-red-400 border-red-500/30'
};

export default function PriorityBadge({ priority, className }) {
  const style = PRIORITY_STYLES[priority] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border transition-all', style, className)}>
      {priority}
    </span>
  );
}
