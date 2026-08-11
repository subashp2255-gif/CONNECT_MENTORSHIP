import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useStore } from '../../store/useStore';

const reasons = ['Spam', 'Inappropriate', 'Fake profile'];

export default function ReportDialog({ open, onOpenChange, mentorId }) {
  const [reason, setReason] = useState(reasons[0]);
  const { submitReport } = useStore();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/70 z-[90]" />
        <Dialog.Content className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-surface border border-border rounded-2xl p-5">
          <Dialog.Title className="text-lg font-bold text-white">Report mentor</Dialog.Title>
          <div className="mt-4 space-y-2">
            {reasons.map((item) => (
              <button key={item} onClick={() => setReason(item)} className={`w-full text-left rounded-xl px-3 py-2 border ${reason === item ? 'border-primary bg-primary/10 text-primary-light' : 'border-border text-text-muted'}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => onOpenChange(false)} className="px-4 py-2 rounded-lg border border-border text-text-muted">Cancel</button>
            <button
              onClick={() => {
                submitReport({ mentorId, reason });
                onOpenChange(false);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-brand text-white"
            >
              Submit
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
