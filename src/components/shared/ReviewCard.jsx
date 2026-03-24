import { format, parseISO } from 'date-fns';
import { Star } from 'lucide-react';
import SkillChip from './SkillChip';

export default function ReviewCard({ review }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 md:p-6 transition-all hover:border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img 
            src={review.reviewerAvatar} 
            alt={review.reviewerName}
            className="w-10 h-10 rounded-full border border-white/10"
            loading="lazy"
          />
          <div>
            <div className="font-bold text-sm text-gray-200">{review.reviewerName}</div>
            <div className="text-xs text-text-muted">
              {format(parseISO(review.createdAt), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
        <div className="flex bg-yellow-500/10 px-2 py-1 rounded text-yellow-500 text-xs font-bold items-center border border-yellow-500/20">
          <Star className="w-3 h-3 fill-yellow-500 mr-1" />
          {review.rating.toFixed(1)}
        </div>
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        "{review.comment}"
      </p>
      
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.tags.map(tag => (
            <SkillChip key={tag} skill={tag} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
