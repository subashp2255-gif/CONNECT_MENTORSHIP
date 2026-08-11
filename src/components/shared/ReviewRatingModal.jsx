import { useState } from 'react';
import { Star, X } from 'lucide-react';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';

export default function ReviewRatingModal({ isOpen, onClose, session }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const { updateSessionRating, addReview, currentUser } = useStore();

  if (!isOpen || !session) return null;

  const submit = () => {
    if (!rating) return;
    updateSessionRating(session.id, rating, feedback);
    addReview({
      id: `r-${Date.now()}`,
      mentorId: session.mentorId,
      menteeId: session.menteeId,
      reviewerName: currentUser.name,
      reviewerAvatar: currentUser.avatar,
      rating,
      comment: feedback,
      tags: [],
      createdAt: new Date().toISOString()
    });
    onClose();
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="fixed inset-0 z-[70] bg-background/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Rate your session</h3>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-5 flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)}>
              <Star className={`w-7 h-7 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-text-dim'}`} />
            </button>
          ))}
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={4}
          className="w-full mt-4 bg-panel border border-border rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Share what went well and what could be better..."
        />
        <Button className="w-full mt-4" disabled={!rating} onClick={submit}>
          Submit Feedback
        </Button>
      </div>
    </div>
  );
}
