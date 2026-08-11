import { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Plus, Compass, Sparkles, AlertCircle, HelpCircle, X, History, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ForumPostCard from '../../components/forum/ForumPostCard';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/shared/EmptyState';
import { cn } from '../../utils/helpers';

const ITEMS_PER_PAGE = 5;

export default function ForumPage({ defaultFilter }) {
  const { category, tag } = useParams();
  const navigate = useNavigate();
  const { 
    forumPosts, 
    forumAnswers, 
    forumVotes, 
    forumCategories, 
    currentUser, 
    followedDiscussions,
    savedPosts,
    isLoggedIn
  } = useStore();

  const [activeTab, setActiveTab] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('forum_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Sync tab with route filters
  useEffect(() => {
    if (defaultFilter) {
      setActiveTab(defaultFilter);
    } else if (category) {
      setActiveTab('category');
    } else if (tag) {
      setActiveTab('tag');
    } else {
      setActiveTab('latest');
    }
    setVisibleCount(ITEMS_PER_PAGE);
  }, [defaultFilter, category, tag]);

  // Reset pagination on search query change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery]);

  // Save recent search
  const saveSearch = (query) => {
    if (!query.trim()) return;
    const cleanQuery = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== cleanQuery.toLowerCase());
      const updated = [cleanQuery, ...filtered].slice(0, 5);
      localStorage.setItem('forum_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('forum_recent_searches');
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    let posts = forumPosts.filter(p => !p.deletedAt);

    // Apply main tab filters
    if (activeTab === 'solved') {
      posts = posts.filter(p => p.isSolved);
    } else if (activeTab === 'unanswered') {
      posts = posts.filter(p => {
        const answers = forumAnswers.filter(a => a.postId === p.id && !a.deletedAt);
        return answers.length === 0;
      });
    } else if (activeTab === 'following') {
      if (!isLoggedIn) {
        return [];
      }
      const myFollowedIds = followedDiscussions.filter(f => f.userId === currentUser.id).map(f => f.postId);
      posts = posts.filter(p => myFollowedIds.includes(p.id));
    } else if (activeTab === 'saved') {
      if (!isLoggedIn) {
        return [];
      }
      const mySavedIds = savedPosts.filter(s => s.userId === currentUser.id).map(s => s.postId);
      posts = posts.filter(p => mySavedIds.includes(p.id));
    } else if (activeTab === 'my-posts') {
      if (!isLoggedIn) {
        return [];
      }
      posts = posts.filter(p => p.authorId === currentUser.id);
    } else if (activeTab === 'category' && category) {
      // Find category by slug/name matching
      const targetCategory = forumCategories.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase() || 
        c.id === category
      );
      if (targetCategory) {
        posts = posts.filter(p => p.categoryId === targetCategory.id);
      }
    } else if (activeTab === 'tag' && tag) {
      posts = posts.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      posts = posts.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort posts
    // 1. Pinned posts always float to the top
    return [...posts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Secondary sorting based on activeTab
      if (activeTab === 'trending') {
        const scoreA = (a.viewCount || 0) + (forumVotes.filter(v => v.postId === a.id).length * 3);
        const scoreB = (b.viewCount || 0) + (forumVotes.filter(v => v.postId === b.id).length * 3);
        return scoreB - scoreA;
      }

      if (activeTab === 'most-upvoted') {
        const getScore = (pId) => {
          const postVotes = forumVotes.filter(v => v.postId === pId);
          const up = postVotes.filter(v => v.voteType === 'UPVOTE').length;
          const down = postVotes.filter(v => v.voteType === 'DOWNVOTE').length;
          return up - down;
        };
        return getScore(b.id) - getScore(a.id);
      }

      // Default: latest
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [forumPosts, forumAnswers, forumVotes, followedDiscussions, savedPosts, activeTab, category, tag, searchQuery, currentUser, forumCategories, isLoggedIn]);

  // Paginated/Sliced posts
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Autosuggestions list (matching tags or post titles)
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    
    const matchedTitles = forumPosts
      .filter(p => !p.deletedAt && p.title.toLowerCase().includes(q))
      .map(p => ({ type: 'post', label: p.title, id: p.id }))
      .slice(0, 3);

    const matchedTags = Array.from(new Set(forumPosts.flatMap(p => p.tags)))
      .filter(t => t.toLowerCase().includes(q))
      .map(t => ({ type: 'tag', label: `#${t}`, value: t }))
      .slice(0, 3);

    return [...matchedTitles, ...matchedTags];
  }, [searchQuery, forumPosts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col relative z-10">
      
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-panel border border-border p-6 sm:p-8 mb-8">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
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
              <span>Community Forum 💬</span>
            </h1>
            <p className="text-text-dim mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Ask questions, share code snippets, browse resources, and build knowledge with verified mentors and peers.
            </p>
          </div>
          <Link to={isLoggedIn ? "/forum/create" : "/login"} className="shrink-0">
            <Button variant="primary" className="shadow-lg shadow-primary/25 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl">
              <Plus className="w-4 h-4 mr-1.5" /> Ask a Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Area: Categories list & Navigation sidebar */}
        <aside className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Navigation Options */}
          <div className="bg-surface border border-border rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider px-3 mb-2">Navigation</h3>
            <button
              onClick={() => {
                navigate('/forum');
                setActiveTab('latest');
              }}
              className={cn(
                "w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition-all",
                activeTab === 'latest' || activeTab === 'trending' || activeTab === 'most-upvoted'
                  ? "bg-primary/10 text-primary-light border border-primary/20"
                  : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <span className="flex items-center gap-2.5"><Compass className="w-4 h-4" /> Explore Forum</span>
            </button>

            {isLoggedIn && (
              <>
                <button
                  onClick={() => navigate('/forum/saved')}
                  className={cn(
                    "w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition-all",
                    activeTab === 'saved'
                      ? "bg-primary/10 text-primary-light border border-primary/20"
                      : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <span>Saved Discussions</span>
                  <span className="text-[10px] bg-panel px-2 py-0.5 rounded-full border border-border text-text-muted">
                    {savedPosts.filter(s => s.userId === currentUser.id).length}
                  </span>
                </button>

                <button
                  onClick={() => navigate('/forum/my-posts')}
                  className={cn(
                    "w-full text-left rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition-all",
                    activeTab === 'my-posts'
                      ? "bg-primary/10 text-primary-light border border-primary/20"
                      : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <span>My Questions</span>
                  <span className="text-[10px] bg-panel px-2 py-0.5 rounded-full border border-border text-text-muted">
                    {forumPosts.filter(p => p.authorId === currentUser.id && !p.deletedAt).length}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Categories Filter box */}
          <div className="bg-surface border border-border rounded-2xl p-4">
            <h3 className="text-xs font-extrabold text-text-muted uppercase tracking-wider px-3 mb-3 flex items-center justify-between">
              Categories
            </h3>
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
              {forumCategories.filter(c => c.isActive).map(catItem => {
                const isCatActive = activeTab === 'category' && (category === catItem.id || category === catItem.name.toLowerCase().replace(/\s+/g, '-'));
                const catCount = forumPosts.filter(p => p.categoryId === catItem.id && !p.deletedAt).length;

                return (
                  <button
                    key={catItem.id}
                    onClick={() => navigate(`/forum/category/${catItem.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className={cn(
                      "w-full text-left rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold flex items-center justify-between transition-all py-2",
                      isCatActive
                        ? "bg-primary/10 text-primary-light border border-primary/20"
                        : "text-text-muted hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <span className="truncate">{catItem.name}</span>
                    <span className="text-[10px] bg-panel px-1.5 py-0.5 rounded border border-border text-text-muted">
                      {catCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </aside>

        {/* Center & Right Area: Search, Tabs, Listing */}
        <main className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Search bar & Live Suggestions panel */}
          <div className="relative">
            <div className="flex bg-surface border border-border rounded-2xl p-2 items-center gap-2 focus-within:border-primary/50 transition-colors">
              <Search className="w-5 h-5 text-text-dim ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 250)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveSearch(searchQuery);
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Search by title, description, category, tags..."
                className="w-full bg-transparent border-0 outline-none text-white text-sm sm:text-base placeholder-text-dim focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSuggestions(false);
                  }}
                  className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Drawer overlay */}
            {showSuggestions && (searchQuery.trim() || recentSearches.length > 0) && (
              <div className="absolute top-full inset-x-0 mt-2 bg-surface border border-border rounded-2xl shadow-2xl p-3 z-50 animate-fadeUp">
                
                {/* Live Suggestions list */}
                {searchQuery.trim() && suggestions.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2.5 mb-1.5">Suggestions</h4>
                    <div className="space-y-0.5">
                      {suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (sug.type === 'tag') {
                              navigate(`/forum/tag/${sug.value}`);
                            } else {
                              navigate(`/forum/post/${sug.id}`);
                            }
                            setSearchQuery('');
                          }}
                          className="w-full text-left text-xs sm:text-sm text-gray-200 font-semibold px-2.5 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span className="truncate">{sug.label}</span>
                          <span className="text-[10px] text-text-dim capitalize">{sug.type}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches list */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between px-2.5 mb-1.5">
                      <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Recent Searches</h4>
                      <button 
                        onClick={clearRecentSearches}
                        className="text-[10px] text-red-400 hover:text-red-300 font-semibold transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-0.5">
                      {recentSearches.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(term);
                            saveSearch(term);
                          }}
                          className="w-full text-left text-xs sm:text-sm text-gray-200 font-semibold px-2.5 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <History className="w-3.5 h-3.5 text-text-dim" />
                          <span className="truncate">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery.trim() && suggestions.length === 0 && (
                  <div className="p-3 text-center text-xs text-text-muted">
                    No matching suggestions. Press Enter to search custom terms.
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Filtering Navigation tabs */}
          {!category && !tag && !['saved', 'my-posts'].includes(activeTab) && (
            <div className="flex space-x-2 border-b border-border overflow-x-auto pb-1.5 custom-scrollbar">
              {[
                { id: 'latest', label: 'Latest' },
                { id: 'trending', label: 'Trending' },
                { id: 'most-upvoted', label: 'Most Upvoted' },
                { id: 'unanswered', label: 'Unanswered' },
                { id: 'solved', label: 'Solved' }
              ].map(tabItem => (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id)}
                  className={cn(
                    "px-4 py-2 font-semibold text-xs sm:text-sm rounded-xl border transition-all whitespace-nowrap",
                    activeTab === tabItem.id 
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/10" 
                      : "text-text-muted hover:text-white border-transparent hover:bg-white/5"
                  )}
                >
                  {tabItem.label}
                </button>
              ))}
            </div>
          )}

          {/* Filter Status Badge indicators */}
          {(category || tag || ['saved', 'my-posts'].includes(activeTab)) && (
            <div className="flex items-center gap-3 bg-panel/50 border border-border px-4 py-3 rounded-2xl">
              <span className="text-xs sm:text-sm text-text-muted">
                Active filter: <span className="text-white font-bold capitalize">
                  {category ? `Category: ${category.replace(/-/g, ' ')}` : tag ? `Tag: #${tag}` : activeTab.replace('-', ' ')}
                </span>
              </span>
              <button
                onClick={() => navigate('/forum')}
                className="text-xs text-primary-light hover:text-white underline font-semibold transition-colors ml-auto"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Posts Listing container */}
          {visiblePosts.length > 0 ? (
            <div className="space-y-4">
              {visiblePosts.map(post => (
                <ForumPostCard key={post.id} post={post} />
              ))}

              {/* Load More pagination button */}
              {filteredPosts.length > visibleCount && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                    className="flex items-center gap-2"
                  >
                    Load More discussions <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="my-8">
              <EmptyState
                icon={HelpCircle}
                title={
                  activeTab === 'saved' ? "No saved discussions found" :
                  activeTab === 'my-posts' ? "You haven't posted any questions yet" :
                  activeTab === 'unanswered' ? "No unanswered questions found" :
                  "No discussions match your criteria"
                }
                description={
                  activeTab === 'saved' ? "Browse the community forum and bookmark interesting questions to see them here!" :
                  activeTab === 'my-posts' ? "Got a question? Share it with the community and let mentors help you." :
                  "Try adjusting your filters, clearing search parameters, or create a brand new discussion topic."
                }
                action={
                  <Link to="/forum/create">
                    <Button variant="primary" size="sm">Ask a Question</Button>
                  </Link>
                }
              />
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
