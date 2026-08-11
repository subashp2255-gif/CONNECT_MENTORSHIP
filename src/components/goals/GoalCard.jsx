import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Play, Edit, Trash2, Pause, PlayCircle } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { useStore } from '../../store/useStore';
import GoalStatusBadge from './GoalStatusBadge';
import PriorityBadge from './PriorityBadge';
import GoalProgressBar from './GoalProgressBar';
import Button from '../ui/Button';

export default function GoalCard({ goal, tasks = [], onDeleteClick, onPauseClick, onResumeClick }) {
  const { currentUser, role: userRole, mentors, mentorList } = useStore();
  
  // Find mentor / mentee details
  const isMentor = userRole === 'mentor';
  const displayId = isMentor ? goal.menteeId : goal.mentorId;
  
  // Mentees list is loaded, let's search in mentees list
  const { fetchMentors } = useStore();
  const allMentees = useStore((state) => state.currentUser?.id?.startsWith('m') ? state.sessions.map(s => s.menteeId) : []);
  
  // Let's import mock mentees and mentors from mockData if needed, or read from useStore.
  // Actually, we can get list of all users or sessions. In mockData.js we have:
  // mentors and mentees
  const allMentors = useStore((state) => state.mentorList);
  // To be safe, we can import from '../../data/mockData' directly as a fallback
  const mockMentees = [
    { id: "u1", name: "Ravi Kumar", avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=111118&color=fff" },
    { id: "u2", name: "Sita Mahalakshmi", avatar: "https://ui-avatars.com/api/?name=Sita+Mahalakshmi&background=111118&color=fff" },
    { id: "u3", name: "Aryan Bose", avatar: "https://ui-avatars.com/api/?name=Aryan+Bose&background=111118&color=fff" },
    { id: "u4", name: "Meera Rajput", avatar: "https://ui-avatars.com/api/?name=Meera+Rajput&background=111118&color=fff" },
    { id: "u5", name: "Kabir Singh", avatar: "https://ui-avatars.com/api/?name=Kabir+Singh&background=111118&color=fff" },
    { id: "u6", name: "Pooja Hegde", avatar: "https://ui-avatars.com/api/?name=Pooja+Hegde&background=111118&color=fff" },
    { id: "u7", name: "Dhruv Rathi", avatar: "https://ui-avatars.com/api/?name=Dhruv+Rathi&background=111118&color=fff" },
    { id: "u8", name: "Anjali Sharma", avatar: "https://ui-avatars.com/api/?name=Anjali+Sharma&background=111118&color=fff" },
    { id: "u9", name: "Kushal Tandon", avatar: "https://ui-avatars.com/api/?name=Kushal+Tandon&background=111118&color=fff" },
    { id: "u10", name: "Naina Mathur", avatar: "https://ui-avatars.com/api/?name=Naina+Mathur&background=111118&color=fff" }
  ];
  
  const partnerUser = isMentor 
    ? (mockMentees.find(m => m.id === goal.menteeId) || { name: 'Mentee' })
    : (allMentors.find(m => m.id === goal.mentorId) || { name: 'Mentor' });

  // Deadline logic
  const now = new Date();
  const deadlineDate = parseISO(goal.targetDate);
  const daysRemaining = differenceInDays(deadlineDate, now);
  
  let deadlineLabel = '';
  let deadlineClass = 'text-text-muted';
  
  if (goal.status === 'Completed') {
    deadlineLabel = 'Completed';
    deadlineClass = 'text-green-400 font-medium';
  } else if (now > deadlineDate) {
    deadlineLabel = 'Overdue';
    deadlineClass = 'text-red-400 font-medium animate-pulse';
  } else if (daysRemaining <= 7 && daysRemaining >= 0) {
    deadlineLabel = `Due Soon (${daysRemaining}d)`;
    deadlineClass = 'text-orange-400 font-medium';
  } else {
    deadlineLabel = `Due in ${daysRemaining} days`;
    deadlineClass = 'text-text-muted';
  }

  // Calculate task counts
  const approvedTasksCount = tasks.filter(t => t.status === 'Approved').length;

  return (
    <div className="bg-surface border border-border rounded-3xl p-6 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between shadow-lg h-full note-card-glow">
      <div>
        {/* Card Header: Badges & Partner */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex items-center gap-2">
            <GoalStatusBadge status={goal.status} />
            <PriorityBadge priority={goal.priority} />
          </div>
          <div className="flex items-center gap-2">
            <img 
              src={partnerUser.avatar || `https://ui-avatars.com/api/?name=${partnerUser.name}&background=random`} 
              alt={partnerUser.name} 
              className="w-6 h-6 rounded-full object-cover border border-white/10" 
            />
            <span className="text-xs text-text-muted truncate max-w-[100px]">{partnerUser.name}</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{goal.title}</h3>
        <p className="text-sm text-text-muted mb-6 line-clamp-2 leading-relaxed">{goal.description || 'No description provided.'}</p>
      </div>

      <div>
        {/* Progress Section */}
        <div className="mb-6">
          <GoalProgressBar 
            progress={goal.progress} 
            totalTasks={tasks.length} 
            approvedTasks={approvedTasksCount}
            size="sm" 
          />
        </div>

        {/* Info & Footer Actions */}
        <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto">
          {/* Deadline */}
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-text-dim" />
            <span className={deadlineClass}>
              {format(deadlineDate, 'dd MMM yyyy')} ({deadlineLabel})
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {isMentor ? (
              <>
                <button
                  onClick={() => goal.isPaused ? onResumeClick(goal.id) : onPauseClick(goal.id)}
                  title={goal.isPaused ? 'Resume Task' : 'Pause Task'}
                  className="p-2 rounded-xl bg-panel hover:bg-white/5 border border-border text-text-muted hover:text-white transition-colors"
                >
                  {goal.isPaused ? <PlayCircle className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-orange-400" />}
                </button>
                <button
                  onClick={() => onDeleteClick(goal.id)}
                  title="Delete Task"
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link to={`/goals/${goal.id}`}>
                  <Button size="sm" variant="secondary">
                    Review
                  </Button>
                </Link>
              </>
            ) : (
              <Link to={`/goals/${goal.id}`}>
                <Button size="sm" variant="primary" className="h-8 py-0 px-3 text-xs">
                  {goal.status === 'Not Started' ? 'Start Task' : 'Continue'} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
