import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Star } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { triggerConfetti } from '../../utils/confetti';

export default function PostSessionFeedbackDialog() {
  const { postFeedbackModalSessionId, closePostFeedbackModal, submitPostFeedback } = useStore();
  const [rating, setRating] = useState(0);
  const [good, setGood] = useState('');
  const [improve, setImprove] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = () => {
    submitPostFeedback({ sessionId: postFeedbackModalSessionId, rating, good, improve, createdAt: new Date().toISOString() });
    triggerConfetti(120);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setRating(0);
      setGood('');
      setImprove('');
    }, 1200);
  };

  return (
    <Dialog.Root open={Boolean(postFeedbackModalSessionId)} onOpenChange={(open) => !open && closePostFeedbackModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/70 backdrop-blur-sm z-[90]" />
        <Dialog.Content className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-lg bg-surface border border-border rounded-2xl p-5">
          {done ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-white">Thank you for your feedback!</h3>
            </div>
          ) : (
            <>
              <Dialog.Title className="text-xl font-bold text-white">Post-session Feedback</Dialog.Title>
              <div className="mt-4 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)}>
                    <Star className={`w-7 h-7 ${rating >= n ? 'fill-yellow-400 text-yellow-400' : 'text-text-dim'}`} />
                  </button>
                ))}
              </div>
              <textarea value={good} onChange={(e) => setGood(e.target.value)} placeholder="What went well?" className="w-full mt-4 bg-panel border border-border rounded-xl p-3 text-white" />
              <textarea value={improve} onChange={(e) => setImprove(e.target.value)} placeholder="What could improve?" className="w-full mt-3 bg-panel border border-border rounded-xl p-3 text-white" />
              <div className="mt-4 flex justify-end gap-2">
                <button className="px-4 py-2 rounded-lg border border-border text-text-muted" onClick={closePostFeedbackModal}>Skip</button>
                <button className="px-4 py-2 rounded-lg bg-gradient-brand text-white" onClick={onSubmit} disabled={!rating}>Submit</button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
