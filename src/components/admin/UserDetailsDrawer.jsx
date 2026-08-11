import { X, ShieldAlert, Calendar, Mail, FileText, CheckCircle2, UserX } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function UserDetailsDrawer({ user, onClose }) {
  const { sessions, reports } = useStore();

  if (!user) return null;

  // Find sessions involving this user
  const userSessions = sessions.filter(s => s.mentorId === user.id || s.menteeId === user.id);

  // Find reports involving this user (either as reporter or reported user)
  const relatedReports = reports.filter(r => r.reporterId === user.id || r.reportedUserId === user.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      
      {/* Drawer Overlay */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Box */}
      <div className="relative w-full max-w-xl bg-surface border-l border-border h-full flex flex-col shadow-2xl animate-slideLeft z-10">
        
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-panel">
          <span className="font-bold text-white text-base">User Inspection Details</span>
          <button 
            className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Profile Details Card */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-panel border border-border rounded-2xl">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff`} 
              alt={user.name} 
              className="w-16 h-16 rounded-2xl object-cover border border-border" 
            />
            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className="text-xl font-extrabold text-white truncate">{user.name}</h3>
              <p className="text-xs text-text-muted truncate mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-primary/20 text-primary-light border border-primary/20 px-2 py-0.5 rounded-full">
                  {user.role}
                </span>
                <span className={`text-[10px] font-bold tracking-wider uppercase border px-2 py-0.5 rounded-full ${user.accountStatus === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                  {user.accountStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Academic & Details */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-text-dim">Academic & Work Details</h4>
            <div className="grid sm:grid-cols-2 gap-4 bg-panel border border-border/50 rounded-2xl p-4 text-xs">
              <div>
                <p className="text-text-muted font-medium">Institution / College</p>
                <p className="text-white font-semibold mt-1">{user.college || 'Not Provided'}</p>
              </div>
              <div>
                <p className="text-text-muted font-medium">Branch / Department</p>
                <p className="text-white font-semibold mt-1">{user.branch || 'Not Provided'}</p>
              </div>
              {user.role === 'mentor' ? (
                <>
                  <div>
                    <p className="text-text-muted font-medium">Current Company</p>
                    <p className="text-white font-semibold mt-1">{user.company || 'Not Provided'}</p>
                  </div>
                  <div>
                    <p className="text-text-muted font-medium">Professional Title</p>
                    <p className="text-white font-semibold mt-1">{user.jobRole || 'Not Provided'}</p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="text-text-muted font-medium">Academic Year</p>
                  <p className="text-white font-semibold mt-1">{user.year || 'Not Provided'}</p>
                </div>
              )}
            </div>
          </div>

          {/* User Active Mentorship Sessions */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-text-dim">Mentorship Sessions ({userSessions.length})</h4>
            <div className="space-y-2">
              {userSessions.length > 0 ? (
                userSessions.slice(0, 5).map(session => (
                  <div key={session.id} className="flex justify-between items-center bg-panel border border-border/40 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary-light" />
                      <div>
                        <p className="text-xs font-semibold text-white">{session.type}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">
                          {new Date(session.scheduledAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${session.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : session.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                      {session.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted py-2">No session records found for this user.</p>
              )}
            </div>
          </div>

          {/* User Flagged Reports */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-text-dim">Flagged Reports Involving User ({relatedReports.length})</h4>
            <div className="space-y-2">
              {relatedReports.length > 0 ? (
                relatedReports.map(report => {
                  const isReporter = report.reporterId === user.id;
                  return (
                    <div key={report.id} className="bg-panel border border-border/40 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between items-start">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold border px-2 py-0.5 rounded-full uppercase ${isReporter ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {isReporter ? 'Reporter' : 'Accused'}
                        </span>
                        <span className={`text-[10px] font-medium text-text-muted`}>
                          Status: {report.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white mt-1">Reason: {report.reason}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{report.description}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-text-muted py-2">No reports recorded involving this user.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
