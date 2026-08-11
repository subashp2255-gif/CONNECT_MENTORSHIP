import { useState, useMemo } from 'react';
import { 
  ShieldAlert, Settings, FileText, AlertTriangle, CheckCircle2, XCircle, 
  Lock, Unlock, Pin, Plus, Trash2, RotateCcw, Ban, Check, ShieldCheck,
  Hash, Layers, AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { cn } from '../../utils/helpers';

export default function AdminForumDashboard() {
  const {
    forumPosts,
    forumAnswers,
    forumComments,
    forumCategories,
    forumReports,
    forumBlockedWords,
    users,
    auditLogs,
    resolveForumReport,
    dismissForumReport,
    addForumCategory,
    updateForumCategory,
    deleteForumCategory,
    suspendForumUser,
    unsuspendForumUser,
    setForumBlockedWords,
    lockForumPost,
    unlockForumPost,
    pinForumPost,
    unpinForumPost,
    updateForumPost
  } = useStore();

  const [subTab, setSubTab] = useState('reports'); // 'reports' | 'categories' | 'words' | 'users' | 'discussions'

  // Categories addition form states
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('MessageSquare');

  // Blocked words input
  const [wordsInput, setWordsInput] = useState(() => (forumBlockedWords || []).join(', '));

  // User suspension input
  const [suspendUserId, setSuspendUserId] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  // Statistics calculation
  const stats = useMemo(() => {
    const discussions = forumPosts.filter(p => !p.deletedAt).length;
    const answers = forumAnswers.filter(a => !a.deletedAt).length;
    const comments = forumComments.filter(c => !c.deletedAt).length;
    
    const activeUserIds = new Set([
      ...forumPosts.filter(p => !p.deletedAt).map(p => p.authorId),
      ...forumAnswers.filter(a => !a.deletedAt).map(a => a.authorId),
      ...forumComments.filter(c => !c.deletedAt).map(c => c.authorId)
    ]);
    const activeUsers = activeUserIds.size;

    const unanswered = forumPosts.filter(p => {
      if (p.deletedAt) return false;
      const ansCount = forumAnswers.filter(a => a.postId === p.id && !a.deletedAt).length;
      return ansCount === 0;
    }).length;

    const openReports = forumReports.filter(r => r.status === 'Open').length;
    const deletedPosts = forumPosts.filter(p => p.deletedAt).length;

    return {
      discussions,
      answers,
      comments,
      activeUsers,
      unanswered,
      openReports,
      deletedPosts
    };
  }, [forumPosts, forumAnswers, forumComments, forumReports]);

  // Handlers for Reports
  const handleResolveReportAction = (reportId, notes) => {
    try {
      resolveForumReport(reportId, notes || 'Content moderated and resolved by admin');
      toast.success('Report resolved. Associated content has been removed.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDismissReportAction = (reportId) => {
    try {
      dismissForumReport(reportId, 'Dismissed as false positive');
      toast.success('Report dismissed.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for Categories
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return toast.error('Category name is required');
    try {
      addForumCategory({
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        icon: newCatIcon.trim()
      });
      toast.success('Category added successfully! 📂');
      setNewCatName('');
      setNewCatDesc('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleCategoryActive = (categoryId, currentStatus) => {
    try {
      updateForumCategory(categoryId, { isActive: !currentStatus });
      toast.success(`Category ${!currentStatus ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for Restricted Words
  const handleSaveBlockedWords = () => {
    try {
      const words = wordsInput.split(',').map(w => w.trim()).filter(w => w.length > 0);
      setForumBlockedWords(words);
      toast.success('Restricted words updated successfully! 📝');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for User suspension
  const handleSuspendUserSubmit = (e) => {
    e.preventDefault();
    if (!suspendUserId) return toast.error('Please select a user');
    if (!suspendReason.trim()) return toast.error('Please specify a suspension reason');
    try {
      suspendForumUser(suspendUserId, suspendReason.trim());
      toast.success('User suspended from forum activity.');
      setSuspendUserId('');
      setSuspendReason('');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLiftUserSuspension = (userId) => {
    try {
      unsuspendForumUser(userId);
      toast.success('User suspension lifted.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handlers for discussions list
  const handleRestorePost = (postId) => {
    try {
      // In useStore we can clear deletedAt by calling updateForumPost
      // Since updateForumPost merges changes, we can write a small hack or pass deletedAt = null
      useStore.setState(state => ({
        forumPosts: state.forumPosts.map(p => p.id === postId ? { ...p, deletedAt: null } : p)
      }));
      toast.success('Post restored successfully! 🔄');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Audit logs filtering
  const forumAuditLogs = useMemo(() => {
    return auditLogs.filter(l => 
      ['delete_post', 'delete_answer', 'lock_post', 'unlock_post', 'pin_post', 'unpin_post', 'resolve_forum_report', 'suspend_forum_user', 'unsuspend_forum_user'].includes(l.actionType)
    );
  }, [auditLogs]);

  return (
    <div className="space-y-8 animate-fadeUp">
      
      {/* Forum Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-panel border border-border p-4 rounded-2xl">
          <span className="text-xs text-text-muted font-semibold">Discussions</span>
          <h3 className="text-xl font-bold text-white mt-1.5">{stats.discussions}</h3>
        </div>
        <div className="bg-panel border border-border p-4 rounded-2xl">
          <span className="text-xs text-text-muted font-semibold">Answers</span>
          <h3 className="text-xl font-bold text-white mt-1.5">{stats.answers}</h3>
        </div>
        <div className="bg-panel border border-border p-4 rounded-2xl">
          <span className="text-xs text-text-muted font-semibold">Comments</span>
          <h3 className="text-xl font-bold text-white mt-1.5">{stats.comments}</h3>
        </div>
        <div className="bg-panel border border-border p-4 rounded-2xl">
          <span className="text-xs text-text-muted font-semibold">Active Users</span>
          <h3 className="text-xl font-bold text-white mt-1.5">{stats.activeUsers}</h3>
        </div>
        <div className="bg-panel border border-border p-4 rounded-2xl">
          <span className="text-xs text-text-muted font-semibold">Open Reports</span>
          <h3 className={cn("text-xl font-bold mt-1.5", stats.openReports > 0 ? "text-red-400" : "text-white")}>
            {stats.openReports}
          </h3>
        </div>
        <div className="bg-panel border border-border p-4 rounded-2xl">
          <span className="text-xs text-text-muted font-semibold">Deleted Posts</span>
          <h3 className="text-xl font-bold text-text-muted mt-1.5">{stats.deletedPosts}</h3>
        </div>
      </div>

      {/* Secondary Sub tab selector */}
      <div className="flex border-b border-border gap-4 pb-2.5 overflow-x-auto">
        {[
          { id: 'reports', label: 'Flagged Content Reports' },
          { id: 'categories', label: 'Categories' },
          { id: 'words', label: 'Spam Filter Words' },
          { id: 'users', label: 'Suspensions & Users' },
          { id: 'discussions', label: 'Discussions List' }
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => setSubTab(opt.id)}
            className={cn(
              "text-xs sm:text-sm font-semibold pb-1 border-b-2 whitespace-nowrap transition-colors",
              subTab === opt.id 
                ? "border-primary text-primary-light font-extrabold" 
                : "border-transparent text-text-muted hover:text-white"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sub Tabs views */}

      {/* REPORTS SUB TAB */}
      {subTab === 'reports' && (
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" /> Pending Flagged Reports
          </h3>
          <p className="text-xs text-text-muted">Review items flagged as spam, duplicate, or harassment by users.</p>

          <div className="space-y-4 pt-2">
            {forumReports.length > 0 ? (
              forumReports.map(rep => {
                const reporter = users.find(u => u.id === rep.reporterId) || { name: 'Anonymous' };
                
                // Fetch context snippet
                let contextContent = 'Content not found or deleted';
                if (rep.contentType === 'post') {
                  contextContent = forumPosts.find(p => p.id === rep.contentId)?.description || '';
                } else if (rep.contentType === 'answer') {
                  contextContent = forumAnswers.find(a => a.id === rep.contentId)?.content || '';
                } else if (rep.contentType === 'comment') {
                  contextContent = forumComments.find(c => c.id === rep.contentId)?.content || '';
                }

                return (
                  <div key={rep.id} className="bg-panel border border-border/80 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
                          {rep.reason}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          Type: <strong className="text-white capitalize">{rep.contentType}</strong>
                        </span>
                        <span className="text-[10px] text-text-muted">• Reporter: {reporter.name}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded",
                        rep.status === 'Open' ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" :
                        rep.status === 'Resolved' ? "bg-green-500/10 border border-green-500/20 text-green-400" :
                        "bg-white/5 text-text-dim"
                      )}>
                        {rep.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-text-dim">Reporter comments: <span className="text-gray-300 italic">"{rep.description || 'No explanation provided'}"</span></p>
                      <div className="bg-surface/50 border border-border rounded-xl p-3 text-xs font-mono text-primary-light line-clamp-3">
                        {contextContent}
                      </div>
                    </div>

                    {rep.status === 'Open' && (
                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          onClick={() => handleDismissReportAction(rep.id)}
                          className="px-3.5 py-1.5 text-xs font-bold rounded-xl border border-border text-text-muted hover:text-white"
                        >
                          Dismiss Report
                        </button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleResolveReportAction(rep.id, 'Moderated and removed by admin')}
                        >
                          Delete Content & Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-text-dim text-center py-8">No content reports filed yet.</p>
            )}
          </div>
        </div>
      )}

      {/* CATEGORIES SUB TAB */}
      {subTab === 'categories' && (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Area: Add Category form (1/3) */}
          <div className="lg:col-span-1 bg-surface border border-border p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary-light" /> Create Category
            </h3>
            
            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-text-muted font-semibold">Category Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g., Mobile Development"
                  className="w-full bg-panel border border-border text-sm rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-muted font-semibold">Description</label>
                <textarea
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="e.g., Discussions about Flutter, React Native, Swift, Kotlin..."
                  rows={3}
                  className="w-full bg-panel border border-border text-sm rounded-xl px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-muted font-semibold">Icon Identifier</label>
                <input
                  type="text"
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  placeholder="e.g., Smartphone, Code, Palette..."
                  className="w-full bg-panel border border-border text-sm rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth size="sm">
                Add Category
              </Button>
            </form>
          </div>

          {/* Right Area: Categories list (2/3) */}
          <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white">Manage Categories</h3>
            
            <div className="space-y-3">
              {forumCategories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-4 bg-panel border border-border rounded-2xl gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                    <p className="text-xs text-text-muted mt-0.5">{cat.description || 'No description provided.'}</p>
                    <p className="text-[10px] text-text-dim font-mono mt-1">ID: {cat.id} • Icon: {cat.icon}</p>
                  </div>
                  <button
                    onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
                      cat.isActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    )}
                  >
                    {cat.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* WORDS SUB TAB */}
      {subTab === 'words' && (
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Spam Filter & Blocked Keywords</h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Specify comma-separated words that should block users from creating posts, answers, or comments. Scanning is case-insensitive.
          </p>

          <div className="space-y-4 pt-2">
            <textarea
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              placeholder="spammykeyword, crypto-scam, insult, threat"
              rows={4}
              className="w-full bg-panel border border-border rounded-2xl p-4 text-sm text-white focus:outline-none"
            />
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={handleSaveBlockedWords}>
                Save Blocked Words
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPENSIONS SUB TAB */}
      {subTab === 'users' && (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Suspend Form (1/3) */}
          <div className="lg:col-span-1 bg-surface border border-border p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white">Suspend User Participation</h3>
            
            <form onSubmit={handleSuspendUserSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-text-muted font-semibold font-mono">Select User</label>
                <select
                  value={suspendUserId}
                  onChange={(e) => setSuspendUserId(e.target.value)}
                  className="w-full bg-panel border border-border text-sm rounded-xl px-3 py-2 text-white focus:outline-none"
                >
                  <option value="">-- Select user to suspend --</option>
                  {users.filter(u => u.role !== 'admin' && !u.forumSuspended).map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-text-muted font-semibold font-mono">Reason for Suspension</label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="e.g., Repeated spamming of advertising links, harassment in comments..."
                  rows={3}
                  className="w-full bg-panel border border-border text-sm rounded-xl px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <Button type="submit" variant="danger" fullWidth size="sm">
                Apply Suspension
              </Button>
            </form>
          </div>

          {/* Suspended Users List (2/3) */}
          <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-white">Forum Moderation Suspensions</h3>
            
            <div className="space-y-3">
              {users.filter(u => u.forumSuspended).length > 0 ? (
                users.filter(u => u.forumSuspended).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-panel border border-border rounded-2xl gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">{u.name}</h4>
                      <p className="text-xs text-red-400 mt-0.5">Suspended: <span className="italic">"{u.forumSuspendedReason}"</span></p>
                      <p className="text-[10px] text-text-dim font-mono mt-1">ID: {u.id} • Role: {u.role}</p>
                    </div>
                    <button
                      onClick={() => handleLiftUserSuspension(u.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border border-border text-primary-light hover:text-white hover:bg-primary/10 transition-all"
                    >
                      Lift Suspension
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-dim text-center py-6">No users suspended from forum participation.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* DISCUSSIONS SUB TAB */}
      {subTab === 'discussions' && (
        <div className="bg-surface border border-border rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">All Discussions Index</h3>
            <span className="text-[10px] text-text-dim uppercase font-bold">Includes soft-deleted / locked items</span>
          </div>

          <div className="space-y-3">
            {forumPosts.map(p => {
              const pAuthor = users.find(u => u.id === p.authorId) || { name: 'Deleted User' };
              const ansCount = forumAnswers.filter(a => a.postId === p.id && !a.deletedAt).length;

              return (
                <div key={p.id} className={cn(
                  "p-4 bg-panel border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  p.deletedAt ? "border-red-500/20 bg-red-500/5 opacity-80" : "border-border/80"
                )}>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                      {p.title}
                      {p.deletedAt && <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-1.5 py-0.2 text-[9px] rounded uppercase font-extrabold">Moderated (Deleted)</span>}
                      {p.isLocked && <span className="bg-white/5 text-text-muted px-1.5 py-0.2 text-[9px] rounded">Locked</span>}
                      {p.isPinned && <span className="bg-primary/20 text-primary-light px-1.5 py-0.2 text-[9px] rounded font-bold">Pinned</span>}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5">Author: {pAuthor.name} • {ansCount} answers • {p.viewCount} views</p>
                  </div>

                  <div className="flex gap-1.5 self-end sm:self-auto">
                    {p.deletedAt ? (
                      <button
                        onClick={() => handleRestorePost(p.id)}
                        className="px-2.5 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-green-500/20"
                        title="Restore post"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            if (p.isLocked) {
                              useStore.setState(state => ({ forumPosts: state.forumPosts.map(post => post.id === p.id ? { ...post, isLocked: false } : post) }));
                              toast.success('Discussion unlocked.');
                            } else {
                              lockForumPost(p.id, 'Moderator lock');
                            }
                          }}
                          className={cn(
                            "px-2.5 py-1.5 border text-xs font-bold rounded-xl flex items-center gap-1",
                            p.isLocked ? "bg-white/5 border-border text-text-muted" : "bg-panel text-text-muted hover:text-white"
                          )}
                        >
                          {p.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          {p.isLocked ? 'Unlock' : 'Lock'}
                        </button>

                        <button
                          onClick={() => {
                            if (p.isPinned) {
                              unpinForumPost(p.id);
                            } else {
                              pinForumPost(p.id);
                            }
                          }}
                          className={cn(
                            "px-2.5 py-1.5 border text-xs font-bold rounded-xl flex items-center gap-1",
                            p.isPinned ? "bg-primary/20 border-primary/30 text-primary-light" : "bg-panel text-text-muted hover:text-white"
                          )}
                        >
                          <Pin className="w-3.5 h-3.5" />
                          {p.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
