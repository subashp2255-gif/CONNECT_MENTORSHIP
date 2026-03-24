import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Video, Star, Users, Calendar as CalendarIcon, CheckCircle2, XCircle, ChevronRight, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import { sessions, mentors, mentees, reviews } from '../data/mockData';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ReviewCard from '../components/shared/ReviewCard';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function MentorDashboard() {
  const { isLoggedIn, role, currentUser } = useStore();
  const [activeTab, setActiveTab] = useState('overview'); // overview, requests, availability

  // Use current logged in mentor or fallback to mock
  const currentMentor = role === 'mentor' ? currentUser : mentors[0]; 

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (role !== 'mentor') return <Navigate to="/dashboard" />;

  const mySessions = sessions.filter(s => s.mentorId === currentMentor.id);
  const pendingRequests = mySessions.filter(s => s.status === 'upcoming' && !s.feedback); // Simulated pending
  const upcomingSessions = mySessions.filter(s => s.status === 'upcoming' && s.feedback !== null); // Simulated confirmed
  
  const myReviews = reviews.filter(r => r.mentorId === currentMentor.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mentor Dashboard 🚀</h1>
        <p className="text-text-muted">Manage your sessions, requests, and availability.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border mb-8 overflow-x-auto custom-scrollbar pb-2">
        {['overview', 'requests', 'availability'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary-light bg-primary/10' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
           >
             {tab.charAt(0).toUpperCase() + tab.slice(1)}
             {tab === 'requests' && pendingRequests.length > 0 && (
               <span className="ml-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full inline-block">
                 {pendingRequests.length}
               </span>
             )}
           </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 flex-1">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard label="Total Sessions" value={currentMentor.totalSessions} icon={Video} trend="up" trendValue={5} />
            <StatCard label="Average Rating" value={currentMentor.rating.toFixed(1)} icon={Star} />
            <StatCard label="Mentees Helped" value="84" icon={Users} />
            <StatCard label="Hours this Month" value="12" icon={Clock} />
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
                         <img src={mentee?.avatar} alt="" className="w-10 h-10 rounded-full" />
                         <div>
                           <p className="font-bold text-white text-sm">{mentee?.name}</p>
                           <p className="text-xs text-text-muted">{session.type} • {format(parseISO(session.scheduledAt), 'MMM d, h:mm a')}</p>
                         </div>
                      </div>
                      <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 w-full sm:w-auto">Join</Button>
                      </a>
                    </div>
                  )
                })}
              </div>
            </section>

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
                    <img src={mentee?.avatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
                    <div>
                      <h4 className="font-bold text-white">{mentee?.name}</h4>
                      <p className="text-xs text-text-muted">{mentee?.college} • {mentee?.year}</p>
                    </div>
                  </div>
                  
                  <div className="bg-panel rounded-xl p-3 mb-4 border border-white/5 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                       <Badge variant="primary">{request.type}</Badge>
                    </div>
                    <div className="text-gray-300 mt-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-text-muted" /> {format(parseISO(request.scheduledAt), 'MMM d, yyyy')}</div>
                    <div className="text-gray-300 mt-1 flex items-center gap-2"><Clock className="w-4 h-4 text-text-muted" /> {format(parseISO(request.scheduledAt), 'h:mm a')} • {request.duration}m</div>
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button 
                      className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50"
                      onClick={() => toast.success(`Accepted session with ${mentee?.name}`)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Accept
                    </Button>
                    <Button 
                      className="flex-1 bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50"
                      onClick={() => toast.error(`Declined session with ${mentee?.name}`)}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Decline
                    </Button>
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
          <h2 className="text-xl font-bold mb-2">Manage Weekly Availability</h2>
          <p className="text-text-muted mb-8">Select the generic slots you are free to mentor. You can override specific dates later.</p>
          
          <div className="space-y-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, dIdx) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-surface border border-border rounded-2xl">
                <div className="w-32 font-bold text-white">{day}</div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                   {['Morning', 'Afternoon', 'Evening'].map((slot, sIdx) => {
                     // Fake logic for toggled state visually
                     const isSelected = (dIdx + sIdx) % 2 === 0;
                     return (
                       <button
                         key={slot}
                         className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-primary/20 text-primary-light border-primary' : 'bg-panel text-text-muted border-transparent hover:bg-white/5'}`}
                       >
                         {slot}
                       </button>
                     )
                   })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
             <Button>Save Availability</Button>
          </div>
        </motion.div>
      )}

    </div>
  );
}
