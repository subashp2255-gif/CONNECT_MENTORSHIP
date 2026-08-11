import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Plus, Search, ThumbsUp, MessageSquare, Share2, MoreHorizontal, 
  Edit3, Trash2, Globe, Users, CheckCircle2, Image, Bold, Italic, 
  Underline as UnderlineIcon, List, Link2, Code, Smile, Sparkles, X, Send
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../../components/ui/Button';
import LazyImage from '../../components/ui/LazyImage';
import EmptyState from '../../components/shared/EmptyState';
import toast from 'react-hot-toast';
import { cn } from '../../utils/helpers';

// Helper to escape HTML and parse rich text safely
function renderRichText(text) {
  if (!text) return '';
  
  // Escape html characters to prevent XSS
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Bold: **text**
  html = html.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*([\s\S]*?)\*/g, '<em>$1</em>');
  
  // Underline: _text_
  html = html.replace(/_([\s\S]*?)_/g, '<u>$1</u>');
  
  // Code block: ```code```
  html = html.replace(/```([a-zA-Z]*)\n([\s\S]*?)```/g, '<pre class="bg-panel border border-border p-3.5 rounded-xl font-mono text-xs my-2 overflow-x-auto text-primary-light"><code>$2</code></pre>');
  html = html.replace(/`([^`\n]+)`/g, '<code class="bg-panel border border-border px-1.5 py-0.5 rounded font-mono text-xs text-primary-light">$1</code>');
  
  // Bullet List
  html = html.replace(/^\*\s+(.+)$/gm, '<li class="list-disc ml-5 my-1 text-gray-300">$1</li>');
  html = html.replace(/(<li class="list-disc ml-5 my-1 text-gray-300">[\s\S]*?<\/li>)/g, '<ul class="my-2">$1</ul>');
  html = html.replace(/<\/ul>\s*<ul class="my-2">/g, '');

  // Number List
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="list-decimal ml-5 my-1 text-gray-300">$1</li>');
  html = html.replace(/(<li class="list-decimal ml-5 my-1 text-gray-300">[\s\S]*?<\/li>)/g, '<ol class="my-2">$1</ol>');
  html = html.replace(/<\/ol>\s*<ol class="my-2">/g, '');

  // Hyperlinks: [label](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-light hover:underline font-semibold">$1</a>');

  // Convert line breaks to <br />
  html = html.replace(/\n/g, '<br />');

  return html;
}

export default function FeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focusPostId = searchParams.get('postId');

  const {
    isLoggedIn,
    currentUser,
    role,
    socialPosts = [],
    socialLikes = [],
    socialComments = [],
    follows = [],
    users = [],
    createSocialPost,
    updateSocialPost,
    deleteSocialPost,
    likeSocialPost,
    unlikeSocialPost,
    addSocialComment,
    updateSocialComment,
    deleteSocialComment
  } = useStore();

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | Tags

  // Dialog State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Editor Fields
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postVisibility, setPostVisibility] = useState('public');

  const textareaRef = useRef(null);

  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Form validations
  const validateImageUrl = (url) => {
    if (!url) return true;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Synchronize infinite scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        !isLoadingMore &&
        visibleCount < filteredPosts.length
      ) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount(prev => prev + 3);
          setIsLoadingMore(false);
        }, 600);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, visibleCount, socialPosts, searchQuery, activeFilter]);

  // Compute posts listing
  const filteredPosts = useMemo(() => {
    let posts = socialPosts.filter(p => !p.deletedAt);

    // Filter by Visibility Rules
    if (role === 'mentee') {
      const followedIds = follows.filter(f => f.followerId === currentUser?.id).map(f => f.mentorId);
      posts = posts.filter(p => p.visibility === 'public' || p.authorId === currentUser?.id || followedIds.includes(p.authorId));
    }

    // Filter by Specific Post if focused via params (e.g. from notification)
    if (focusPostId) {
      const targetedPost = posts.find(p => p.id === focusPostId);
      if (targetedPost) {
        // Move targeted post to the very front
        const others = posts.filter(p => p.id !== focusPostId);
        posts = [targetedPost, ...others];
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(p => {
        const author = users.find(u => u.id === p.authorId) || {};
        return (
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q)) ||
          (author.name && author.name.toLowerCase().includes(q))
        );
      });
    }

    // Tag filtering
    if (activeFilter !== 'All') {
      posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase()));
    }

    // Sort by newest unless a focused post is pinned
    if (focusPostId) {
      const targetedIndex = posts.findIndex(p => p.id === focusPostId);
      if (targetedIndex !== -1) {
        const targeted = posts[targetedIndex];
        const others = posts.filter(p => p.id !== focusPostId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return [targeted, ...others];
      }
    }

    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [socialPosts, focusPostId, searchQuery, activeFilter, currentUser, role, follows, users]);

  const visiblePosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  // Handlers for Post creation / editing
  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setPostTitle('');
    setPostContent('');
    setPostImage('');
    setPostTags('');
    setPostVisibility('public');
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (post) => {
    setEditingPost(post);
    setPostTitle(post.title);
    setPostContent(post.content);
    setPostImage(post.image || '');
    setPostTags(post.tags.join(', '));
    setPostVisibility(post.visibility || 'public');
    setIsEditorOpen(true);
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || postTitle.trim().length < 5) {
      return toast.error('Title must be at least 5 characters.');
    }
    if (!postContent.trim() || postContent.trim().length < 15) {
      return toast.error('Content must be at least 15 characters.');
    }
    if (postImage && !validateImageUrl(postImage)) {
      return toast.error('Please enter a valid image URL starting with http/https.');
    }

    const tagsArray = postTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    try {
      if (editingPost) {
        await updateSocialPost(editingPost.id, {
          title: postTitle,
          content: postContent,
          image: postImage,
          tags: tagsArray,
          visibility: postVisibility
        });
        toast.success('Post updated successfully! 📝');
      } else {
        await createSocialPost({
          title: postTitle,
          content: postContent,
          image: postImage,
          tags: tagsArray,
          visibility: postVisibility
        });
        toast.success('Post published successfully! 🚀');
      }
      setIsEditorOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeletePostSubmit = (postId) => {
    if (window.confirm('Are you sure you want to delete this post? This action is permanent.')) {
      try {
        deleteSocialPost(postId);
        toast.success('Post deleted successfully.');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // Text formatter helpers
  const insertFormatting = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = '';
    if (type === 'bold') replacement = `**${selected || 'bold text'}**`;
    else if (type === 'italic') replacement = `*${selected || 'italic text'}*`;
    else if (type === 'underline') replacement = `_${selected || 'underlined text'}_`;
    else if (type === 'code') replacement = `\n\`\`\`javascript\n${selected || '// code snippet'}\n\`\`\`\n`;
    else if (type === 'bullet') replacement = `\n* ${selected || 'list item'}`;
    else if (type === 'number') replacement = `\n1. ${selected || 'list item'}`;
    else if (type === 'link') {
      const url = prompt('Enter Hyperlink URL:');
      if (url) replacement = `[${selected || 'link text'}](${url})`;
      else return;
    }
    
    setPostContent(text.substring(0, start) + replacement + text.substring(end));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  // Emojis helper
  const addEmoji = (emoji) => {
    setPostContent(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  // Share post action
  const handleSharePost = (postId) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?postId=${postId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard! 📋');
  };

  // Computed Sidebar stats
  const followersCount = useMemo(() => {
    if (role === 'mentor') return follows.filter(f => f.mentorId === currentUser?.id).length;
    return follows.filter(f => f.followerId === currentUser?.id).length;
  }, [follows, currentUser, role]);

  const totalPostsCount = useMemo(() => {
    if (role === 'mentor') return socialPosts.filter(p => p.authorId === currentUser?.id && !p.deletedAt).length;
    return 0;
  }, [socialPosts, currentUser, role]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col relative z-10 animate-fadeUp">
      
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-panel border border-border p-6 sm:p-8 mb-8 text-left">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center flex-wrap">
            <span 
              className="font-mono tracking-widest font-extrabold mr-2.5"
              style={{ 
                background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              CONNECT
            </span>
            <span>SOCIAL</span>
          </h1>
          <p className="text-text-dim mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Stay updated with technical articles, career insights, and posts shared by followed mentors.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Sidebar Profile card (1/4 width) */}
        <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
          
          <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl text-center pb-6 relative">
            <div className="h-24 bg-gradient-to-r from-primary/30 to-secondary/35 absolute inset-x-0 top-0" />
            
            <div className="relative mt-12 mb-4 z-10">
              <img 
                src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff&size=100'} 
                alt="" 
                className="w-20 h-20 rounded-xl mx-auto object-cover border-4 border-surface shadow-md"
              />
            </div>
            
            <div className="px-5">
              <h3 className="text-base font-bold text-white truncate">{currentUser?.name}</h3>
              <p className="text-xs text-primary-light font-medium truncate capitalize mt-0.5">{role}</p>
              
              <div className="border-t border-border mt-5 pt-4 grid grid-cols-2 gap-2 text-left text-xs">
                <div>
                  <p className="text-text-dim">
                    {role === 'mentor' ? 'Followers' : 'Following'}
                  </p>
                  <p className="text-base font-bold text-white mt-0.5">{followersCount}</p>
                </div>
                {role === 'mentor' && (
                  <div className="border-l border-border/80 pl-3">
                    <p className="text-text-dim">Posts</p>
                    <p className="text-base font-bold text-white mt-0.5">{totalPostsCount}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-3.5 shadow-xl">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Shortcuts</h4>
            <div className="flex flex-col gap-2 text-xs font-medium">
              <Link to="/forum" className="text-text-muted hover:text-white transition-colors">💬 Community Q&A</Link>
              {role === 'mentee' && (
                <Link to="/following-mentors" className="text-text-muted hover:text-white transition-colors">👥 Followed Mentors</Link>
              )}
            </div>
          </div>

        </aside>

        {/* Right Columns: Main Feed (3/4 width) */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Row: Search & Filters */}
          <div className="bg-surface border border-border p-5 rounded-2xl space-y-4 shadow-xl">
            
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
              
              {/* Search */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search posts by mentor, content, or tag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-panel border border-border text-xs rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-text-dim focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-text-dim" />
              </div>

              {/* Start Post Trigger (Mentors Only) */}
              {role === 'mentor' && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={handleOpenCreateModal}
                  className="shrink-0"
                >
                  <Plus className="w-4 h-4 mr-1.5" /> Start a Post
                </Button>
              )}

            </div>

            {/* Filter Tags */}
            <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar max-w-full">
              {[
                'All', 'React', 'Python', 'Machine Learning', 'AI', 
                'Data Science', 'Web Development', 'Career Guidance', 'Interview Tips'
              ].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setActiveFilter(tag);
                    // Clear focused post state to view normal lists
                    if (focusPostId) {
                      setSearchParams({});
                    }
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
                    activeFilter === tag 
                      ? "bg-primary/20 border-primary/45 text-primary-light font-extrabold" 
                      : "bg-panel border-border text-text-muted hover:text-white"
                  )}
                >
                  {tag === 'All' ? 'All SOCIAL' : `#${tag}`}
                </button>
              ))}
            </div>

          </div>

          {/* Posts Stream */}
          {visiblePosts.length > 0 ? (
            <div className="space-y-6">
              {visiblePosts.map(post => (
                <FeedPostCard 
                  key={post.id} 
                  post={post}
                  currentUser={currentUser}
                  role={role}
                  socialLikes={socialLikes}
                  socialComments={socialComments}
                  users={users}
                  isFocused={post.id === focusPostId}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeletePostSubmit}
                  onLike={likeSocialPost}
                  onUnlike={unlikeSocialPost}
                  onCommentAdd={addSocialComment}
                  onCommentEdit={updateSocialComment}
                  onCommentDelete={deleteSocialComment}
                  onShare={handleSharePost}
                />
              ))}

              {/* Infinite Scroll loading indicator */}
              {isLoadingMore && (
                <div className="flex justify-center items-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-text-muted ml-2 font-medium">Loading more updates...</span>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No social posts found"
              description="Be the first to share resources or technical tips with followed mentees!"
              action={
                role === 'mentor' && (
                  <Button size="sm" variant="primary" onClick={handleOpenCreateModal}>
                    Create a Post
                  </Button>
                )
              }
            />
          )}

        </main>

      </div>

      {/* CREATE/EDIT DIALOG POPUP */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[95] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingPost ? 'Edit Post' : 'Create a Professional Post'}
              </h3>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="p-1 rounded-lg text-text-muted hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditorSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar text-left">
              
              {/* Post Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">Post Title</label>
                <input
                  type="text"
                  placeholder="e.g., Guide to React Suspense"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full bg-panel border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50"
                  required
                />
              </div>

              {/* Rich editor block */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">Post Content</label>
                
                {/* Editor Toolbar */}
                <div className="flex flex-wrap bg-panel border border-border border-b-0 rounded-t-xl p-2 gap-1">
                  <button type="button" onClick={() => insertFormatting('bold')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Bold"><Bold className="w-4 h-4" /></button>
                  <button type="button" onClick={() => insertFormatting('italic')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Italic"><Italic className="w-4 h-4" /></button>
                  <button type="button" onClick={() => insertFormatting('underline')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Underline"><UnderlineIcon className="w-4 h-4" /></button>
                  <span className="w-px h-6 bg-border mx-1 my-0.5" />
                  <button type="button" onClick={() => insertFormatting('bullet')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Bullet List"><List className="w-4 h-4" /></button>
                  <button type="button" onClick={() => insertFormatting('number')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Number List"><span className="text-[10px] font-bold font-mono px-0.5">1.</span></button>
                  <span className="w-px h-6 bg-border mx-1 my-0.5" />
                  <button type="button" onClick={() => insertFormatting('link')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Link"><Link2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => insertFormatting('code')} className="p-1.5 text-text-muted hover:text-white rounded hover:bg-white/5" title="Code Block"><Code className="w-4 h-4" /></button>
                  <span className="w-px h-6 bg-border mx-1 my-0.5" />
                  
                  {/* Emoji quick picks */}
                  {['🚀', '💡', '🔥', '💻', '👏', '🧠'].map(em => (
                    <button key={em} type="button" onClick={() => addEmoji(em)} className="p-1 hover:bg-white/10 rounded transition-colors text-sm">{em}</button>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  placeholder="Share what is on your mind..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={6}
                  className="w-full bg-panel border border-border rounded-b-xl px-4 py-3 text-sm text-white placeholder-text-dim focus:outline-none focus:border-primary/50 resize-y"
                  required
                />
              </div>

              {/* Optional image URL */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">Image Attachment URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                  value={postImage}
                  onChange={(e) => setPostImage(e.target.value)}
                  className="w-full bg-panel border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Tags (comma separated) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="React, Frontend, Coding"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  className="w-full bg-panel border border-border rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Visibility options */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-mono text-text-dim uppercase tracking-wider">Post Visibility</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-text-muted hover:text-white cursor-pointer">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="public"
                      checked={postVisibility === 'public'}
                      onChange={() => setPostVisibility('public')}
                      className="text-primary focus:ring-0 focus:ring-offset-0 bg-panel border-border"
                    />
                    <Globe className="w-3.5 h-3.5 text-text-dim" /> Public (Anyone can view)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-text-muted hover:text-white cursor-pointer">
                    <input 
                      type="radio" 
                      name="visibility" 
                      value="followers"
                      checked={postVisibility === 'followers'}
                      onChange={() => setPostVisibility('followers')}
                      className="text-primary focus:ring-0 focus:ring-offset-0 bg-panel border-border"
                    />
                    <Users className="w-3.5 h-3.5 text-text-dim" /> Followers Only
                  </label>
                </div>
              </div>

            </form>

            {/* Modal Actions */}
            <div className="p-5 border-t border-border flex justify-end gap-3 bg-panel/40">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-border text-text-muted hover:text-white transition-all"
              >
                Cancel
              </button>
              <Button variant="primary" size="sm" onClick={handleEditorSubmit}>
                {editingPost ? 'Update Post' : 'Publish Post'}
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// Sub-Component: Feed Post Card
function FeedPostCard({
  post,
  currentUser,
  role,
  socialLikes,
  socialComments,
  users,
  isFocused,
  onEdit,
  onDelete,
  onLike,
  onUnlike,
  onCommentAdd,
  onCommentEdit,
  onCommentDelete,
  onShare
}) {
  const author = users.find(u => u.id === post.authorId) || { name: 'Deleted Mentor' };
  
  // Likes calculations
  const likes = socialLikes.filter(l => l.postId === post.id);
  const isLiked = currentUser ? likes.some(l => l.userId === currentUser.id) : false;

  // Comments computations (two level nesting)
  const comments = useMemo(() => {
    return socialComments.filter(c => c.postId === post.id && !c.deletedAt);
  }, [socialComments, post.id]);

  const topLevelComments = useMemo(() => {
    return comments.filter(c => c.parentId === null).sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [comments]);

  // Comment input form
  const [commentText, setCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null); // parentId for replies
  const [replyText, setReplyText] = useState('');

  // Editing comment states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Options overlay dropdown toggle
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLikeToggle = () => {
    if (!currentUser) return toast.error('You must be logged in to like posts.');
    if (isLiked) {
      onUnlike(post.id);
    } else {
      onLike(post.id);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      onCommentAdd({ postId: post.id, content: commentText, parentId: null });
      setCommentText('');
      toast.success('Comment posted successfully.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReplySubmit = (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      onCommentAdd({ postId: post.id, content: replyText, parentId });
      setReplyText('');
      setActiveReplyId(null);
      toast.success('Reply published.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSaveCommentEdit = (commentId) => {
    if (!editingText.trim()) return;
    try {
      onCommentEdit(commentId, editingText);
      setEditingCommentId(null);
      setEditingText('');
      toast.success('Comment updated.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <article 
      className={cn(
        "bg-surface border rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl transition-all text-left",
        isFocused ? "border-primary shadow-primary/5 ring-1 ring-primary/20 animate-pulse" : "border-border"
      )}
    >
      
      {/* Card Header Profile block */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-11 h-11 rounded-xl object-cover border border-border" 
          />
          <div>
            <h4 className="text-sm font-bold text-white hover:underline">
              <Link to={`/mentors/${author.id}`}>{author.name}</Link>
            </h4>
            <p className="text-[10px] text-primary-light font-medium mt-0.5">{author.jobRole || 'Mentor'} • {author.company}</p>
            <p className="text-[10px] text-text-dim mt-0.5">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              {post.isEdited && <span className="ml-1.5 bg-white/5 px-1 py-0.2 rounded text-[8px] uppercase tracking-wider text-text-muted">Edited</span>}
            </p>
          </div>
        </div>

        {/* Options controls overlay */}
        {(currentUser?.id === post.authorId || role === 'admin') && (
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded text-text-muted hover:text-white hover:bg-white/5 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-panel border border-border rounded-xl shadow-2xl z-20 py-1 font-semibold text-xs text-left">
                {currentUser?.id === post.authorId && (
                  <button 
                    onClick={() => { onEdit(post); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-text-muted hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                )}
                <button 
                  onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-white/5 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Title & Body */}
      <div className="space-y-2.5">
        <h3 className="text-base sm:text-lg font-bold text-white">{post.title}</h3>
        <div 
          className="text-xs sm:text-sm text-gray-300 leading-relaxed break-words rich-content"
          dangerouslySetInnerHTML={{ __html: renderRichText(post.content) }}
        />
      </div>

      {/* Optional Attachment Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden border border-border/80 max-h-[350px]">
          <LazyImage 
            src={post.image} 
            alt="Attached Content"
            className="w-full object-cover" 
          />
        </div>
      )}

      {/* Tags Chips */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map(tag => (
            <span 
              key={tag} 
              className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-panel border border-border text-text-dim"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Likes & Comments Quick counters */}
      <div className="flex items-center justify-between text-[11px] text-text-dim border-y border-border/40 py-2.5">
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-3.5 h-3.5 fill-primary/30 text-primary-light" />
          {likes.length} Likes
        </span>
        <span>{comments.length} Comments</span>
      </div>

      {/* Reactions Bar Actions */}
      <div className="flex gap-1 border-b border-border/30 pb-3">
        <button
          onClick={handleLikeToggle}
          className={cn(
            "flex-1 py-1.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors",
            isLiked 
              ? "bg-primary/10 text-primary-light" 
              : "text-text-muted hover:text-white hover:bg-white/5"
          )}
        >
          <ThumbsUp className="w-4 h-4" />
          {isLiked ? 'Liked' : 'Like'}
        </button>
        
        <button
          onClick={() => document.getElementById(`comment-input-${post.id}`).focus()}
          className="flex-1 py-1.5 text-xs font-bold rounded-xl text-text-muted hover:text-white hover:bg-white/5 flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Comment
        </button>

        <button
          onClick={() => onShare(post.id)}
          className="flex-1 py-1.5 text-xs font-bold rounded-xl text-text-muted hover:text-white hover:bg-white/5 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      {/* Comments List Section */}
      <div className="space-y-4 pt-1.5">
        
        {/* Comment input form */}
        {currentUser ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-2.5 items-center">
            <img 
              src={currentUser.avatar} 
              alt="" 
              className="w-8 h-8 rounded-lg object-cover border border-border" 
            />
            <div className="relative flex-1">
              <input
                id={`comment-input-${post.id}`}
                type="text"
                placeholder="Add a public comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-panel border border-border text-xs rounded-xl pl-3 pr-9 py-2.5 text-white placeholder-text-dim focus:outline-none focus:border-primary/50"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 p-1 text-primary-light hover:text-white rounded"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <p className="text-[11px] text-text-dim text-center py-2 bg-panel rounded-xl">
            You must be <Link to="/login" className="text-primary-light underline font-bold">logged in</Link> to write comments.
          </p>
        )}

        {/* Top level comments stream */}
        {topLevelComments.length > 0 && (
          <div className="space-y-3.5">
            {topLevelComments.map(comment => {
              const commentAuthor = users.find(u => u.id === comment.authorId) || { name: 'Deleted user' };
              const replies = comments.filter(c => c.parentId === comment.id).sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

              return (
                <div key={comment.id} className="space-y-2 text-xs">
                  
                  {/* Comment Body */}
                  <div className="bg-panel border border-border/80 rounded-xl p-3 flex gap-2.5">
                    <img 
                      src={commentAuthor.avatar} 
                      alt="" 
                      className="w-7 h-7 rounded-lg object-cover border border-border shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      
                      {/* Name & metadata */}
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-white text-[11px]">{commentAuthor.name}</span>
                          <span className="text-[9px] text-text-muted ml-1.5 capitalize font-medium">({comment.authorRole})</span>
                        </div>
                        
                        {/* comment delete/edit shortcuts */}
                        {(currentUser?.id === comment.authorId || role === 'admin') && (
                          <div className="flex gap-2">
                            {currentUser?.id === comment.authorId && (
                              <button 
                                onClick={() => { setEditingCommentId(comment.id); setEditingText(comment.content); }}
                                className="text-[10px] text-text-dim hover:text-white font-bold"
                              >
                                Edit
                              </button>
                            )}
                            <button 
                              onClick={() => { if (window.confirm('Delete comment?')) onCommentDelete(comment.id); }}
                              className="text-[10px] text-red-400/80 hover:text-red-400 font-bold"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      {editingCommentId === comment.id ? (
                        <div className="mt-2 flex gap-2">
                          <input 
                            type="text" 
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            className="flex-grow bg-surface border border-border rounded px-2.5 py-1 text-xs text-white"
                          />
                          <button 
                            onClick={() => handleSaveCommentEdit(comment.id)}
                            className="bg-primary px-2.5 py-1 rounded text-white font-bold"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingCommentId(null)}
                            className="border border-border px-2.5 py-1 rounded text-text-muted hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-300 mt-1 leading-relaxed break-all">{comment.content}</p>
                      )}

                      {/* Reply button triggers */}
                      {currentUser && !editingCommentId && (
                        <div className="flex gap-3.5 mt-2.5 text-[10px] text-text-dim font-bold">
                          <button 
                            onClick={() => {
                              setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                              setReplyText('');
                            }}
                            className="hover:text-white transition-colors"
                          >
                            Reply
                          </button>
                          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Reply Input Form */}
                  {activeReplyId === comment.id && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="flex gap-2 items-center ml-8 pt-1">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-grow bg-panel border border-border text-xs rounded-lg px-3 py-1.5 text-white placeholder-text-dim focus:outline-none focus:border-primary/50"
                        required
                      />
                      <Button type="submit" variant="primary" size="sm" className="px-3.5 py-1.5 h-8">
                        Reply
                      </Button>
                      <button 
                        type="button" 
                        onClick={() => setActiveReplyId(null)}
                        className="text-text-muted hover:text-white font-semibold text-xs"
                      >
                        Cancel
                      </button>
                    </form>
                  )}

                  {/* Nested replies list (replies of this comment) */}
                  {replies.length > 0 && (
                    <div className="ml-8 space-y-2 pt-1 border-l border-border/40 pl-3.5">
                      {replies.map(rep => {
                        const repAuthor = users.find(u => u.id === rep.authorId) || { name: 'Deleted user' };
                        
                        return (
                          <div key={rep.id} className="bg-panel/40 border border-border/40 rounded-xl p-2.5 flex gap-2">
                            <img 
                              src={repAuthor.avatar} 
                              alt="" 
                              className="w-6 h-6 rounded-lg object-cover border border-border shrink-0" 
                            />
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <span className="font-bold text-white text-[10px]">{repAuthor.name}</span>
                                  <span className="text-[8px] text-text-muted ml-1 capitalize font-medium">({rep.authorRole})</span>
                                </div>

                                {(currentUser?.id === rep.authorId || role === 'admin') && (
                                  <div className="flex gap-2">
                                    {currentUser?.id === rep.authorId && (
                                      <button 
                                        onClick={() => { setEditingCommentId(rep.id); setEditingText(rep.content); }}
                                        className="text-[9px] text-text-dim hover:text-white font-bold"
                                      >
                                        Edit
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => { if (window.confirm('Delete reply?')) onCommentDelete(rep.id); }}
                                      className="text-[9px] text-red-400/80 hover:text-red-400 font-bold"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>

                              {editingCommentId === rep.id ? (
                                <div className="mt-2 flex gap-2">
                                  <input 
                                    type="text" 
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    className="flex-grow bg-surface border border-border rounded px-2 py-0.5 text-xs text-white"
                                  />
                                  <button 
                                    onClick={() => handleSaveCommentEdit(rep.id)}
                                    className="bg-primary px-2 py-0.5 rounded text-white font-bold text-[10px]"
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={() => setEditingCommentId(null)}
                                    className="border border-border px-2 py-0.5 rounded text-text-muted hover:text-white text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <p className="text-gray-300 mt-1 break-all text-[11px] leading-relaxed">{rep.content}</p>
                              )}
                              
                              <p className="text-[9px] text-text-dim mt-1.5 font-semibold">
                                {new Date(rep.createdAt).toLocaleDateString()}
                              </p>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </article>
  );
}
