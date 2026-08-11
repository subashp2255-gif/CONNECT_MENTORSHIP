import { Target, Plus } from 'lucide-react';
import Button from '../ui/Button';

export default function EmptyGoalsState({ role, onCreateClick }) {
  const isMentor = role === 'mentor';

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-surface/50 border border-dashed border-border rounded-3xl text-center">
      <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary-light mb-6">
        <Target className="w-8 h-8" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">
        {isMentor ? 'No learning goals created yet' : 'No goals assigned yet'}
      </h3>
      
      <p className="text-sm text-text-muted max-w-sm mb-6 leading-relaxed">
        {isMentor 
          ? 'Create a goal to guide your mentee with a structured learning plan, tasks, and deadlines.'
          : "Your mentor's learning plans will appear here. Talk to your mentor in chat to discuss setting up your goals."}
      </p>

      {isMentor && (
        <Button onClick={onCreateClick} className="shadow-lg">
          <Plus className="w-4 h-4 mr-2" /> Create First Goal
        </Button>
      )}
    </div>
  );
}
