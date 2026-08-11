import { useState, useMemo } from 'react';
import { Search, ShieldAlert, CheckCircle, RefreshCw, Eye, MessageSquare } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function ReportTable({ reports, users, onSelectReport }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        r.reason.toLowerCase().includes(q) || 
        r.description.toLowerCase().includes(q) || 
        r.reporterId.toLowerCase().includes(q) ||
        r.reportedUserId.toLowerCase().includes(q);
      
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : userId;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Under Review': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Resolved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Dismissed': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-text-dim/10 text-text-dim border-border';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Filters */}
      <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
        <div className="grid sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search reports by reason, details..."
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
            placeholder="Filter by Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Open', label: 'Open' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Resolved', label: 'Resolved' },
              { value: 'Dismissed', label: 'Dismissed' }
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

      {/* Reports Table */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-text-dim text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Reporter</th>
                <th className="px-6 py-4">Accused / Reported</th>
                <th className="px-6 py-4">Reason / Violation</th>
                <th className="px-6 py-4">Target Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Inspect Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {filteredReports.length > 0 ? (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{getUserName(report.reporterId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {report.reporterId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{getUserName(report.reportedUserId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {report.reportedUserId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{report.reason}</p>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1 max-w-[200px]">{report.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 bg-panel border border-border/60 text-[11px] font-semibold text-white rounded-lg px-2.5 py-1 uppercase tracking-wider">
                        {report.targetType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border tracking-wider ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onSelectReport(report)}
                        className="text-xs font-semibold px-4 flex items-center gap-1.5 justify-center ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-dim">
                    No reports matched your selection criteria.
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
