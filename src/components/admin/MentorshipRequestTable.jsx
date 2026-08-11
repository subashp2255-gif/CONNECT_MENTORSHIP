import { useState, useMemo } from 'react';
import { Search, ShieldAlert, XCircle, Mail, MessageSquare } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function MentorshipRequestTable({ sessions, users, onCancelRequest }) {
  const [search, setSearch] = useState('');

  // Pending session requests
  const requestSessions = useMemo(() => {
    return sessions.filter(s => s.status === 'pending');
  }, [sessions]);

  const filteredRequests = useMemo(() => {
    return requestSessions.filter(s => {
      const q = search.toLowerCase().trim();
      const mentorName = users.find(u => u.id === s.mentorId)?.name || '';
      const menteeName = users.find(u => u.id === s.menteeId)?.name || '';
      return !q || 
        s.type.toLowerCase().includes(q) || 
        mentorName.toLowerCase().includes(q) || 
        menteeName.toLowerCase().includes(q);
    });
  }, [requestSessions, users, search]);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  return (
    <div className="space-y-6">
      
      {/* Search Filter Bar */}
      <div className="bg-surface border border-border rounded-3xl p-5">
        <div className="max-w-md">
          <Input
            placeholder="Search pending requests by mentor, mentee, or topic..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={Search}
            className="h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-text-dim text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Topic / Request Details</th>
                <th className="px-6 py-4">Mentee (Sender)</th>
                <th className="px-6 py-4">Mentor (Receiver)</th>
                <th className="px-6 py-4">Requested Date</th>
                <th className="px-6 py-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(req => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2.5">
                        <MessageSquare className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-white">{req.type}</p>
                          <p className="text-xs text-text-muted mt-1 leading-relaxed">
                            {req.message || 'No additional message submitted.'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{getUserName(req.menteeId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {req.menteeId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{getUserName(req.mentorId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {req.mentorId}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      {req.scheduledAt ? new Date(req.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pending'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          const reason = prompt('Enter reason for request cancellation (e.g. Spam/Abusive):');
                          if (reason && reason.trim()) {
                            onCancelRequest(req.id, reason.trim());
                          }
                        }}
                        className="text-xs font-semibold px-3 py-1 flex items-center gap-1 ml-auto"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Request
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-dim">
                    No pending mentorship requests found in queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
