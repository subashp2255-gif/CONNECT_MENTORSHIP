import { useState, useMemo } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle, Ban, Trash2, Eye, RefreshCw, XCircle } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function UserTable({ users, onBlock, onUnblock, onSuspend, onDelete, onViewDetails }) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || 
        user.name.toLowerCase().includes(q) || 
        user.email.toLowerCase().includes(q) || 
        user.id.toLowerCase().includes(q);
      
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // Paginated chunk
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'suspended': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'blocked': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'deleted': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-text-dim/10 text-text-dim border-border';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Filters row */}
      <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            icon={Search}
            className="h-10 sm:text-xs rounded-xl"
          />

          <Select
            value={roleFilter}
            onChange={val => { setRoleFilter(val); setCurrentPage(1); }}
            size="sm"
            className="h-10 text-xs"
            placeholder="Filter by Role"
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'mentee', label: 'Mentees' },
              { value: 'mentor', label: 'Mentors' },
              { value: 'admin', label: 'Administrators' }
            ]}
          />

          <Select
            value={statusFilter}
            onChange={val => { setStatusFilter(val); setCurrentPage(1); }}
            size="sm"
            className="h-10 text-xs"
            placeholder="Filter by Status"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'blocked', label: 'Blocked' },
              { value: 'deleted', label: 'Deleted' }
            ]}
          />

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); setCurrentPage(1); }}
            className="h-10 text-xs flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </Button>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-panel text-text-dim text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-sm">
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=7c3aed&color=fff`} 
                          alt={user.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-border bg-panel" 
                        />
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-text-muted mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${user.role === 'admin' ? 'bg-primary/20 text-primary-light border border-primary/30' : user.role === 'mentor' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStatusColor(user.accountStatus)}`}>
                        {user.accountStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-muted">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'July 1, 2026'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onViewDetails(user)}
                          title="View user details & activity"
                          className="p-2 rounded-xl bg-panel hover:bg-white/5 border border-border text-text-muted hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {user.role !== 'admin' && (
                          <>
                            {user.accountStatus === 'blocked' ? (
                              <button
                                onClick={() => onUnblock(user.id)}
                                title="Unblock User"
                                className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => onBlock(user.id)}
                                title="Block User"
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            )}

                            {user.accountStatus !== 'suspended' && user.accountStatus !== 'blocked' && (
                              <button
                                onClick={() => onSuspend(user.id)}
                                title="Suspend User"
                                className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition-colors"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}

                            {user.accountStatus !== 'deleted' && (
                              <button
                                onClick={() => onDelete(user.id)}
                                title="Delete User"
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-dim">
                    No users matched your search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border/40 bg-panel flex items-center justify-between">
            <span className="text-xs text-text-dim">
              Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
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
