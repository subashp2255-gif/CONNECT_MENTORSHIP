import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

export default function MentorReviewPanel({ task, onClose, onReviewed }) {
  const { approveTask, rejectTask } = useStore();

  const [status, setStatus] = useState('Approve'); // Approve or NeedsImprovement
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError('');

    if (status === 'NeedsImprovement' && !feedback.trim()) {
      setError('Feedback is required when requesting improvements.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (status === 'Approve') {
        approveTask(task.id, { mentorFeedback: feedback.trim() });
        toast.success('Task approved successfully!');
      } else {
        rejectTask(task.id, { mentorFeedback: feedback.trim() });
        toast.success('Feedback submitted to mentee.');
      }
      if (onReviewed) onReviewed();
      if (onClose) onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to review task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-panel border border-border rounded-2xl p-5 space-y-4">
      {/* Panel Header */}
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <h4 className="font-bold text-white text-sm">Review Submission</h4>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Submission Info */}
      <div className="space-y-3 bg-surface border border-border/30 p-3.5 rounded-xl text-xs">
        <div>
          <span className="text-text-dim block mb-0.5">Task Name:</span>
          <span className="text-white font-medium">{task.title}</span>
        </div>
        {task.menteeNotes && (
          <div>
            <span className="text-text-dim block mb-0.5">Mentee Notes:</span>
            <p className="text-gray-300 leading-relaxed break-words whitespace-pre-wrap">{task.menteeNotes}</p>
          </div>
        )}
        {task.proofLink && (
          <div>
            <span className="text-text-dim block mb-1">Proof Link / Work Deliverable:</span>
            <a
              href={task.proofLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light hover:text-white font-medium inline-flex items-center gap-1 transition-all underline shrink-0"
            >
              View Deliverable <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Review Actions */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Approve vs Needs Improvement */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus('Approve')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-xs transition-all ${
              status === 'Approve'
                ? 'bg-green-500/10 border-green-500/50 text-green-400'
                : 'bg-transparent border-border text-text-muted hover:text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
          <button
            type="button"
            onClick={() => setStatus('NeedsImprovement')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-xs transition-all ${
              status === 'NeedsImprovement'
                ? 'bg-red-500/10 border-red-500/50 text-red-400'
                : 'bg-transparent border-border text-text-muted hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" /> Needs Work
          </button>
        </div>

        {/* Feedback text field */}
        <div>
          <label className="block text-xs font-medium text-text-muted mb-1.5">
            Review Feedback {status === 'NeedsImprovement' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            placeholder={status === 'Approve' ? 'Great job! (optional feedback)' : 'Explain what needs improvement...'}
            rows={3}
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-xs focus:outline-none transition-colors"
          />
          {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs h-9"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant={status === 'Approve' ? 'success' : 'primary'}
            size="sm"
            className="w-full text-xs h-9"
            type="submit"
            isLoading={isSubmitting}
          >
            Submit Review
          </Button>
        </div>
      </form>
    </div>
  );
}
