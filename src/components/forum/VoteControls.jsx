import { useStore } from '../../store/useStore';
import { ChevronUp, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../../utils/helpers';

export default function VoteControls({ targetId, type = 'post', direction = 'vertical' }) {
  const { isLoggedIn, currentUser, forumVotes, voteForumContent, forumPosts, forumAnswers } = useStore();

  // Find votes matching this target
  const votes = forumVotes.filter(v => 
    type === 'post' ? v.postId === targetId : v.answerId === targetId
  );
  
  const upvotes = votes.filter(v => v.voteType === 'UPVOTE').length;
  const downvotes = votes.filter(v => v.voteType === 'DOWNVOTE').length;
  const score = upvotes - downvotes;

  // Determine user's active vote
  const myVote = currentUser 
    ? votes.find(v => v.userId === currentUser.id)?.voteType 
    : null;

  // Check if content belongs to user (self-voting is prohibited)
  let isOwnContent = false;
  if (currentUser) {
    if (type === 'post') {
      const post = forumPosts.find(p => p.id === targetId);
      isOwnContent = post?.authorId === currentUser.id;
    } else {
      const answer = forumAnswers.find(a => a.id === targetId);
      isOwnContent = answer?.authorId === currentUser.id;
    }
  }

  const handleVote = (voteType) => {
    if (!isLoggedIn) {
      toast.error('You must be logged in to vote! 🔒');
      return;
    }
    if (isOwnContent) {
      toast.error('You cannot vote on your own content! 🚫');
      return;
    }
    try {
      voteForumContent(type, targetId, voteType);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isVertical = direction === 'vertical';

  return (
    <div className={cn(
      "flex items-center gap-1.5 bg-panel/60 border border-border rounded-xl p-1.5 w-fit shrink-0 select-none",
      isVertical ? "flex-col min-w-[44px] justify-center" : "flex-row px-2.5 py-1"
    )}>
      {/* Upvote Button */}
      <button
        onClick={() => handleVote('UPVOTE')}
        disabled={isOwnContent}
        className={cn(
          "p-1 rounded-lg transition-all focus:outline-none",
          myVote === 'UPVOTE' 
            ? "bg-primary/20 text-primary-light border border-primary/30" 
            : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent",
          isOwnContent && "opacity-40 cursor-not-allowed"
        )}
        title={isOwnContent ? "You cannot vote on your own content" : "Upvote"}
      >
        <ChevronUp className={cn("w-5 h-5 transition-transform active:scale-125")} />
      </button>

      {/* Vote Count */}
      <span className={cn(
        "font-bold font-mono text-sm",
        score > 0 ? "text-primary-light" : score < 0 ? "text-red-400" : "text-white"
      )}>
        {score}
      </span>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote('DOWNVOTE')}
        disabled={isOwnContent}
        className={cn(
          "p-1 rounded-lg transition-all focus:outline-none",
          myVote === 'DOWNVOTE' 
            ? "bg-red-500/10 text-red-400 border border-red-500/20" 
            : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent",
          isOwnContent && "opacity-40 cursor-not-allowed"
        )}
        title={isOwnContent ? "You cannot vote on your own content" : "Downvote"}
      >
        <ChevronDown className={cn("w-5 h-5 transition-transform active:scale-125")} />
      </button>
    </div>
  );
}
