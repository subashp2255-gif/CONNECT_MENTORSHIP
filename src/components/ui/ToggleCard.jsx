import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function ToggleCard({ selected, onClick, icon: Icon, title, subtitle, bullets = [] }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300",
        selected 
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" 
          : "border-border bg-surface hover:border-gray-600"
      )}
    >
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </motion.div>
      )}
      
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
        selected ? "bg-primary text-white" : "bg-panel text-text-muted border border-border"
      )}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className={cn("text-sm mb-4 transition-colors", selected ? "text-primary-light" : "text-text-muted")}>
        {subtitle}
      </p>
      
      {bullets.length > 0 && (
        <ul className="space-y-2 mt-4">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start text-xs text-gray-400">
              <span className="mr-2 text-primary">✓</span> {bullet}
            </li>
          ))}
        </ul>
      )}
    </motion.button>
  );
}
