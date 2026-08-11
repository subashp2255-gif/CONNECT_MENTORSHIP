import { Link } from 'react-router-dom';
import { Bookmark, MessageSquare, Eye, CheckCircle2, Pin, Lock, ArrowUp } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { formatDistanceToNow, parseISO } from 'date-fns';

export default function ForumPostCard({ post }) {
  const { 
    currentUser, 
    users, 
    forumAnswers, 
    forumVotes, 
    forumCategories, 
    savedPosts, 
    saveForumPost, 
    unsaveForumPost,
    isLoggedIn
  } = useStore();

  const author = users.find(u => u.id === post.authorId) || {
    name: 'Deleted User',
    role: 'mentee',
    avatar: 'https://ui-avatars.com/api/?name=Deleted+User&background=333&color=fff'
  };

  const category = forumCategories.find(c => c.id === post.categoryId) || {
    name: 'Uncategorized'
  };

  // Calculate vote score
  const postVotes = forumVotes.filter(v => v.postId === post.id);
  const upvotes = postVotes.filter(v => v.voteType === 'UPVOTE').length;
  const downvotes = postVotes.filter(v => v.voteType === 'DOWNVOTE').length;
  const score = upvotes - downvotes;

  // Calculate answer count
  const answersCount = forumAnswers.filter(a => a.postId === post.id && !a.deletedAt).length;

  // Saved status
  const isSaved = currentUser 
    ? savedPosts.some(s => s.userId === currentUser.id && s.postId === post.id) 
    : false;

  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error('You must be logged in to save posts! 🔒');
      return;
    }
    if (isSaved) {
      unsaveForumPost(post.id);
      toast.success('Post removed from saved list.');
    } else {
      saveForumPost(post.id);
      toast.success('Post saved successfully! 💾');
    }
  };

  // Format post time
  let postedTime = 'some time ago';
  try {
    const date = typeof post.createdAt === 'string' ? parseISO(post.createdAt) : new Date(post.createdAt);
    postedTime = formatDistanceToNow(date, { addSuffix: true });
  } catch (err) {
    // Fallback
  }

  // Helper to resolve reputation badge
  const getReputationLabel = (points = 0) => {
    if (points >= 1000) return 'Community Expert';
    if (points >= 500) return 'Knowledge Sharer';
    if (points >= 100) return 'Contributor';
    return 'Beginner';
  };

  return (
    <Link 
      to={`/forum/post/${post.id}`} 
      className={cn(
        "block relative bg-surface border border-border rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 overflow-hidden group",
        post.isPinned && "border-primary/30 bg-gradient-to-r from-primary/5 to-surface"
      )}
    >
      {/* Pinned Indicator line */}
      {post.isPinned && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
      )}

      {/* Top Metadata row */}
      <div className="flex items-start justify-between gap-4 mb-3.5">
        
        {/* Author details */}
        <div className="flex items-center gap-3">
          <img 
            src={author.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`} 
            alt={author.name} 
            className="w-10 h-10 rounded-full border border-border object-cover" 
          />
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-bold text-white text-sm group-hover:text-primary-light transition-colors">
                {author.name}
              </span>
              
              {/* Role badge */}
              <span className={cn(
                "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border tracking-wide",
                author.role === 'mentor' && "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
                author.role === 'admin' && "border-red-500/30 bg-red-500/10 text-red-400",
                author.role === 'mentee' && "border-primary/30 bg-primary/10 text-primary-light"
              )}>
                {author.role}
              </span>

              {/* Mentor badge with reputation */}
              {author.role === 'mentor' && (
                <span className="text-[10px] font-medium text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30 flex items-center gap-1">
                  ⭐ {author.reputation || 0} pts ({getReputationLabel(author.reputation)})
                </span>
              )}
            </div>
            
            <p className="text-xs text-text-muted mt-0.5">
              {postedTime} in <span className="text-secondary font-medium">{category.name}</span>
            </p>
          </div>
        </div>

        {/* Action icons (Pin, Lock, Save) */}
        <div className="flex items-center gap-2">
          {post.isPinned && (
            <span className="p-1.5 bg-primary/15 border border-primary/20 text-primary-light rounded-lg" title="Pinned">
              <Pin className="w-4 h-4" />
            </span>
          )}
          {post.isLocked && (
            <span className="p-1.5 bg-white/5 border border-white/10 text-text-muted rounded-lg" title="Locked">
              <Lock className="w-4 h-4" />
            </span>
          )}
          <button
            onClick={handleSaveToggle}
            className={cn(
              "p-2 rounded-xl transition-all border",
              isSaved 
                ? "bg-secondary/20 text-secondary border-secondary/40 shadow-sm" 
                : "bg-panel/40 border-border text-text-muted hover:text-white hover:bg-white/5"
            )}
            title={isSaved ? "Unsave Post" : "Save Post"}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Main post details */}
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-2 group-hover:text-primary-light transition-colors flex items-center gap-2">
          {post.title}
          {post.isSolved && (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" title="Solved / Accepted Answer" />
          )}
        </h3>
        
        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
          {post.description}
        </p>
      </div>

      {/* Tags & Stats footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-border/60">
        
        {/* Tags list */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags && post.tags.map((tag) => (
            <span 
              key={tag}
              className="text-xs bg-panel border border-border text-text-muted px-2.5 py-1 rounded-xl transition-colors hover:border-white/15"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats metrics */}
        <div className="flex items-center gap-4 text-xs font-semibold text-text-muted self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-panel rounded-lg border border-border">
            <ArrowUp className="w-3.5 h-3.5 text-primary-light" />
            <span>{score} votes</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-panel rounded-lg border border-border">
            <MessageSquare className="w-3.5 h-3.5 text-secondary" />
            <span>{answersCount} answers</span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-1 bg-panel rounded-lg border border-border">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>{post.viewCount || 0} views</span>
          </div>

          {post.isSolved && (
            <span className="text-xs text-green-400 font-bold bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
              Solved
            </span>
          )}
        </div>

      </div>

    </Link>
  );
}
