import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function SkillChip({ skill, onRemove, size = 'md', className }) {
  const isSmall = size === 'sm';
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium bg-white/5 border border-white/10 text-gray-300',
      isSmall ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      className
    )}>
      {skill}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(skill);
          }}
          className={cn(
            'hover:text-white transition-colors',
            isSmall ? 'ml-1' : 'ml-1.5'
          )}
        >
          <X className={cn(isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3')} />
        </button>
      )}
    </span>
  );
}
