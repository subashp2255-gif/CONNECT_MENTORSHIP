import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CheckCircle2, ThumbsUp, Award, Zap, Compass, ArrowRight, BrainCircuit, Code, HelpCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import EmptyState from '../shared/EmptyState';
import { cn } from '../../utils/helpers';

export default function MentorForumSection() {
  const { currentUser, forumPosts, forumAnswers, forumVotes, users } = useStore();
  
  const currentMentorId = currentUser?.id;
  const mentorSkills = useMemo(() => {
    return (currentUser?.skills || []).map(s => s.toLowerCase().trim());
  }, [currentUser]);

  // Compute stats
  const mentorStats = useMemo(() => {
    const answers = forumAnswers.filter(a => a.authorId === currentMentorId && !a.deletedAt);
    const accepted = answers.filter(a => a.isAccepted);
    
    // Sum upvotes on answer
    let upvotesCount = 0;
    answers.forEach(ans => {
      upvotesCount += forumVotes.filter(v => v.answerId === ans.id && v.voteType === 'UPVOTE').length;
    });

    const reputation = currentUser?.reputation || 0;
    const responseRate = currentUser?.responseRate || 100;

    return {
      totalAnswers: answers.length,
      acceptedAnswers: accepted.length,
      upvotes: upvotesCount,
      reputation,
      responseRate
    };
  }, [forumAnswers, forumVotes, currentMentorId, currentUser]);

  // Sub-filtering inside recommendations
  const [filterType, setFilterType] = useState('skills'); // 'skills' | 'unanswered' | 'latest' | 'priority'

  const questions = useMemo(() => {
    let posts = forumPosts.filter(p => !p.deletedAt);

    if (filterType === 'skills') {
      // Posts containing tags matching mentor's skills
      posts = posts.filter(p => 
        p.tags.some(tag => mentorSkills.includes(tag.toLowerCase()))
      );
    } else if (filterType === 'unanswered') {
      posts = posts.filter(p => {
        const answersCount = forumAnswers.filter(a => a.postId === p.id && !a.deletedAt).length;
        return answersCount === 0;
      });
    } else if (filterType === 'priority') {
      // Unanswered && high views
      posts = posts.filter(p => {
        const answersCount = forumAnswers.filter(a => a.postId === p.id && !a.deletedAt).length;
        return answersCount === 0 && (p.viewCount || 0) >= 30;
      });
    }

    // Sort by latest first
    return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [forumPosts, forumAnswers, mentorSkills, filterType]);

  // Helper for reputation levels
  const getReputationLevel = (points = 0) => {
    if (points >= 1000) return 'Community Expert';
    if (points >= 500) return 'Knowledge Sharer';
    if (points >= 100) return 'Contributor';
    return 'Beginner';
  };

  return (
    <div className="space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Reputation Card */}
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Reputation</span>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{mentorStats.reputation}</h3>
            <p className="text-[10px] text-yellow-400 mt-1 font-bold">{getReputationLevel(mentorStats.reputation)}</p>
          </div>
        </div>

        {/* Answers Given */}
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Answers Given</span>
            <MessageSquare className="w-5 h-5 text-primary-light" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{mentorStats.totalAnswers}</h3>
            <p className="text-[10px] text-text-dim mt-1 font-semibold">Peer & Mentee support</p>
          </div>
        </div>

        {/* Accepted Answers */}
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Accepted Answers</span>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{mentorStats.acceptedAnswers}</h3>
            <p className="text-[10px] text-green-400 mt-1 font-semibold">
              {mentorStats.totalAnswers > 0 
                ? `${Math.round((mentorStats.acceptedAnswers / mentorStats.totalAnswers) * 100)}% acceptance rate` 
                : 'No answers yet'}
            </p>
          </div>
        </div>

        {/* Answer Upvotes */}
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Upvotes Received</span>
            <ThumbsUp className="w-5 h-5 text-secondary" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">+{mentorStats.upvotes}</h3>
            <p className="text-[10px] text-text-dim mt-1 font-semibold">Total helpful feedback</p>
          </div>
        </div>

        {/* Forum Response Rate */}
        <div className="bg-surface border border-border p-5 rounded-2xl flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Response Rate</span>
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white">{mentorStats.responseRate}%</h3>
            <p className="text-[10px] text-blue-400 mt-1 font-semibold">Fast assistance</p>
          </div>
        </div>

      </div>

      {/* Grid: Questions Area & Tips Panel */}
      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Recommended Questions Section (3/4 width) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              🙋‍♂️ Questions You Can Answer
            </h2>
            
            {/* Recommendation filters */}
            <div className="flex bg-panel p-1 rounded-xl border border-border overflow-x-auto max-w-full">
              {[
                { id: 'skills', label: 'My Skills Match' },
                { id: 'unanswered', label: 'Unanswered' },
                { id: 'latest', label: 'Latest Questions' },
                { id: 'priority', label: 'High Priority' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setFilterType(opt.id)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap",
                    filterType === opt.id ? "bg-primary text-white" : "text-text-muted hover:text-white"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* List content */}
          {questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map(post => {
                const author = users.find(u => u.id === post.authorId) || { name: 'Mentee' };
                const answerCount = forumAnswers.filter(a => a.postId === post.id && !a.deletedAt).length;

                return (
                  <div key={post.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-primary/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm sm:text-base font-bold text-white hover:text-primary-light transition-colors">
                        <Link to={`/forum/post/${post.id}`}>{post.title}</Link>
                      </h4>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-text-muted">
                        <span>Asked by {author.name}</span>
                        <span>•</span>
                        <span>{answerCount} answers</span>
                        <span>•</span>
                        <span>{post.viewCount || 0} views</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map(t => (
                          <span 
                            key={t} 
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded border font-semibold",
                              mentorSkills.includes(t.toLowerCase())
                                ? "bg-primary/20 text-primary-light border-primary/30"
                                : "bg-panel text-text-dim border-border"
                            )}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link to={`/forum/post/${post.id}`} className="shrink-0 self-end sm:self-auto">
                      <Button size="sm" variant="secondary" className="flex items-center gap-1">
                        Answer Question <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={HelpCircle}
              title={
                filterType === 'skills' ? "No skills-matched questions right now" :
                filterType === 'priority' ? "No high-priority unanswered questions" :
                "All caught up!"
              }
              description={
                filterType === 'skills' ? `None of the unanswered questions currently match your skills: ${currentUser?.skills?.join(', ') || 'none specified'}.` :
                "Explore other categories or check back later to help other mentees learn."
              }
              action={
                <button 
                  onClick={() => setFilterType('latest')}
                  className="text-xs text-primary-light hover:underline font-bold"
                >
                  Explore All Latest Discussions
                </button>
              }
            />
          )}

        </div>

        {/* Reputation levels info sidebar (1/4 width) */}
        <aside className="space-y-6">
          
          <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-border pb-3">
              🏆 Reputation Benefits
            </h3>
            
            <p className="text-xs text-text-muted leading-relaxed">
              Earn community points by helping mentees solve technical questions. Points promote your profile on search listing:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-muted">Accepted Answer</span>
                <span className="text-green-400 font-bold font-mono">+15 pts</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-muted">Answer Upvoted</span>
                <span className="text-primary-light font-bold font-mono">+5 pts</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-muted">Post Upvoted</span>
                <span className="text-primary-light font-bold font-mono">+2 pts</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                <span className="text-text-muted">Answer Downvoted</span>
                <span className="text-red-400 font-bold font-mono">-2 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Post Downvoted</span>
                <span className="text-red-400 font-bold font-mono">-1 pt</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-white">Reputation Ranks</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted font-mono">0 - 99</span>
                <span className="text-white font-semibold">Beginner</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-mono">100 - 499</span>
                <span className="text-primary-light font-semibold">Contributor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-mono">500 - 999</span>
                <span className="text-secondary font-semibold">Knowledge Sharer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted font-mono">1000+</span>
                <span className="text-yellow-400 font-bold">Community Expert</span>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
