import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { triggerConfetti } from '../../utils/confetti';

const items = [
  'Complete your profile',
  'Book your first session',
  'Save a mentor',
  'Join an event'
];

export default function OnboardingChecklistWidget() {
  const { checklist, completeChecklistItem, dismissChecklist } = useStore();
  const done = checklist.completed;
  const allDone = useMemo(() => items.every((item) => done.includes(item)), [done]);

  if (checklist.dismissed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 w-80">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-2xl p-4 shadow-2xl">
        <h4 className="font-bold text-white mb-3">Onboarding Checklist</h4>
        <div className="space-y-2">
          {items.map((item) => {
            const checked = done.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  if (!checked) completeChecklistItem(item);
                }}
                className={`w-full text-left text-sm rounded-xl px-3 py-2 border transition-colors ${
                  checked ? 'bg-green-500/15 border-green-500/30 text-green-300' : 'bg-panel border-border text-text-muted hover:text-white'
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-green-400' : 'text-text-dim'}`} />
                  {item}
                </span>
              </button>
            );
          })}
        </div>
        {allDone ? (
          <button
            type="button"
            onClick={() => {
              triggerConfetti(140);
              dismissChecklist();
            }}
            className="w-full mt-3 rounded-xl bg-gradient-brand text-white py-2 text-sm font-semibold"
          >
            Complete and close
          </button>
        ) : null}
      </motion.div>
    </div>
  );
}
