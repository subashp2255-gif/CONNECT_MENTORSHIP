import { useMemo, useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Video, Star, Users, Calendar as CalendarIcon, CheckCircle2, XCircle, ChevronRight, Clock, BookOpen, DollarSign, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import { mentors, mentees } from '../data/mockData';
import StatCard from '../components/shared/StatCard';
import SessionTypeCard from '../components/shared/SessionTypeCard';
import MentorOnboarding from '../components/mentorship/MentorOnboarding';
import MenteeProgressReport from '../components/mentorship/MenteeProgressReport';
import MentorGoalDashboard from '../components/goals/MentorGoalDashboard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ReviewCard from '../components/shared/ReviewCard';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Skeleton } from '../components/ui/Skeleton';
import LazyImage from '../components/ui/LazyImage';
import MentorForumSection from '../components/forum/MentorForumSection';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['Morning', 'Afternoon', 'Evening'];
const DEFAULT_PRICING = {
  'Mock Interview': 50,
  'Project Guidance': 50,
  'Career Chat': 0,
  'Resume Review': 50
};

const getInitialAvailability = () => {
  const initial = {};
  DAYS.forEach((day, dIdx) => {
    initial[day] = SLOTS.filter((slot, sIdx) => (dIdx + sIdx) % 2 === 0);
  });
  return initial;
};

export default function MentorDashboard() {
  const { isLoggedIn, role, currentUser, sessions, reviews, fetchSessions, fetchMentors, fetchReviews, updateSessionStatus, setUserProfile } = useStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  });
  const [showDeferredSections, setShowDeferredSections] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedMenteeForProgress, setSelectedMenteeForProgress] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Use current logged in mentor or fallback to mock
  const isActualMentor = currentUser?.id?.startsWith('m');
  const currentMentor = isActualMentor ? currentUser : { ...mentors[0], completionScore: 75 };
  const currentMentorId = currentMentor.id;

  const [availability, setAvailability] = useState(() => {
    return currentMentor.availability || getInitialAvailability();
  });
  const [pricing, setPricing] = useState(() => {
    return currentMentor.pricing || DEFAULT_PRICING;
  });

  const toggleAvailabilitySlot = (day, slot) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const newSlots = daySlots.includes(slot)
        ? daySlots.filter(s => s !== slot)
        : [...daySlots, slot];
      return { ...prev, [day]: newSlots };
    });
  };

  const handleSavePreferences = () => {
    setUserProfile({
      availability,
      pricing
    });
    toast.success('Preferences saved successfully! 💾');
  };

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (role !== 'mentor') return <Navigate to="/dashboard" />;

  const mySessions = useMemo(() => sessions.filter((s) => s.mentorId === currentMentorId), [sessions, currentMentorId]);
  const pendingRequests = useMemo(() => mySessions.filter((s) => s.status === 'pending'), [mySessions]);
  const upcomingSessions = useMemo(() => mySessions.filter((s) => s.status === 'upcoming'), [mySessions]);
  const myReviews = useMemo(() => reviews.filter((r) => r.mentorId === currentMentorId), [reviews, currentMentorId]);

  useEffect(() => {
    if (currentUser) {
      fetchSessions(currentUser.id, 'mentor');
      fetchMentors();
      // fetchReviews(currentUser.id); // Implement later
    }
  }, [currentUser, fetchSessions, fetchMentors]);

  useEffect(() => {
    const timer = setTimeout(() => setShowDeferredSections(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mentor Dashboard 🚀</h1>
        <p className="text-text-muted">Manage your sessions, requests, and availability.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border mb-8 overflow-x-auto custom-scrollbar pb-2">
        {['overview', 'requests', 'availability', 'earnings', 'goals', 'forum'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary-light bg-primary/10' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
           >
             {tab === 'goals' ? 'Task Management' : tab === 'forum' ? 'Questions Q&A' : tab.charAt(0).toUpperCase() + tab.slice(1)}
             {tab === 'requests' && pendingRequests.length > 0 && (
               <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full inline-block">
                 {pendingRequests.length}
               </span>
             )}
           </button>
        ))}
      </div>

      {/* Mentor Application Status Warning Banners */}
      {currentUser?.approvalStatus === 'Pending' && (
        <div className="mb-6 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Profile Pending Approval</h3>
              <p className="text-text-muted text-sm mt-0.5">
                Your mentor application is currently being reviewed by our administrators. You will have full access to mentoring features once approved.
              </p>
            </div>
          </div>
        </div>
      )}

      {currentUser?.approvalStatus === 'Rejected' && (
        <div className="mb-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base">Application Rejected</h3>
              <p className="text-text-muted text-sm mt-0.5">
                Your application was rejected. Reason: <span className="text-red-400 font-semibold">{currentUser.rejectionReason || 'Incomplete details'}</span>. Please contact support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1">
          {/* Onboarding Banner */}
          {currentMentor.completionScore < 80 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-primary/20 to-surface border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-primary-light" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Complete your profile</h3>
                  <p className="text-text-muted text-sm mt-0.5">Profiles with 80%+ completion get 3x more session requests. You are at {currentMentor.completionScore}%.</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setShowOnboarding(true)}>Complete Profile</Button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard label="Total Sessions" value={currentMentor.totalSessions} icon={Video} trend="up" trendValue={5} accentColor="#7c6ff7" iconBg="rgba(124,111,247,0.12)" iconColor="#a78bfa" progress={(currentMentor.totalSessions / 200) * 100} />
            <StatCard label="Average Rating" value={currentMentor.rating.toFixed(1)} icon={Star} accentColor="#22c55e" iconBg="rgba(34,197,94,0.12)" iconColor="#4ade80" progress={(currentMentor.rating / 5) * 100} />
            <StatCard label="Mentees Helped" value="84" icon={Users} accentColor="#f59e0b" iconBg="rgba(245,158,11,0.12)" iconColor="#fbbf24" progress={(84 / 100) * 100} />
            <StatCard label="Hours this Month" value="12" icon={Clock} accentColor="#378ADD" iconBg="rgba(55,138,221,0.12)" iconColor="#60a5fa" progress={(12 / 30) * 100} />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 flex-1">
            
            <section className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">Upcoming Sessions</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('requests')}>View All</Button>
              </div>
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map(session => {
                  const mentee = mentees.find(m => m.id === session.menteeId);
                  return (
                    <div key={session.id} className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center p-4 rounded-2xl bg-panel border border-border">
                      <div className="flex items-center gap-4">
                         <LazyImage src={mentee?.avatar} alt={mentee?.name || 'Mentee'} className="w-10 h-10 rounded-full object-cover" placeholderClassName="w-10 h-10 rounded-full" />
                         <div>
                           <p className="font-bold text-white text-sm">{mentee?.name}</p>
                           <p className="text-xs text-text-muted">{session.type} • {session.scheduledAt ? format(parseISO(session.scheduledAt), 'MMM d, h:mm a') : 'TBD'}</p>
                         </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                        <Link to={`/session/${session.id}/notes`} className="flex-1 sm:flex-none">
                          <Button size="sm" variant="secondary" className="w-full">
                            <BookOpen className="w-4 h-4 mr-1.5" /> Notes
                          </Button>
                        </Link>
                        <a href={session.meetLink || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                          <Button size="sm" variant="success" className="w-full">Join</Button>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {showDeferredSections ? (
            <section className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">Recent Reviews</h2>
              </div>
              <div className="space-y-4">
                {myReviews.slice(0, 2).map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </section>
            ) : (
              <section className="bg-surface border border-border rounded-3xl p-6 space-y-3">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </section>
            )}
          </div>
        </motion.div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === 'requests' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <h2 className="text-xl font-bold mb-6">Pending Requests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map(request => {
              const mentee = mentees.find(m => m.id === request.menteeId);
              return (
                <div key={request.id} className="bg-surface border border-border rounded-2xl p-5 flex flex-col shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <LazyImage src={mentee?.avatar} alt={mentee?.name || 'Mentee'} className="w-12 h-12 rounded-full border border-white/10 object-cover" placeholderClassName="w-12 h-12 rounded-full" />
                    <div>
                      <h4 className="font-bold text-white">{mentee?.name}</h4>
                      <p className="text-xs text-text-muted">Mentee</p>
                    </div>
                  </div>
                  
                  <div className="bg-panel rounded-xl p-3 mb-4 border border-white/5 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                       <Badge variant="primary">{request.type}</Badge>
                    </div>
                    <div className="text-gray-300 mt-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-text-muted" /> {request.scheduledAt ? format(parseISO(request.scheduledAt), 'MMM d, yyyy') : 'TBD'}</div>
                    <div className="text-gray-300 mt-1 flex items-center gap-2"><Clock className="w-4 h-4 text-text-muted" /> {request.scheduledAt ? format(parseISO(request.scheduledAt), 'h:mm a') : 'TBD'} • {request.duration}m</div>
                  </div>

                  <div className="mt-auto flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs hover:bg-white/5 border-white/10"
                      onClick={() => setSelectedMenteeForProgress(mentee)}
                    >
                       View Progress
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="success"
                        className="flex-1 text-xs px-2"
                        onClick={() => {
                          updateSessionStatus(request.id, 'upcoming');
                          toast.success(`Accepted session with ${mentee?.name}`);
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button 
                        variant="danger"
                        className="flex-1 text-xs px-2"
                        onClick={() => {
                          updateSessionStatus(request.id, 'declined');
                          toast.error(`Declined session with ${mentee?.name}`);
                        }}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
            {pendingRequests.length === 0 && (
              <div className="col-span-full py-12 text-center bg-surface border border-border rounded-2xl">
                <p className="text-text-muted">No pending requests.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* AVAILABILITY TAB */}
      {activeTab === 'availability' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-3xl">
          <h2 className="text-xl font-bold mb-2">Manage Weekly Availability & Pricing</h2>
          <p className="text-text-muted mb-8">Select the generic slots you are free to mentor and set your session pricing.</p>
          
          {/* Pricing section */}
          <div className="mb-10 bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
             <div className="flex justify-between items-center pb-3 mb-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
               <div className="flex items-center gap-3">
                 <div className="flex items-center justify-center shrink-0" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                   <DollarSign style={{ width: '16px', height: '16px', color: 'currentColor' }} />
                 </div>
                 <h3 style={{ fontSize: '13px', fontWeight: 500 }} className="text-white">Session pricing</h3>
               </div>
               <span style={{ fontSize: '11px', color: '#5a5778' }}>4 types configured</span>
             </div>
             <div className="grid sm:grid-cols-2 gap-4">
                {['Mock Interview', 'Project Guidance', 'Career Chat', 'Resume Review'].map(type => {
                  const abbrs = { 'Mock Interview': 'MI', 'Project Guidance': 'PG', 'Career Chat': 'CC', 'Resume Review': 'RR' };
                  const priceValue = pricing[type] !== undefined ? pricing[type] : (type === 'Career Chat' ? 0 : 50);
                  const isFree = Number(priceValue) === 0;
                  return (
                    <div 
                      key={type} 
                      className="flex flex-col justify-between transition-colors duration-[180ms] hover:border-[rgba(124,111,247,0.2)]"
                      style={{ background: '#221f30', borderRadius: '10px', padding: '12px 14px', border: '0.5px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span style={{ fontSize: '12px', color: '#5a5778', fontWeight: 600 }}>{abbrs[type]}</span>
                        <span style={{ fontSize: '11px', color: '#a09cc0' }}>{type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: '13px', color: '#5a5778' }}>$</span>
                          <input 
                            type="number" 
                            value={priceValue} 
                            onChange={(e) => {
                              const val = e.target.value;
                              setPricing(prev => ({ ...prev, [type]: val === '' ? '' : Math.max(0, Number(val)) }));
                            }}
                            className="w-16 bg-surface border border-border rounded px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-primary" 
                          />
                          <span style={{ 
                            background: isFree ? 'rgba(34,197,94,0.12)' : 'rgba(124,111,247,0.12)', 
                            color: isFree ? '#4ade80' : '#a78bfa', 
                            fontSize: '9px', fontWeight: 500, padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' 
                          }}>
                            {isFree ? 'Free' : 'Paid'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>

          <div className="flex items-center gap-3 pb-3 mb-[12px]" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-center shrink-0" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(124,111,247,0.12)', color: '#a78bfa' }}>
              <CalendarIcon style={{ width: '16px', height: '16px', color: 'currentColor' }} />
            </div>
            <h3 style={{ fontSize: '13px', fontWeight: 500 }} className="text-white">Weekly availability</h3>
          </div>
          <div className="flex flex-col gap-[6px]">
            {DAYS.map((day) => {
              const abbr = day.substring(0, 2);
              const isWeekend = day === 'Saturday' || day === 'Sunday';
              const daySlots = availability[day] || [];
              return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-surface border border-border rounded-2xl">
                <div 
                  className="flex items-center justify-center shrink-0" 
                  style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#221f30', fontSize: '10px', fontWeight: 500, color: isWeekend ? '#534AB7' : '#5a5778' }}
                >
                  {abbr}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                   {SLOTS.map((slot) => {
                     const isSelected = daySlots.includes(slot);
                     return (
                       <button
                         key={slot}
                         onClick={() => toggleAvailabilitySlot(day, slot)}
                         className="transition-all duration-150 border focus:outline-none flex items-center justify-center"
                         style={{
                           borderRadius: '7px', fontSize: '10px', padding: '8px 4px',
                           background: isSelected ? 'rgba(124,111,247,0.15)' : 'transparent',
                           color: isSelected ? '#c4b5fd' : '#5a5778',
                           borderColor: isSelected ? 'rgba(124,111,247,0.35)' : 'rgba(255,255,255,0.07)',
                           fontWeight: isSelected ? 500 : 400
                         }}
                         onMouseEnter={(e) => {
                           if (!isSelected) {
                             e.currentTarget.style.borderColor = 'rgba(124,111,247,0.2)';
                             e.currentTarget.style.color = '#a09cc0';
                           }
                         }}
                         onMouseLeave={(e) => {
                           if (!isSelected) {
                             e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                             e.currentTarget.style.color = '#5a5778';
                           }
                         }}
                       >
                         {slot}
                       </button>
                     )
                   })}
                </div>
              </div>
            )})}
          </div>

          <div className="mt-8 flex justify-end">
             <Button onClick={handleSavePreferences}>Save Preferences</Button>
          </div>
        </motion.div>
      )}

      {/* EARNINGS TAB */}
      {activeTab === 'earnings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <h2 className="text-xl font-bold mb-6">Earnings Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 stat-card-glow"
              style={{ borderRadius: '0 0 12px 12px', borderTop: '2px solid #22c55e' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text-muted text-sm font-medium mb-1">Total Earned</div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">$1,250</div>
                </div>
                <div className="flex items-center justify-center shrink-0" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(34,197,94,0.12)', color: '#4ade80' }}>
                  <TrendingUp style={{ width: '16px', height: '16px', color: 'currentColor' }} />
                </div>
              </div>
              <div style={{ color: '#4ade80' }} className="text-xs mt-4 font-medium">↑ 12% from last month</div>
            </div>
            
            <div 
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 stat-card-glow"
              style={{ borderRadius: '0 0 12px 12px', borderTop: '2px solid #f59e0b' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text-muted text-sm font-medium mb-1">Pending Payout</div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">$150</div>
                </div>
                <div className="flex items-center justify-center shrink-0" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>
                  <Clock style={{ width: '16px', height: '16px', color: 'currentColor' }} />
                </div>
              </div>
              <div style={{ color: '#5a5778' }} className="text-xs mt-4">Available on 1st of month</div>
            </div>
            
            <div 
              className="bg-white/5 backdrop-blur-md border border-white/10 p-6 stat-card-glow"
              style={{ borderRadius: '0 0 12px 12px', borderTop: '2px solid #7c6ff7' }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-text-muted text-sm font-medium mb-1">Sessions this Month</div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400">24</div>
                </div>
                <div className="flex items-center justify-center shrink-0" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(124,111,247,0.12)', color: '#a78bfa' }}>
                  <Video style={{ width: '16px', height: '16px', color: 'currentColor' }} />
                </div>
              </div>
              <div style={{ color: '#4ade80' }} className="text-xs mt-4 font-medium">↑ 4 more than last month</div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6 max-w-xl shadow-sm">
             <h3 className="font-bold mb-4 text-white">Payout Method</h3>
             <div className="flex items-center justify-between p-4 bg-panel border border-border rounded-xl">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-10 bg-white rounded flex items-center justify-center font-bold text-blue-900 text-[10px] uppercase shadow-sm">
                   PayPal
                 </div>
                 <div>
                   <div className="text-white font-medium text-sm">mentor@example.com</div>
                   <div className="text-text-muted text-xs">Default payout method</div>
                 </div>
               </div>
               <Button variant="outline" size="sm" className="text-xs">Edit</Button>
             </div>
          </div>
        </motion.div>
      )}

      {/* TASK MANAGEMENT TAB */}
      {activeTab === 'goals' && (
        <MentorGoalDashboard />
      )}

      {/* FORUM TAB */}
      {activeTab === 'forum' && (
        <MentorForumSection />
      )}

      <MentorOnboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
      <AnimatePresence>
        {selectedMenteeForProgress && (
          <MenteeProgressReport 
            isOpen={true} 
            mentee={selectedMenteeForProgress} 
            onClose={() => setSelectedMenteeForProgress(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
