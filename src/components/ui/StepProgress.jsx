import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

export default function StepProgress({ currentStep, totalSteps, steps }) {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8 sticky top-0 z-20 bg-background/80 backdrop-blur-md pt-4 pb-2">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </h2>
        <span className="text-xs text-primary-light font-medium">
          {steps[currentStep - 1]?.title || 'Almost there'}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-panel rounded-full overflow-hidden mb-3">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-brand rounded-full"
        />
      </div>
      
      {/* Dots */}
      <div className="flex justify-between px-1">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          
          return (
            <div 
              key={stepNum}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                isCompleted ? "bg-green-500" : isCurrent ? "bg-primary animate-pulse" : "bg-panel"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
