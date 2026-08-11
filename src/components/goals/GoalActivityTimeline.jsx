import { 
  Target, Play, FileText, CheckCircle2, AlertTriangle, 
  MessageSquare, Award, Pause, PlayCircle, Calendar, User 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../../store/useStore';

const ACTIVITY_MAP = {
  create: { icon: Target, bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  start: { icon: Play, bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  submit: { icon: FileText, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  resubmit: { icon: FileText, bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  approve: { icon: CheckCircle2, bg: 'bg-green-500/10 text-green-400 border-green-500/30' },
  reject: { icon: AlertTriangle, bg: 'bg-red-500/10 text-red-400 border-red-500/30' },
  feedback: { icon: MessageSquare, bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  complete: { icon: Award, bg: 'bg-amber-500/15 text-yellow-300 border-yellow-500/40 shadow-[0_0_12px_rgba(251,191,36,0.15)]' },
  pause: { icon: Pause, bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  resume: { icon: PlayCircle, bg: 'bg-violet-500/10 text-violet-400 border-violet-500/30' },
  edit_deadline: { icon: Calendar, bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' }
};

export default function GoalActivityTimeline({ activities = [] }) {
  const { currentUser, role } = useStore();

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="flow-root">
      {sortedActivities.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-4">No recent activity logged.</p>
      ) : (
        <ul className="-mb-8">
          {sortedActivities.map((activity, idx) => {
            const config = ACTIVITY_MAP[activity.activityType] || { icon: User, bg: 'bg-gray-500/10 text-gray-400 border-gray-500/30' };
            const Icon = config.icon;
            
            return (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {idx !== sortedActivities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 ${config.bg}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-200">
                          {activity.message}
                        </p>
                      </div>
                      <div className="text-right text-xs whitespace-nowrap text-text-dim pt-0.5">
                        <time dateTime={activity.createdAt}>
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
