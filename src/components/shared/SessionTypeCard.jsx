import { Video, BookOpen, MessageSquare, FileText, Code } from 'lucide-react';
import { cn } from '../../utils/helpers';

const typeIcons = {
  'Mock Interview': Video,
  'Project Guidance': BookOpen,
  'Career Chat': MessageSquare,
  'Resume Review': FileText,
  'DSA Practice': Code,
};

export default function SessionTypeCard({ type, selected, onClick, className }) {
  const Icon = typeIcons[type] || MessageSquare;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center p-4 rounded-xl border text-left transition-all duration-200',
        selected 
          ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
          : 'bg-surface border-white/5 hover:border-white/20 hover:bg-white/5',
        className
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-colors',
        selected ? 'bg-primary/20' : 'bg-white/5'
      )}>
        <Icon className={cn('w-5 h-5', selected ? 'text-primary' : 'text-gray-400')} />
      </div>
      <div>
        <div className={cn('font-bold text-sm sm:text-base', selected ? 'text-white' : 'text-gray-300')}>
          {type}
        </div>
      </div>
    </button>
  );
}
