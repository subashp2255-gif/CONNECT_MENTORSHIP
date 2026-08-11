import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, CheckSquare, Video } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function MenteeProgressReport({ isOpen, onClose, mentee }) {
  const { goals, sessions } = useStore();

  if (!isOpen || !mentee) return null;

  const menteeGoals = goals?.filter(g => g.menteeId === mentee.id) || [];
  const completedSessions = sessions?.filter(s => s.menteeId === mentee.id && s.status === 'completed') || [];
  
  // Extract mock action items from past notes (or just mock them directly)
  const actionItems = [
    { id: 1, text: 'Complete LeetCode DP patterns', done: true },
    { id: 2, text: 'Rewrite resume summary', done: false },
    { id: 3, text: 'Read System Design Primer chapter 1', done: false }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-panel border-l border-border w-full max-w-md h-full flex flex-col shadow-2xl"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface">
          <div className="flex items-center gap-4">
             <img src={mentee.avatar || `https://ui-avatars.com/api/?name=${mentee.name}&background=random`} alt={mentee.name} className="w-12 h-12 rounded-full object-cover" />
             <div>
               <h2 className="font-bold text-white text-lg">{mentee.name}'s Progress</h2>
               <p className="text-sm text-text-muted">{mentee.college || 'Student'}</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          <div className="flex gap-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Video className="w-6 h-6 text-primary-light" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{completedSessions.length}</div>
              <div className="text-sm text-text-muted">Completed Sessions</div>
            </div>
          </div>

          <section>
            <h3 className="flex items-center text-sm font-bold text-white mb-4 uppercase tracking-wider">
              <Target className="w-4 h-4 mr-2 text-primary-light" /> Current Goals
            </h3>
            {menteeGoals.length > 0 ? (
              <div className="space-y-3">
                {menteeGoals.map(goal => (
                  <div key={goal.id} className="bg-surface border border-border p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white text-sm">{goal.title}</h4>
                      <span className="text-xs font-bold text-primary-light">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-panel rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted p-4 bg-surface border border-border rounded-xl">No active goals found.</p>
            )}
          </section>

          <section>
            <h3 className="flex items-center text-sm font-bold text-white mb-4 uppercase tracking-wider">
              <CheckSquare className="w-4 h-4 mr-2 text-green-400" /> Pending Action Items
            </h3>
            <div className="space-y-2">
               {actionItems.map(item => (
                 <div key={item.id} className="flex items-start gap-3 p-3 bg-surface border border-border rounded-xl">
                   <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${item.done ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'border-border text-transparent'}`}>
                     {item.done && <CheckSquare className="w-3.5 h-3.5" />}
                   </div>
                   <span className={`text-sm ${item.done ? 'text-text-muted line-through' : 'text-white'}`}>{item.text}</span>
                 </div>
               ))}
            </div>
          </section>

        </div>
      </motion.div>
    </div>
  );
}
