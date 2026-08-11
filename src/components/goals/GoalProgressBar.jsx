import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export default function GoalProgressBar({ progress = 0, totalTasks = 0, approvedTasks = 0, size = 'md', className }) {
  const percentage = totalTasks > 0 ? Math.min(100, Math.max(0, progress)) : 0;
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-1.5">
        <span className={cn('font-bold text-white', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {percentage}% Completed
        </span>
        <span className={cn('text-text-muted font-medium', size === 'sm' ? 'text-[10px]' : 'text-xs')}>
          {approvedTasks} of {totalTasks} tasks approved
        </span>
      </div>
      <div className={cn('w-full bg-panel border border-border rounded-full overflow-hidden', size === 'sm' ? 'h-1.5' : 'h-2.5')}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-brand rounded-full"
        />
      </div>
    </div>
  );
}
