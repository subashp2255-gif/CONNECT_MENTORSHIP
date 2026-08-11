import { useState, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Compass, Award, ArrowRight, UserMinus } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import LazyImage from '../components/ui/LazyImage';
import EmptyState from '../components/shared/EmptyState';

export default function FollowingMentorsPage() {
  const { 
    isLoggedIn, 
    role, 
    currentUser, 
    follows = [], 
    users = [], 
    unfollowMentor 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('All');

  // Route security
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (role !== 'mentee') return <Navigate to="/mentor/dashboard" />;

  // Get followed mentors list from the users collection
  const followedMentors = useMemo(() => {
    const followedIds = follows
      .filter(f => f.followerId === currentUser.id)
      .map(f => f.mentorId);
    
    return users.filter(u => u.role === 'mentor' && followedIds.includes(u.id));
  }, [follows, users, currentUser]);

  // Extract all unique skills among followed mentors for filter
  const followedSkills = useMemo(() => {
    const skillsSet = new Set();
    followedMentors.forEach(m => {
      if (m.skills) m.skills.forEach(s => skillsSet.add(s));
    });
    return ['All', ...Array.from(skillsSet).sort()];
  }, [followedMentors]);

  // Filter followed mentors
  const filteredMentors = useMemo(() => {
    return followedMentors.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (m.company && m.company.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
        (m.jobRole && m.jobRole.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      
      const matchesSkill = selectedExpertise === 'All' || 
        (m.skills && m.skills.includes(selectedExpertise));

      return matchesSearch && matchesSkill;
    });
  }, [followedMentors, searchQuery, selectedExpertise]);

  const handleUnfollow = (mentorId, e) => {
    e.preventDefault();
    e.stopPropagation();
    unfollowMentor(mentorId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col relative z-10 animate-fadeUp">
      
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-panel border border-border p-6 sm:p-8 mb-8">
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
            <span>Following Mentors</span>
          </h1>
          <p className="text-text-dim mt-2 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Manage your network. You will receive real-time notifications on the global Feed whenever the mentors you follow publish new posts.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Search and Filters (1/4 width) */}
        <aside className="lg:col-span-1 space-y-6">
          
          {/* Search box */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-white">Search Mentors</h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-panel border border-border text-xs rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-text-dim focus:outline-none focus:border-primary/50 transition-colors"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-text-dim" />
            </div>
          </div>

          {/* Skill Filter box */}
          <div className="bg-surface border border-border rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-light" /> Expertise
              </h3>
              {selectedExpertise !== 'All' && (
                <button 
                  onClick={() => setSelectedExpertise('All')}
                  className="text-[10px] text-text-muted hover:text-white underline font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            
            <div className="flex flex-col gap-1.5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {followedSkills.map(skill => (
                <button
                  key={skill}
                  onClick={() => setSelectedExpertise(skill)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                    selectedExpertise === skill
                      ? 'bg-primary/20 text-primary-light border border-primary/25'
                      : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {skill === 'All' ? 'All Skills' : `#${skill}`}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Side: Mentors Grid (3/4 width) */}
        <main className="lg:col-span-3">
          {filteredMentors.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredMentors.map(mentor => {
                const mentorFollowers = follows.filter(f => f.mentorId === mentor.id).length;
                
                return (
                  <div 
                    key={mentor.id} 
                    className="bg-surface border border-border rounded-2xl p-5 flex flex-col justify-between hover:border-primary/30 transition-all shadow-xl group hover:shadow-primary/5 hover:-translate-y-0.5"
                  >
                    <div className="space-y-4">
                      
                      {/* Mentor profile row */}
                      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                        <img 
                          src={mentor.avatar} 
                          alt={mentor.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-border" 
                        />
                        <div className="min-w-0">
                          <h4 className="text-base font-bold text-white group-hover:text-primary-light transition-colors truncate">
                            {mentor.name}
                          </h4>
                          <p className="text-xs text-primary-light font-medium truncate mt-0.5">{mentor.jobRole || 'SDE'}</p>
                          <p className="text-[10px] text-text-muted mt-0.5">{mentor.company} • {mentorFollowers} Followers</p>
                        </div>
                      </div>

                      {/* Bio preview */}
                      <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                        {mentor.bio || 'Professional mentor helping students design scalable applications and prepare for tech roles.'}
                      </p>

                      {/* Skills badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {mentor.skills?.slice(0, 3).map(skill => (
                          <span 
                            key={skill} 
                            className="text-[9px] font-bold px-2 py-0.5 rounded-lg bg-panel border border-border text-text-dim"
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>

                    </div>

                    {/* Actions footer */}
                    <div className="flex gap-2 mt-6 pt-4 border-t border-border/40">
                      <button
                        onClick={(e) => handleUnfollow(mentor.id, e)}
                        className="px-3 py-2 text-xs font-bold rounded-xl border border-border text-text-muted hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5 transition-all flex items-center gap-1.5"
                        title="Unfollow mentor"
                      >
                        <UserMinus className="w-3.5 h-3.5" /> Unfollow
                      </button>
                      <Link to={`/mentors/${mentor.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" fullWidth className="flex items-center justify-center gap-1">
                          View Profile <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title={
                searchQuery || selectedExpertise !== 'All' 
                  ? "No matching followed mentors" 
                  : "You aren't following anyone yet"
              }
              description={
                searchQuery || selectedExpertise !== 'All' 
                  ? "Try checking your filters or adjusting your search phrase." 
                  : "Explore the directory to find and follow mentors based on your learning goals."
              }
              action={
                <Link to="/mentors">
                  <Button size="sm" variant="primary">
                    Find Mentors to Follow
                  </Button>
                </Link>
              }
            />
          )}
        </main>

      </div>

    </div>
  );
}
