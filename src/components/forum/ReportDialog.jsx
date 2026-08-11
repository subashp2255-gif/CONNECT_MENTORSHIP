import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const reportReasons = [
  'Spam',
  'Harassment',
  'Inappropriate content',
  'Misinformation',
  'Duplicate question',
  'Promotional content',
  'Other'
];

export default function ReportDialog({ open, onOpenChange, contentType, contentId }) {
  const [selectedReason, setSelectedReason] = useState(reportReasons[0]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createForumReport } = useStore();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await createForumReport({
        contentType,
        contentId,
        reason: selectedReason,
        description: description.trim()
      });
      toast.success('Report submitted successfully! Thank you for helping keep the community safe. 🛡️');
      setDescription('');
      onOpenChange(false);
    } catch (err) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[90] transition-opacity" />
        <Dialog.Content className="fixed z-[91] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md bg-surface border border-border rounded-3xl p-6 shadow-2xl animate-fadeUp">
          
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-secondary" /> Report Content
            </Dialog.Title>
            <Dialog.Close className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors focus:outline-none">
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-text-muted leading-relaxed">
              Flag this {contentType} for administrator moderation. Select the closest reason below:
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {reportReasons.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`text-left rounded-xl px-3 py-2 text-xs border font-semibold transition-all ${
                    selectedReason === reason
                      ? 'border-primary bg-primary/10 text-primary-light'
                      : 'border-border bg-panel text-text-muted hover:text-white hover:border-white/20'
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">Additional Details (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about why you are reporting this content..."
                rows={3}
                className="w-full rounded-xl bg-panel border border-border p-3 text-sm text-white placeholder-text-dim focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border text-text-muted hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleSubmit}
            >
              Submit Report
            </Button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
