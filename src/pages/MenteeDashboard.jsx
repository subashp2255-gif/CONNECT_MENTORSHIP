import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Video, Award, Target, Flame, ArrowRight, Play, Edit2, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useStore } from '../store/useStore';
import { sessions, mentors, mentees } from '../data/mockData';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';
import MentorCard from '../components/shared/MentorCard';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';

export default function MenteeDashboard() {
  const { isLoggedIn, currentUser, role } = useStore();
  const [goals, setGoals] = useState([
    { id: 1, title: 'Master React Fundamentals', progress: 80 },
    { id: 2, title: 'Complete 5 Mock Interviews', progress: 40 },
    { id: 3, title: 'Build Full Stack Project', progress: 15 },
  ]);

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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        <StatCard label="Sessions Completed" value={pastSessions.length} icon={Video} trend="up" trendValue={12} />
        <StatCard label="Mentors Connected" value={new Set(pastSessions.map(s => s.mentorId)).size} icon={Award} />
        <StatCard label="Goals Achieved" value="2" icon={Target} />
        <StatCard label="Day Streak" value="5" icon={Flame} />
      </div>

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
        <div className="flex flex-col gap-8">
          
          {/* Goal Tracker */}
          <section className="bg-surface border border-border rounded-3xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center"><Target className="w-5 h-5 mr-2 text-primary" /> Goal Tracker</h2>
              <button className="p-1.5 bg-panel hover:bg-white/10 rounded-lg text-gray-400 transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-6">
              {goals.map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{goal.title}</span>
                    <span className="text-xs font-bold text-primary-light">{goal.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-panel rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-brand rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2 border border-dashed border-border text-sm text-text-muted hover:text-white hover:border-white/30 rounded-xl transition-all flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" /> Manage Goals
            </button>
          </section>

        </div>

      </div>
    </div>
  );
}
