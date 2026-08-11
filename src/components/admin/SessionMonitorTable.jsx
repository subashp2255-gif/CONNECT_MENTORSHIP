import { useState, useMemo } from 'react';
import { Search, Calendar, Video, ShieldAlert, CheckCircle, RefreshCw, XCircle, Play } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function SessionMonitorTable({ sessions, users, onCancelSession }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const q = search.toLowerCase().trim();
      const mentorName = users.find(u => u.id === s.mentorId)?.name || '';
      const menteeName = users.find(u => u.id === s.menteeId)?.name || '';
      
      const matchesSearch = !q || 
        s.type.toLowerCase().includes(q) || 
        s.id.toLowerCase().includes(q) ||
        mentorName.toLowerCase().includes(q) ||
        menteeName.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, users, search, statusFilter]);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'upcoming': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-text-dim/10 text-text-dim border-border';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Status Filters */}
      <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search by ID, topic, or user..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={Search}
            className="h-10 text-xs rounded-xl"
          />

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            size="sm"
            className="h-10 text-xs"
            placeholder="Filter Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'pending', label: 'Pending Request' }
            ]}
          />

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSearch(''); setStatusFilter('all'); }}
            className="h-10 text-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </Button>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-text-dim text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Session Info</th>
                <th className="px-6 py-4">Mentor</th>
                <th className="px-6 py-4">Mentee</th>
                <th className="px-6 py-4">Scheduled Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <tr key={session.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Video className="w-4 h-4 text-primary-light shrink-0" />
                        <div>
                          <p className="font-semibold text-white">{session.type}</p>
                          <p className="text-[10px] text-text-dim mt-0.5">ID: {session.id} | {session.duration} mins</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{getUserName(session.mentorId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {session.mentorId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{getUserName(session.menteeId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {session.menteeId}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-dim" />
                        <span>{new Date(session.scheduledAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {['upcoming', 'pending'].includes(session.status) && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            const reason = prompt('Enter reason for admin session cancellation:');
                            if (reason && reason.trim()) {
                              onCancelSession(session.id, reason.trim());
                            }
                          }}
                          className="text-xs font-semibold px-3 py-1 flex items-center gap-1 ml-auto"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Session
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-dim">
                    No sessions matched your criteria.
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
