import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bookmark, Bell, BellOff, Share2, AlertTriangle, Edit2, Trash2, 
  CheckCircle2, MessageSquare, Send, Calendar, Clock, Lock, Pin 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import VoteControls from '../../components/forum/VoteControls';
import MarkdownEditor from '../../components/forum/MarkdownEditor';
import ReportDialog from '../../components/forum/ReportDialog';
import DeleteConfirmationDialog from '../../components/forum/DeleteConfirmationDialog';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { cn } from '../../utils/helpers';

export default function PostDetailsPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    currentUser,
    role,
    users,
    forumPosts,
    forumAnswers,
    forumComments,
    forumCategories,
    followedDiscussions,
    savedPosts,
    incrementForumPostViews,
    updateForumPost,
    deleteForumPost,
    lockForumPost,
    unlockForumPost,
    pinForumPost,
    unpinForumPost,
    addForumAnswer,
    updateForumAnswer,
    deleteForumAnswer,
    acceptForumAnswer,
    addForumComment,
    updateForumComment,
    deleteForumComment,
    followForumPost,
    unfollowForumPost,
    saveForumPost,
    unsaveForumPost
  } = useStore();

  // Load post details
  const post = useMemo(() => {
    return forumPosts.find(p => p.id === postId && !p.deletedAt);
  }, [forumPosts, postId]);

  // View count increment
  useEffect(() => {
    if (postId) {
      incrementForumPostViews(postId);
    }
  }, [postId, incrementForumPostViews]);

  // Component states
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  const [newAnswer, setNewAnswer] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editingAnswerContent, setEditingAnswerContent] = useState('');

  const [newCommentText, setNewCommentText] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // Dialog triggers
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState({ type: 'post', id: '' });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: 'post', id: '' });

  // Safety checks
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <HelpCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Discussion Not Found</h2>
        <p className="text-text-muted mb-6">This discussion post has been deleted or does not exist.</p>
        <Link to="/forum"><Button variant="primary">Return to Forum</Button></Link>
      </div>
    );
  }

  // Get author and category
  const postAuthor = users.find(u => u.id === post.authorId) || {
    name: 'Deleted User', role: 'mentee', avatar: 'https://ui-avatars.com/api/?name=Deleted+User'
  };
  const category = forumCategories.find(c => c.id === post.categoryId) || { name: 'General' };

  // Calculate follow and save indicators
  const isFollowing = currentUser 
    ? followedDiscussions.some(f => f.userId === currentUser.id && f.postId === post.id) 
    : false;
  
  const isSaved = currentUser 
    ? savedPosts.some(s => s.userId === currentUser.id && s.postId === post.id) 
    : false;

  // Comments for the question post
  const questionComments = forumComments.filter(c => c.postId === post.id && !c.deletedAt);

  // Answers list (Accepted floats to the top, deleted are filtered out)
  const answers = forumAnswers
    .filter(a => a.postId === post.id && !a.deletedAt)
    .sort((a, b) => {
      if (a.isAccepted && !b.isAccepted) return -1;
      if (!a.isAccepted && b.isAccepted) return 1;
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

  // Calculate related discussions
  const relatedDiscussions = forumPosts
    .filter(p => p.categoryId === post.categoryId && p.id !== post.id && !p.deletedAt)
    .slice(0, 3);

  // Handlers for Save & Follow
  const handleSaveToggle = () => {
    if (!isLoggedIn) return toast.error('You must log in to save posts! 🔒');
    if (isSaved) {
      unsaveForumPost(post.id);
      toast.success('Discussions removed from saved list.');
    } else {
      saveForumPost(post.id);
      toast.success('Discussions saved successfully! 💾');
    }
  };

  const handleFollowToggle = () => {
    if (!isLoggedIn) return toast.error('You must log in to follow discussions! 🔒');
    if (isFollowing) {
      unfollowForumPost(post.id);
      toast.success('Unfollowed discussion.');
    } else {
      followForumPost(post.id);
      toast.success('Following discussion! You will get notifications for new answers. 🔔');
    }
  };

  // Handlers for Post Edit & Delete
  const handleStartEditPost = () => {
    setEditedTitle(post.title);
    setEditedDesc(post.description);
    setIsEditingPost(true);
  };

  const handleSavePostEdit = async () => {
    if (editedTitle.trim().length < 10 || editedDesc.trim().length < 20) {
      toast.error('Title must be at least 10 chars, Description at least 20 chars.');
      return;
    }
    try {
      await updateForumPost(post.id, { title: editedTitle.trim(), description: editedDesc.trim() });
      toast.success('Discussions edited successfully!');
      setIsEditingPost(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePostConfirm = async () => {
    try {
      await deleteForumPost(post.id);
      toast.success('Question deleted successfully.');
      navigate('/forum');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for Admin Locks & Pins
  const handleLockToggle = () => {
    try {
      if (post.isLocked) {
        unlockForumPost(post.id);
        toast.success('Discussion unlocked.');
      } else {
        lockForumPost(post.id, 'Locked by moderator request');
        toast.success('Discussion locked. Users cannot answer or comment.');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePinToggle = () => {
    try {
      if (post.isPinned) {
        unpinForumPost(post.id);
        toast.success('Discussion unpinned.');
      } else {
        pinForumPost(post.id);
        toast.success('Discussion pinned to top.');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for Answers
  const handleAddAnswer = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error('Please log in to submit an answer! 🔒');
    if (!newAnswer.trim() || newAnswer.trim().length < 10) {
      toast.error('Your answer must contain at least 10 characters.');
      return;
    }
    try {
      await addForumAnswer(post.id, { content: newAnswer.trim() });
      toast.success('Answer published successfully! 🚀');
      setNewAnswer('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSaveAnswerEdit = async (answerId) => {
    if (editingAnswerContent.trim().length < 10) {
      toast.error('Answer must contain at least 10 characters.');
      return;
    }
    try {
      await updateForumAnswer(answerId, editingAnswerContent.trim());
      toast.success('Answer edited successfully!');
      setEditingAnswerId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAnswer = (answerId) => {
    setDeleteTarget({ type: 'answer', id: answerId });
    setIsDeleteOpen(true);
  };

  const handleAcceptAnswer = (answerId) => {
    try {
      acceptForumAnswer(post.id, answerId);
      const isAccepted = post.acceptedAnswerId === answerId;
      toast.success(isAccepted ? 'Answer status updated.' : 'Accepted helpful answer! Mentor awarded 15 reputation points. 🏆');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for Comments
  const handleAddComment = async (postIdOrAnswerId, isPost = true) => {
    const text = newCommentText[postIdOrAnswerId] || '';
    if (!isLoggedIn) return toast.error('Please log in to comment! 🔒');
    if (!text.trim() || text.trim().length < 2) {
      toast.error('Comment must contain at least 2 characters.');
      return;
    }
    try {
      await addForumComment({
        postId: isPost ? postIdOrAnswerId : null,
        answerId: !isPost ? postIdOrAnswerId : null,
        content: text.trim()
      });
      toast.success('Comment added!');
      setNewCommentText(prev => ({ ...prev, [postIdOrAnswerId]: '' }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSaveCommentEdit = async (commentId) => {
    if (editingCommentContent.trim().length < 2) {
      toast.error('Comment must be at least 2 characters.');
      return;
    }
    try {
      await updateForumComment(commentId, editingCommentContent.trim());
      toast.success('Comment updated!');
      setEditingCommentId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteComment = (commentId) => {
    try {
      deleteForumComment(commentId);
      toast.success('Comment deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Share link trigger
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard! 🔗');
  };

  // Trigger Report Dialog
  const triggerReport = (type, id) => {
    if (!isLoggedIn) return toast.error('Please log in to report content! 🔒');
    setReportTarget({ type, id });
    setIsReportOpen(true);
  };

  // Trigger Delete Confirm Dialog
  const triggerDeleteConfirm = (type, id) => {
    setDeleteTarget({ type, id });
    setIsDeleteOpen(true);
  };

  const confirmGlobalDelete = () => {
    if (deleteTarget.type === 'post') {
      handleDeletePostConfirm();
    } else if (deleteTarget.type === 'answer') {
      deleteForumAnswer(deleteTarget.id);
      toast.success('Answer deleted successfully.');
    }
  };

  // Helpers
  const formatTime = (timeStr) => {
    try {
      return formatDistanceToNow(parseISO(timeStr), { addSuffix: true });
    } catch (err) {
      return 'just now';
    }
  };

  const getRepLabel = (points = 0) => {
    if (points >= 1000) return 'Community Expert';
    if (points >= 500) return 'Knowledge Sharer';
    if (points >= 100) return 'Contributor';
    return 'Beginner';
  };

  // Rendering a simplified markdown content in post details
  const renderMarkdown = (text = '') => {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-white mt-3 mb-2">$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-white mt-2 mb-1">$1</h3>');

    html = html.replace(/```(?:[a-zA-Z]*)\n([\s\S]*?)\n```/g, '<pre class="bg-panel border border-border rounded-xl p-4 my-3 font-mono text-xs sm:text-sm overflow-x-auto text-primary-light">$1</pre>');
    html = html.replace(/`([^`]+)`/g, '<code class="bg-panel px-1.5 py-0.5 rounded font-mono text-xs text-secondary">$1</code>');

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-4 border-primary bg-primary/5 px-4 py-2 rounded-r-xl my-2 italic text-gray-300">$1</blockquote>');
    html = html.replace(/^\- (.*?)$/gm, '<li class="list-disc ml-6 my-1 text-gray-200">$1</li>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-light hover:underline">$1</a>');

    html = html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<pre') || line.trim().startsWith('</pre') || line.trim().startsWith('<li') || line.trim().startsWith('<blockquote')) {
        return line;
      }
      return line ? `<p class="mb-2 text-gray-300 leading-relaxed">${line}</p>` : '';
    }).join('\n');

    return html;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col relative z-10">
      
      {/* Header breadcrumb back link */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <Link 
          to="/forum" 
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forum
        </Link>
        <span className="text-xs text-text-dim">
          Discussion ID: {post.id}
        </span>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Left main area (3/4 width) */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Main Question Card */}
          <article className="bg-surface border border-border rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl relative">
            
            {/* Pinned banner inside details */}
            {post.isPinned && (
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-secondary" />
            )}

            {/* Editing state */}
            {isEditingPost ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full bg-panel border border-border rounded-xl px-4 py-2.5 text-base sm:text-lg text-white font-bold focus:outline-none focus:border-primary/50"
                />
                <MarkdownEditor
                  value={editedDesc}
                  onChange={setEditedDesc}
                  placeholder="Edit your detailed question..."
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setIsEditingPost(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-text-muted hover:text-white hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <Button variant="primary" size="sm" onClick={handleSavePostEdit}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Meta details & Author info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                  <div className="flex items-center gap-3">
                    <img 
                      src={postAuthor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(postAuthor.name)}`} 
                      alt="" 
                      className="w-12 h-12 rounded-full border border-border object-cover" 
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-extrabold text-white text-base">{postAuthor.name}</h4>
                        <span className={cn(
                          "text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border tracking-wide",
                          postAuthor.role === 'mentor' && "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
                          postAuthor.role === 'admin' && "border-red-500/30 bg-red-500/10 text-red-400",
                          postAuthor.role === 'mentee' && "border-primary/30 bg-primary/10 text-primary-light"
                        )}>
                          {postAuthor.role}
                        </span>

                        {postAuthor.role === 'mentor' && (
                          <span className="text-[10px] font-medium text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                            ⭐ {postAuthor.reputation || 0} ({getRepLabel(postAuthor.reputation)})
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Published {formatTime(post.createdAt)} in <span className="text-secondary font-semibold">{category.name}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1.5 sm:self-auto self-end">
                    <button 
                      onClick={handleSaveToggle}
                      className={cn(
                        "p-2 rounded-xl transition-all border",
                        isSaved 
                          ? "bg-secondary/20 text-secondary border-secondary/40" 
                          : "bg-panel/60 border-border text-text-muted hover:text-white hover:bg-white/5"
                      )}
                      title={isSaved ? "Unsave question" : "Save question"}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={handleFollowToggle}
                      className={cn(
                        "p-2 rounded-xl transition-all border",
                        isFollowing 
                          ? "bg-primary/25 text-primary-light border-primary/30" 
                          : "bg-panel/60 border-border text-text-muted hover:text-white hover:bg-white/5"
                      )}
                      title={isFollowing ? "Unfollow discussion" : "Follow discussion"}
                    >
                      {isFollowing ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                    </button>

                    <button 
                      onClick={handleShare}
                      className="p-2 rounded-xl border border-border bg-panel/60 text-text-muted hover:text-white hover:bg-white/5 transition-all"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {isLoggedIn && (currentUser.id === post.authorId || role === 'admin') && (
                      <>
                        <button 
                          onClick={handleStartEditPost}
                          className="p-2 rounded-xl border border-border bg-panel/60 text-text-muted hover:text-white hover:bg-white/5 transition-all"
                          title="Edit question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => triggerDeleteConfirm('post', post.id)}
                          className="p-2 rounded-xl border border-border bg-panel/60 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    <button 
                      onClick={() => triggerReport('post', post.id)}
                      className="p-2 rounded-xl border border-border bg-panel/60 text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Report inappropriate content"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Details Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.isPinned && <span className="bg-primary/20 text-primary-light border border-primary/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</span>}
                    {post.isLocked && <span className="bg-white/5 border border-white/10 text-text-muted px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
                    {post.isSolved && <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Solved</span>}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {post.title}
                  </h2>

                  <div 
                    className="prose prose-invert max-w-none text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(post.description) }}
                  />

                  {/* Tags footer */}
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {post.tags && post.tags.map((tag) => (
                      <Link 
                        key={tag}
                        to={`/forum/tag/${tag}`}
                        className="text-xs bg-panel border border-border text-text-muted px-3 py-1 rounded-xl transition-all hover:border-primary/40 hover:text-white"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Score and views row */}
                <div className="flex items-center justify-between border-t border-border/40 pt-4 bg-panel/30 p-3 rounded-2xl">
                  <VoteControls targetId={post.id} type="post" direction="horizontal" />
                  <div className="text-xs text-text-muted font-semibold flex items-center gap-3">
                    <span>{post.viewCount || 0} views</span>
                    <span>•</span>
                    <span>{answers.length} answers</span>
                  </div>
                </div>
              </>
            )}

            {/* Question Comments Panel */}
            <div className="border-t border-border pt-4 space-y-4">
              <h4 className="text-xs font-extrabold text-text-muted uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Discussion Comments ({questionComments.length})
              </h4>

              {/* Comments list */}
              {questionComments.length > 0 && (
                <div className="space-y-3 bg-panel/40 p-4 rounded-2xl border border-border/60">
                  {questionComments.map(comment => {
                    const cAuthor = users.find(u => u.id === comment.authorId) || { name: 'Deleted User', avatar: 'https://ui-avatars.com/api/?name=Deleted+User' };
                    const isCAuthor = currentUser?.id === comment.authorId;

                    return (
                      <div key={comment.id} className="text-xs flex items-start gap-3 border-b border-border/40 pb-2.5 last:border-b-0 last:pb-0 group">
                        <img src={cAuthor.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5 border border-border" />
                        <div className="flex-1 min-w-0">
                          {editingCommentId === comment.id ? (
                            <div className="space-y-2 mt-1">
                              <input
                                value={editingCommentContent}
                                onChange={(e) => setEditingCommentContent(e.target.value)}
                                className="w-full bg-surface border border-border text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button 
                                  onClick={() => setEditingCommentId(null)}
                                  className="text-[10px] text-text-muted hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleSaveCommentEdit(comment.id)}
                                  className="text-[10px] text-primary-light font-bold"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-white hover:text-primary-light cursor-pointer">{cAuthor.name}</span>
                                {cAuthor.role === 'mentor' && <span className="text-[9px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1 rounded">Mentor</span>}
                                <span className="text-text-dim text-[10px] font-medium">{formatTime(comment.createdAt)}</span>
                              </div>
                              <p className="text-gray-300 mt-1 leading-relaxed">{comment.content}</p>
                            </>
                          )}
                        </div>

                        {/* Comment Actions */}
                        {editingCommentId !== comment.id && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isLoggedIn && (isCAuthor || role === 'admin') && (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCommentId(comment.id);
                                    setEditingCommentContent(comment.content);
                                  }}
                                  className="p-1 hover:text-white text-text-muted transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-1 hover:text-red-400 text-text-muted transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => triggerReport('comment', comment.id)}
                              className="p-1 hover:text-red-400 text-text-muted transition-colors"
                              title="Report"
                            >
                              <AlertTriangle className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Comment input */}
              {isLoggedIn ? (
                !post.isLocked ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCommentText[post.id] || ''}
                      onChange={(e) => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id, true);
                      }}
                      placeholder="Add a comment to this discussion..."
                      className="flex-1 bg-panel border border-border text-xs rounded-xl px-4 py-2.5 text-white placeholder-text-dim focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      onClick={() => handleAddComment(post.id, true)}
                      className="p-2.5 rounded-xl bg-primary hover:bg-primary-light text-white transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-text-dim italic">This discussion is locked. New comments are blocked.</p>
                )
              ) : (
                <p className="text-xs text-text-muted">Please <Link to="/login" className="text-primary-light hover:underline font-bold">log in</Link> to add comments.</p>
              )}
            </div>

          </article>

          {/* Answers stream */}
          <section className="space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
              Answers ({answers.length})
            </h3>

            {answers.length > 0 ? (
              <div className="space-y-6">
                {answers.map(ans => {
                  const ansAuthor = users.find(u => u.id === ans.authorId) || { name: 'Deleted User', role: 'mentee', avatar: 'https://ui-avatars.com/api/?name=Deleted+User' };
                  const isAnsAuthor = currentUser?.id === ans.authorId;
                  const isPostAuthor = currentUser?.id === post.authorId;
                  const ansComments = forumComments.filter(c => c.answerId === ans.id && !c.deletedAt);

                  return (
                    <div 
                      key={ans.id} 
                      className={cn(
                        "bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl transition-all relative overflow-hidden",
                        ans.isAccepted && "border-green-500/50 bg-gradient-to-r from-green-500/5 to-surface"
                      )}
                    >
                      {/* Accepted Ribbon flag */}
                      {ans.isAccepted && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                        </div>
                      )}

                      {editingAnswerId === ans.id ? (
                        <div className="space-y-4">
                          <MarkdownEditor
                            value={editingAnswerContent}
                            onChange={setEditingAnswerContent}
                            placeholder="Edit your answer details..."
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => setEditingAnswerId(null)}
                              className="px-4 py-2 rounded-xl text-xs font-bold border border-border text-text-muted hover:text-white"
                            >
                              Cancel
                            </button>
                            <Button variant="primary" size="sm" onClick={() => handleSaveAnswerEdit(ans.id)}>
                              Save Answer
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Answer Author Meta details */}
                          <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-3">
                            <div className="flex items-center gap-3">
                              <img src={ansAuthor.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-border" />
                              <div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="font-bold text-white text-sm">{ansAuthor.name}</span>
                                  <span className={cn(
                                    "text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border tracking-wide",
                                    ansAuthor.role === 'mentor' && "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
                                    ansAuthor.role === 'admin' && "border-red-500/30 bg-red-500/10 text-red-400",
                                    ansAuthor.role === 'mentee' && "border-primary/30 bg-primary/10 text-primary-light"
                                  )}>
                                    {ansAuthor.role}
                                  </span>

                                  {ansAuthor.role === 'mentor' && (
                                    <span className="text-[10px] font-medium text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                                      ⭐ {ansAuthor.reputation || 0} pts
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-text-muted mt-0.5">
                                  Answered {formatTime(ans.createdAt)}
                                </p>
                              </div>
                            </div>

                            {/* Answer actions (Edit, delete, report) */}
                            <div className="flex items-center gap-1 px-4 py-2">
                              {/* Answer acceptance trigger (Question owner or Admin only) */}
                              {isLoggedIn && (isPostAuthor || role === 'admin') && (
                                <button
                                  onClick={() => handleAcceptAnswer(ans.id)}
                                  className={cn(
                                    "p-1.5 rounded-lg border transition-all flex items-center gap-1 text-[10px] font-bold uppercase",
                                    ans.isAccepted
                                      ? "bg-green-500/20 text-green-400 border-green-500/40"
                                      : "bg-panel/40 border-border text-text-muted hover:text-green-400 hover:border-green-500/30"
                                  )}
                                  title={ans.isAccepted ? "Remove Accepted Mark" : "Mark as Accepted Answer"}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                                </button>
                              )}

                              {isLoggedIn && (isAnsAuthor || role === 'admin') && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingAnswerId(ans.id);
                                      setEditingAnswerContent(ans.content);
                                    }}
                                    className="p-1.5 rounded-lg border border-border bg-panel/60 text-text-muted hover:text-white"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAnswer(ans.id)}
                                    className="p-1.5 rounded-lg border border-border bg-panel/60 text-text-muted hover:text-red-400"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => triggerReport('answer', ans.id)}
                                className="p-1.5 rounded-lg border border-border bg-panel/60 text-text-muted hover:text-red-400"
                                title="Report"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Answer text details */}
                          <div 
                            className="prose prose-invert text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(ans.content) }}
                          />

                          {/* Upvotes bar for answer */}
                          <div className="pt-2">
                            <VoteControls targetId={ans.id} type="answer" direction="horizontal" />
                          </div>
                        </>
                      )}

                      {/* Comments under answers */}
                      <div className="border-t border-border/40 pt-4 space-y-3">
                        <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> Comments ({ansComments.length})
                        </h5>

                        {/* List */}
                        {ansComments.length > 0 && (
                          <div className="space-y-3 bg-panel/20 p-3 rounded-2xl border border-border/40">
                            {ansComments.map(comm => {
                              const cAuth = users.find(u => u.id === comm.authorId) || { name: 'Deleted User', avatar: 'https://ui-avatars.com/api/?name=Deleted+User' };
                              const isCAuth = currentUser?.id === comm.authorId;

                              return (
                                <div key={comm.id} className="text-[11px] flex items-start gap-2.5 border-b border-border/20 pb-2 last:border-b-0 last:pb-0 group">
                                  <img src={cAuth.avatar} alt="" className="w-5.5 h-5.5 rounded-full object-cover border border-border shrink-0 mt-0.5" />
                                  <div className="flex-1 min-w-0">
                                    {editingCommentId === comm.id ? (
                                      <div className="space-y-2 mt-1">
                                        <input
                                          value={editingCommentContent}
                                          onChange={(e) => setEditingCommentContent(e.target.value)}
                                          className="w-full bg-surface border border-border text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
                                        />
                                        <div className="flex justify-end gap-1.5">
                                          <button onClick={() => setEditingCommentId(null)} className="text-[10px] text-text-muted hover:text-white">Cancel</button>
                                          <button onClick={() => handleSaveCommentEdit(comm.id)} className="text-[10px] text-primary-light font-bold">Save</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex items-center gap-1.5 flex-wrap font-sans">
                                          <span className="font-bold text-white hover:text-primary-light cursor-pointer">{cAuth.name}</span>
                                          {cAuth.role === 'mentor' && <span className="text-[9px] bg-yellow-500/10 text-yellow-400 px-1 rounded">Mentor</span>}
                                          <span className="text-text-dim text-[9px] font-medium">{formatTime(comm.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-300 mt-0.5 leading-relaxed">{comm.content}</p>
                                      </>
                                    )}
                                  </div>

                                  {editingCommentId !== comm.id && (
                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {isLoggedIn && (isCAuth || role === 'admin') && (
                                        <>
                                          <button
                                            onClick={() => {
                                              setEditingCommentId(comm.id);
                                              setEditingCommentContent(comm.content);
                                            }}
                                            className="p-0.5 hover:text-white text-text-muted transition-colors"
                                          >
                                            <Edit2 className="w-2.5 h-2.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteComment(comm.id)}
                                            className="p-0.5 hover:text-red-400 text-text-muted transition-colors"
                                          >
                                            <Trash2 className="w-2.5 h-2.5" />
                                          </button>
                                        </>
                                      )}
                                      <button
                                        onClick={() => triggerReport('comment', comm.id)}
                                        className="p-0.5 hover:text-red-400 text-text-muted transition-colors"
                                      >
                                        <AlertTriangle className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Form */}
                        {isLoggedIn ? (
                          !post.isLocked ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newCommentText[ans.id] || ''}
                                onChange={(e) => setNewCommentText(prev => ({ ...prev, [ans.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddComment(ans.id, false);
                                }}
                                placeholder="Add a comment to this answer..."
                                className="flex-1 bg-panel/60 border border-border text-[11px] rounded-xl px-3 py-2 text-white placeholder-text-dim focus:outline-none focus:border-primary/50 transition-colors"
                              />
                              <button
                                onClick={() => handleAddComment(ans.id, false)}
                                className="p-2 rounded-xl bg-primary hover:bg-primary-light text-white transition-colors"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <p className="text-[10px] text-text-dim italic">Locked discussion.</p>
                          )
                        ) : (
                          <p className="text-[10px] text-text-muted">Log in to comment.</p>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface border border-dashed border-border rounded-2xl p-8 text-center text-text-muted font-semibold">
                No answers yet. Be the first to share your knowledge and help this learner!
              </div>
            )}
          </section>

          {/* Answer formulation Editor card */}
          {isLoggedIn ? (
            !post.isLocked ? (
              <section className="bg-surface border border-border rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
                <h3 className="text-base sm:text-lg font-black text-white">Your Answer</h3>
                <form onSubmit={handleAddAnswer} className="space-y-4">
                  <MarkdownEditor
                    value={newAnswer}
                    onChange={setNewAnswer}
                    placeholder="Provide your helpful answer. You can use markdown code snippets, lists, bold text, etc..."
                    minLength={10}
                  />
                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      Publish Answer
                    </Button>
                  </div>
                </form>
              </section>
            ) : (
              <div className="bg-panel border border-border rounded-2xl p-4 text-center text-text-muted italic">
                This discussion has been locked by an administrator. No new answers are allowed.
              </div>
            )
          ) : (
            <div className="bg-panel border border-border rounded-2xl p-6 text-center text-text-muted">
              You must be <Link to="/login" className="text-primary-light hover:underline font-bold">logged in</Link> to provide answers.
            </div>
          )}

        </main>

        {/* Right sidebar (1/4 width) */}
        <aside className="space-y-6">
          
          {/* Related discussions list */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white">Related Discussions</h3>
            {relatedDiscussions.length > 0 ? (
              <div className="space-y-3.5">
                {relatedDiscussions.map(rel => {
                  const relAnswerCount = forumAnswers.filter(a => a.postId === rel.id && !a.deletedAt).length;
                  return (
                    <Link 
                      key={rel.id} 
                      to={`/forum/post/${rel.id}`} 
                      className="block hover:bg-white/5 p-2 rounded-xl transition-all border border-transparent hover:border-border"
                    >
                      <h4 className="text-xs font-bold text-gray-200 line-clamp-2 leading-relaxed hover:text-primary-light">
                        {rel.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-text-muted mt-1.5">
                        <span>{rel.viewCount || 0} views</span>
                        <span>•</span>
                        <span>{relAnswerCount} answers</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-text-dim italic leading-relaxed">
                No related discussions found in {category.name} yet.
              </p>
            )}
          </div>

          {/* Quick forum guidelines */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-extrabold text-white">Voting Guidelines</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Upvote helpful answers to award reputation points to mentors:
            </p>
            <ul className="text-xs text-text-muted space-y-2 list-disc ml-4 font-medium">
              <li>Post upvoted: <span className="text-primary-light">+2 points</span></li>
              <li>Answer upvoted: <span className="text-primary-light">+5 points</span></li>
              <li>Answer accepted: <span className="text-green-400 font-bold">+15 points</span></li>
              <li>Post downvoted: <span className="text-red-400">-1 point</span></li>
              <li>Answer downvoted: <span className="text-red-400">-2 points</span></li>
            </ul>
          </div>

        </aside>

      </div>

      {/* Floating Dialog Dialogs */}
      <ReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        contentType={reportTarget.type}
        contentId={reportTarget.id}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={confirmGlobalDelete}
        title={`Delete ${deleteTarget.type}`}
        description={`Are you sure you want to delete this ${deleteTarget.type}? This action will hide the content from the discussion view.`}
      />

    </div>
  );
}
