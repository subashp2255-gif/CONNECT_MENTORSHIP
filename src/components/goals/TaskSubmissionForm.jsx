import { useState, useEffect } from 'react';
import { X, Globe } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

export default function TaskSubmissionForm({ isOpen, onClose, task }) {
  const { submitTask } = useStore();

  const [notes, setNotes] = useState('');
  const [proofLink, setProofLink] = useState('');
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setNotes(task.menteeNotes || '');
      setProofLink(task.proofLink || '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    // Proof link URL check
    if (proofLink && !proofLink.startsWith('http://') && !proofLink.startsWith('https://')) {
      setError('Proof link must be a valid URL starting with http:// or https://');
      return;
    }

    setIsSubmitting(true);
    try {
      submitTask(task.id, {
        menteeNotes: notes.trim(),
        proofLink: proofLink.trim()
      });
      toast.success('Task submitted successfully!');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = task.status === 'Submitted';
  const isResubmitting = task.status === 'Needs Improvement';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
          <h3 className="text-lg font-bold text-white">
            {isEditing ? 'Edit Submission' : isResubmitting ? 'Resubmit Task' : 'Submit Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="text-xs text-text-muted block mb-1">Task:</span>
            <p className="text-sm font-semibold text-white mb-2">{task.title}</p>
            {task.description && (
              <p className="text-xs text-text-dim leading-relaxed">{task.description}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-muted mb-1.5">
              Completion Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="What did you build/accomplish in this milestone? Explain details..."
              rows={4}
              required
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-2.5 px-3.5 text-xs focus:outline-none transition-colors"
            />
          </div>

          <Input
            label="Proof of Work Link (optional)"
            placeholder="e.g. GitHub URL or demo link"
            icon={Globe}
            value={proofLink}
            onChange={e => setProofLink(e.target.value)}
            error={error}
            className="py-2.5 sm:text-xs rounded-xl"
          />

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border mt-4">
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              isLoading={isSubmitting}
            >
              {isEditing ? 'Save Changes' : 'Submit Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
