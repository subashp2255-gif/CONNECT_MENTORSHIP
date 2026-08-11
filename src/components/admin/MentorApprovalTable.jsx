import { useState, useMemo } from 'react';
import { Search, ShieldCheck, UserCheck, UserX, Clock, Calendar } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function MentorApprovalTable({ users, onSelectApplication }) {
  const [search, setSearch] = useState('');

  // Get mentors with 'Pending' approval status
  const pendingMentors = useMemo(() => {
    return users.filter(user => 
      user.role === 'mentor' && 
      user.approvalStatus === 'Pending'
    );
  }, [users]);

  const filteredApplications = useMemo(() => {
    return pendingMentors.filter(app => {
      const q = search.toLowerCase().trim();
      return !q || 
        app.name.toLowerCase().includes(q) || 
        app.email.toLowerCase().includes(q) || 
        (app.company && app.company.toLowerCase().includes(q)) ||
        (app.college && app.college.toLowerCase().includes(q));
    });
  }, [pendingMentors, search]);

  return (
    <div className="space-y-6">
      
      {/* Search Filter Bar */}
      <div className="bg-surface border border-border rounded-3xl p-5">
        <div className="max-w-md">
          <Input
            placeholder="Search applications by name, skill, or college..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={Search}
            className="h-10 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Grid of Applications */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-text-dim text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Professional Title</th>
                <th className="px-6 py-4">Institution / College</th>
                <th className="px-6 py-4">Submission Date</th>
                <th className="px-6 py-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {filteredApplications.length > 0 ? (
                filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={app.avatar} 
                          alt={app.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-border" 
                        />
                        <div>
                          <p className="font-semibold text-white">{app.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{app.jobRole || 'SDE'}</p>
                      <p className="text-xs text-text-muted mt-0.5">{app.company || 'Tech Company'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{app.college}</p>
                      <p className="text-xs text-text-muted mt-0.5">{app.branch}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-dim" />
                        <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onSelectApplication(app)}
                        className="text-xs font-semibold px-4"
                      >
                        Review Profile
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-dim">
                    {search ? 'No applications matched your search terms.' : 'No pending mentor applications in queue.'}
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
