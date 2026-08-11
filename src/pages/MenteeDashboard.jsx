import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Video, Award, Target, Flame, ArrowRight, Play, Edit2, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import { sessions, mentors, mentees } from '../data/mockData';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';
import MentorCard from '../components/shared/MentorCard';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import MenteeGoalDashboard from '../components/goals/MenteeGoalDashboard';

export default function MenteeDashboard() {
  const { isLoggedIn, currentUser, role } = useStore();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('tab') || 'overview';
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (role !== 'mentee') return <Navigate to="/mentor/dashboard" />;

  const mySessions = sessions.filter(s => s.menteeId === currentUser.id);
  const upcomingSessions = mySessions.filter(s => s.status === 'upcoming').sort((a,b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  const pastSessions = mySessions.filter(s => s.status === 'completed').sort((a,b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

  // Determine recommended mentors by simple match (mentors who have skills the user wants as goals, roughly simulated here)
  const recommendedMentors = mentors.slice(0, 4); 

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Good morning, {currentUser.name.split(' ')[0]} 👋</h1>
        <p className="text-text-muted">Here's a summary of your mentorship journey.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border mb-8 overflow-x-auto custom-scrollbar pb-2">
        {['overview', 'goals'].map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary-light bg-primary/10' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}
           >
             {tab === 'goals' ? 'My Tasks' : 'Overview'}
           </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <StatCard label="Sessions Completed" value={pastSessions.length} icon={Video} trend="up" trendValue={12} />
        <StatCard label="Mentors Connected" value={new Set(pastSessions.map(s => s.mentorId)).size} icon={Award} />
        <StatCard label="Goals Achieved" value="2" icon={Target} />
        <StatCard label="Day Streak" value="5" icon={Flame} />
      </div>

      {activeTab === 'overview' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column Area (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Upcoming Sessions */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center"><Video className="w-5 h-5 mr-2 text-primary-light" /> Upcoming Sessions</h2>
              </div>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map(session => {
                    const mentor = mentors.find(m => m.id === session.mentorId);
                    const date = parseISO(session.scheduledAt);
                    return (
                      <div key={session.id} className="bg-surface border border-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-white/20">
                        <div className="flex items-center gap-4">
                          <img src={mentor.avatar} alt={mentor.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <h4 className="font-bold text-white">{mentor.name}</h4>
                            <p className="text-sm text-text-muted">{session.type} • {format(date, 'MMM d, h:mm a')}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2">
                          <Badge variant="primary" className="w-max">in 2 days</Badge>
                          <a href={session.meetLink} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" className="bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 w-full sm:w-auto">
                              <Play className="w-4 h-4 mr-2" /> Join Meeting
                            </Button>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-panel border border-dashed border-border rounded-2xl p-8 text-center">
                  <p className="text-text-muted mb-4">You have no upcoming sessions.</p>
                  <Link to="/mentors"><Button size="sm">Find a Mentor</Button></Link>
                </div>
              )}
            </section>

            {/* Recommended Mentors */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center"><Award className="w-5 h-5 mr-2 text-secondary" /> Recommended for You</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {recommendedMentors.map(mentor => (
                  <MentorCard key={mentor.id} mentor={mentor} variant="compact" />
                ))}
              </div>
            </section>

            {/* Past Sessions */}
            <section>
               <h2 className="text-xl font-bold mb-4">Past Sessions</h2>
               <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm text-gray-300">
                     <thead className="bg-panel/50 text-text-muted text-xs uppercase">
                       <tr>
                         <th className="px-6 py-4 font-medium">Mentor</th>
                         <th className="px-6 py-4 font-medium">Type</th>
                         <th className="px-6 py-4 font-medium">Date</th>
                         <th className="px-6 py-4 font-medium">Status</th>
                         <th className="px-6 py-4 font-medium">Rating</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                       {pastSessions.map(session => {
                         const mentor = mentors.find(m => m.id === session.mentorId);
                         return (
                           <tr key={session.id} className="hover:bg-white/5 transition-colors">
                             <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                               <img src={mentor.avatar} alt="" className="w-8 h-8 rounded-full" />
                               {mentor.name}
                             </td>
                             <td className="px-6 py-4">{session.type}</td>
                             <td className="px-6 py-4">{format(parseISO(session.scheduledAt), 'MMM d, yyyy')}</td>
                             <td className="px-6 py-4">
                               <Badge status={session.status}>{session.status}</Badge>
                             </td>
                             <td className="px-6 py-4">
                               {session.rating ? (
                                 <div className="flex text-yellow-500 font-bold"><Flame className="w-4 h-4 mr-1 fill-current" /> {session.rating}</div>
                               ) : (
                                 <Link to={`/session/${session.id}/feedback`} className="text-primary-light hover:text-white underline text-xs">Rate</Link>
                               )}
                             </td>
                           </tr>
                         )
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
            </section>

          </div>

          {/* Right Column Area (1/3 width) */}
          <div className="flex flex-col gap-6">
            
            {/* Goal Tracker Sidebar Card */}
            <section className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2"><Target className="w-5 h-5 text-primary-light" /> Learning Tasks</h2>
              </div>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Track your assigned tasks, milestones, and submit proof of completion to your mentor.
              </p>
              <Button size="sm" variant="secondary" fullWidth onClick={() => setActiveTab('goals')}>
                View My Tasks <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </section>

            {/* SOCIAL Card */}
            <section className="bg-surface border border-border rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">📢 SOCIAL</h2>
              </div>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Stay updated with technical articles, career insights, and posts shared by followed mentors.
              </p>
              <Link to="/feed" className="w-full">
                <Button size="sm" variant="secondary" fullWidth>
                  Open SOCIAL <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </section>

            {/* Community Forum Card */}
            <section className="bg-surface border border-border rounded-3xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">💬 Community Forum</h2>
              </div>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Got stuck on a coding bug or need career advice? Engage with our network of expert mentors.
              </p>
              <div className="flex flex-col gap-2">
                <Link to="/forum/create" className="w-full">
                  <Button size="sm" variant="primary" fullWidth>
                    Ask a Question
                  </Button>
                </Link>
                <Link to="/forum" className="w-full">
                  <Button size="sm" variant="ghost" fullWidth>
                    Explore Forum <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </section>

          </div>

        </div>
      ) : (
        <MenteeGoalDashboard />
      )}
    </div>
  );
}
