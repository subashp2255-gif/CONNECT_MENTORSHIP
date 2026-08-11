import { useState, useMemo } from 'react';
import { Search, Calendar, RefreshCw, Layers } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AuditLogTable({ logs, users }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const q = search.toLowerCase().trim();
      const adminName = users.find(u => u.id === log.adminId)?.name || '';
      return !q || 
        log.actionType.toLowerCase().includes(q) || 
        log.targetType.toLowerCase().includes(q) || 
        log.reason.toLowerCase().includes(q) ||
        adminName.toLowerCase().includes(q);
    });
  }, [logs, users, search]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  const getAdminName = (adminId) => {
    const user = users.find(u => u.id === adminId);
    return user ? user.name : adminId;
  };

  const getActionClass = (type) => {
    if (type.includes('block') || type.includes('reject') || type.includes('delete')) return 'text-red-400 font-bold';
    if (type.includes('approve') || type.includes('resolve')) return 'text-green-400 font-bold';
    return 'text-amber-400 font-bold';
  };

  return (
    <div className="space-y-6">
      
      {/* Filters */}
      <div className="bg-surface border border-border rounded-3xl p-5">
        <div className="flex gap-4 max-w-md">
          <Input
            placeholder="Search audit trail by type, reason, or admin..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            icon={Search}
            className="h-10 text-xs rounded-xl"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSearch(''); setCurrentPage(1); }}
            className="h-10 text-xs flex items-center justify-center shrink-0 px-4"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-text-dim text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target (ID)</th>
                <th className="px-6 py-4">Reason / Notes</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">{getAdminName(log.adminId)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {log.adminId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs uppercase ${getActionClass(log.actionType)}`}>
                        {log.actionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{log.targetType}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">ID: {log.targetId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-text-muted leading-relaxed max-w-xs">{log.reason || 'No reason provided.'}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-dim" />
                        <span>{new Date(log.createdAt).toLocaleString('en-US')}</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-dim">
                    No administrative audit records logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border/40 bg-panel flex items-center justify-between">
            <span className="text-xs text-text-dim">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-xs"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
