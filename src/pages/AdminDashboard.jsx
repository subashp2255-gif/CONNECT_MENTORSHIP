import { useState, useMemo, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, AlertTriangle, MessageSquareCode, CalendarRange, 
  BarChart3, Star, ScrollText, CheckCircle2, Ban, Layers, RefreshCw,
  Clock, ShieldAlert, Award, FileText, Settings, Sparkles, UserCheck2
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useStore } from '../store/useStore';
import StatCard from '../components/shared/StatCard';
import Button from '../components/ui/Button';

// Admin components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import UserTable from '../components/admin/UserTable';
import UserDetailsDrawer from '../components/admin/UserDetailsDrawer';
import MentorApprovalTable from '../components/admin/MentorApprovalTable';
import MentorApplicationModal from '../components/admin/MentorApplicationModal';
import ReportTable from '../components/admin/ReportTable';
import ReportDetailsModal from '../components/admin/ReportDetailsModal';
import SessionMonitorTable from '../components/admin/SessionMonitorTable';
import MentorshipRequestTable from '../components/admin/MentorshipRequestTable';
import AuditLogTable from '../components/admin/AuditLogTable';
import BlockUserDialog from '../components/admin/BlockUserDialog';
import DeleteUserDialog from '../components/admin/DeleteUserDialog';
import AdminForumDashboard from '../components/admin/AdminForumDashboard';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { 
    isLoggedIn, role, currentUser, logout,
    users, reports, sessions, auditLogs, goals,
    blockUser, unblockUser, suspendUser, deleteUser,
    approveMentor, rejectMentor, resolveReport, dismissReport, cancelSessionAdmin
  } = useStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Inspection drawer/modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  // Dialog triggers
  const [blockUserId, setBlockUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Ensure security checks: redirect if not admin
  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;
  if (role !== 'admin' || currentUser?.role !== 'admin') return <Navigate to="/login" replace />;

  // Calculate dynamic dashboard stats from Zustand store collections
  const stats = useMemo(() => {
    const totalU = users.length;
    const mentorsCount = users.filter(u => u.role === 'mentor').length;
    const menteesCount = users.filter(u => u.role === 'mentee').length;
    
    const pendingAppr = users.filter(u => u.role === 'mentor' && u.approvalStatus === 'Pending').length;
    const activeSess = sessions.filter(s => s.status === 'upcoming' || s.status === 'in_progress').length;
    const completedSess = sessions.filter(s => s.status === 'completed').length;
    const activeMentorshipsCount = users.filter(u => u.role === 'mentor' && u.approvalStatus === 'Approved').length; // Sim status

    const openRep = reports.filter(r => r.status === 'Open' || r.status === 'Under Review').length;
    const blockedCount = users.filter(u => u.accountStatus === 'blocked').length;
    const goalsCount = goals.length;

    return { 
      totalU, mentorsCount, menteesCount, pendingAppr, 
      activeSess, completedSess, openRep, blockedCount, goalsCount, activeMentorshipsCount
    };
  }, [users, sessions, reports, goals]);

  // Handle operations wrappers
  const handleBlockUser = (userId, reason) => {
    try {
      blockUser(userId, reason);
      toast.success('User blocked successfully.');
      setBlockUserId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUnblockUser = (userId) => {
    try {
      unblockUser(userId);
      toast.success('User account unlocked.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSuspendUser = (userId) => {
    const reason = prompt('Enter suspension reason:');
    if (reason && reason.trim()) {
      try {
        suspendUser(userId, reason.trim());
        toast.success('User account suspended.');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleDeleteUser = (userId, reason) => {
    try {
      deleteUser(userId, reason);
      toast.success('User soft deleted.');
      setDeleteUserId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApproveMentor = (mentorId) => {
    try {
      approveMentor(mentorId);
      toast.success('Mentor application approved.');
      setSelectedApplication(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRejectMentor = (mentorId, reason) => {
    try {
      rejectMentor(mentorId, reason);
      toast.success('Mentor application rejected.');
      setSelectedApplication(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResolveReport = (reportId, notes) => {
    try {
      resolveReport(reportId, notes);
      toast.success('Report resolved successfully.');
      setSelectedReport(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDismissReport = (reportId, notes) => {
    try {
      dismissReport(reportId, notes);
      toast.success('Report dismissed.');
      setSelectedReport(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancelSession = (sessionId, reason) => {
    try {
      cancelSessionAdmin(sessionId, reason);
      toast.success('Session cancelled by Administrator.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Administrator session logged out.');
    navigate('/admin/login');
  };

  const recentRegistrations = users.slice(0, 4);
  const pendingApplications = users.filter(u => u.role === 'mentor' && u.approvalStatus === 'Pending').slice(0, 3);
  const activeReviewReports = reports.filter(r => r.status === 'Open' || r.status === 'Under Review').slice(0, 3);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      
      {/* Sidebar Drawer */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Console Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        
        {/* Top navigation */}
        <AdminTopbar
          activeTab={activeTab}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />

        {/* Content canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                  <StatCard label="Total Users" value={stats.totalU} icon={Users} accentColor="#7c6ff7" iconBg="rgba(124,111,247,0.12)" iconColor="#a78bfa" progress={100} />
                  <StatCard label="Active Sessions" value={stats.activeSess} icon={CalendarRange} accentColor="#378ADD" iconBg="rgba(55,138,221,0.12)" iconColor="#60a5fa" progress={100} />
                  <StatCard label="Pending Approvals" value={stats.pendingAppr} icon={UserCheck} accentColor="#f59e0b" iconBg="rgba(245,158,11,0.12)" iconColor="#fbbf24" progress={100} />
                  <StatCard label="Open Reports" value={stats.openRep} icon={AlertTriangle} accentColor="#ef4444" iconBg="rgba(239,68,68,0.12)" iconColor="#f87171" progress={100} />
                  <StatCard label="Blocked Users" value={stats.blockedCount} icon={Ban} accentColor="#a3a3a3" iconBg="rgba(163,163,163,0.12)" iconColor="#d4d4d4" progress={100} />
                </div>

                {/* Main overview grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                  
                  {/* Left Column (2/3 width) - Recent Activity & Actions */}
                  <div className="lg:col-span-2 space-y-8">
                    
                    {/* Mentor approval queue preview */}
                    <section className="bg-surface border border-border rounded-3xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-base flex items-center gap-2">
                          <UserCheck2 className="w-5 h-5 text-primary-light" /> Mentor Approval Queue
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('approvals')} className="text-xs">
                          View All
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {pendingApplications.length > 0 ? (
                          pendingApplications.map(app => (
                            <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-panel border border-border/50 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <img src={app.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-border" />
                                <div>
                                  <p className="text-sm font-bold text-white">{app.name}</p>
                                  <p className="text-xs text-text-muted mt-0.5">{app.email}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setSelectedApplication(app)}>
                                  Review
                                </Button>
                                <Button size="sm" variant="primary" className="text-xs" onClick={() => handleApproveMentor(app.id)}>
                                  Approve
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-text-dim text-center py-6">All applications resolved. No pending queue.</p>
                        )}
                      </div>
                    </section>

                    {/* Reported queues preview */}
                    <section className="bg-surface border border-border rounded-3xl p-6 shadow-xl">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white text-base flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-red-400" /> Pending Flagged Reports
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('reports')} className="text-xs">
                          View All
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        {activeReviewReports.length > 0 ? (
                          activeReviewReports.map(rep => (
                            <div key={rep.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-4 bg-panel border border-border/50 rounded-2xl">
                              <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-bold uppercase">
                                    {rep.reason}
                                  </span>
                                  <span className="text-[10px] text-text-dim">target: {rep.targetType}</span>
                                </div>
                                <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{rep.description}</p>
                              </div>
                              <Button size="sm" variant="secondary" className="text-xs shrink-0 sm:self-center" onClick={() => setSelectedReport(rep)}>
                                Inspect
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-text-dim text-center py-6">All flagged reports resolved.</p>
                        )}
                      </div>
                    </section>

                  </div>

                  {/* Right Column (1/3 width) - Quick lists */}
                  <div className="space-y-8">
                    
                    {/* Recent registrations */}
                    <section className="bg-surface border border-border rounded-3xl p-6 shadow-xl">
                      <h3 className="font-bold text-white text-base mb-5">Recent Signups</h3>
                      <div className="space-y-4">
                        {recentRegistrations.map(u => (
                          <div key={u.id} className="flex items-center gap-3">
                            <img 
                              src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=7c3aed&color=fff`} 
                              alt="" 
                              className="w-9 h-9 rounded-xl object-cover border border-border" 
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-white truncate">{u.name}</p>
                              <p className="text-[10px] text-text-dim mt-0.5 truncate uppercase">{u.role}</p>
                            </div>
                            <span className="text-[9px] text-text-dim bg-panel px-2 py-0.5 rounded-lg border border-border/40">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'July 1'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Stats mini grid */}
                    <section className="bg-surface border border-border rounded-3xl p-6 shadow-xl space-y-4">
                      <h3 className="font-bold text-white text-base">Metrics Monitor</h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-panel border border-border/40 p-3.5 rounded-2xl text-center">
                          <p className="text-text-dim font-medium">Mentees</p>
                          <p className="text-xl font-extrabold text-white mt-1">{stats.menteesCount}</p>
                        </div>
                        <div className="bg-panel border border-border/40 p-3.5 rounded-2xl text-center">
                          <p className="text-text-dim font-medium">Mentors</p>
                          <p className="text-xl font-extrabold text-white mt-1">{stats.mentorsCount}</p>
                        </div>
                        <div className="bg-panel border border-border/40 p-3.5 rounded-2xl text-center">
                          <p className="text-text-dim font-medium">Completed</p>
                          <p className="text-xl font-extrabold text-white mt-1">{stats.completedSess}</p>
                        </div>
                        <div className="bg-panel border border-border/40 p-3.5 rounded-2xl text-center">
                          <p className="text-text-dim font-medium">Total Goals</p>
                          <p className="text-xl font-extrabold text-white mt-1">{stats.goalsCount}</p>
                        </div>
                      </div>
                    </section>

                  </div>

                </div>

              </motion.div>
            )}

            {/* USERS PANEL */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <UserTable
                  users={users}
                  onBlock={setBlockUserId}
                  onUnblock={handleUnblockUser}
                  onSuspend={handleSuspendUser}
                  onDelete={setDeleteUserId}
                  onViewDetails={setSelectedUser}
                />
              </motion.div>
            )}

            {/* MENTOR APPROVALS PANEL */}
            {activeTab === 'approvals' && (
              <motion.div key="approvals" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <MentorApprovalTable
                  users={users}
                  onSelectApplication={setSelectedApplication}
                />
              </motion.div>
            )}

            {/* REPORTS PANEL */}
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ReportTable
                  reports={reports}
                  users={users}
                  onSelectReport={setSelectedReport}
                />
              </motion.div>
            )}

            {/* MENTORSHIP REQUESTS */}
            {activeTab === 'requests' && (
              <motion.div key="requests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <MentorshipRequestTable
                  sessions={sessions}
                  users={users}
                  onCancelRequest={handleCancelSession}
                />
              </motion.div>
            )}

            {/* SESSIONS PANEL */}
            {activeTab === 'sessions' && (
              <motion.div key="sessions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <SessionMonitorTable
                  sessions={sessions}
                  users={users}
                  onCancelSession={handleCancelSession}
                />
              </motion.div>
            )}

            {/* STATS PANEL */}
            {activeTab === 'stats' && (
              <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xl">
                <BarChart3 className="w-16 h-16 text-primary-light mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Platform Statistics Analytics</h3>
                <p className="text-text-muted max-w-md mx-auto text-xs leading-relaxed mb-6">
                  Aggregate chart metrics representing system signups, session conversion percentages, active reports, and user categories.
                </p>
                <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto text-left text-xs mt-8">
                  <div className="bg-panel border border-border/50 p-5 rounded-2xl">
                    <p className="text-text-dim font-bold">Request Acceptance Rate</p>
                    <p className="text-2xl font-extrabold text-white mt-1.5">84.2%</p>
                  </div>
                  <div className="bg-panel border border-border/50 p-5 rounded-2xl">
                    <p className="text-text-dim font-bold">Daily Active Users</p>
                    <p className="text-2xl font-extrabold text-white mt-1.5">142</p>
                  </div>
                  <div className="bg-panel border border-border/50 p-5 rounded-2xl">
                    <p className="text-text-dim font-bold">Average Mentor Rating</p>
                    <p className="text-2xl font-extrabold text-white mt-1.5">4.85 ★</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* REVIEWS & FEEDBACK PANEL */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-surface border border-border rounded-3xl p-8 text-center shadow-xl">
                <Star className="w-16 h-16 text-primary-light mx-auto mb-6 animate-pulse" />
                <h3 className="text-xl font-bold text-white mb-2">Feedback & Review Moderation</h3>
                <p className="text-text-muted max-w-md mx-auto text-xs leading-relaxed">
                  Review student ratings and manage reported reviews. Users have not reported any feedback reviews as inappropriate.
                </p>
              </motion.div>
            )}

            {/* AUDIT LOGS PANEL */}
            {activeTab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AuditLogTable
                  logs={auditLogs}
                  users={users}
                />
              </motion.div>
            )}

            {/* FORUM PANEL */}
            {activeTab === 'forum' && (
              <motion.div key="forum" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminForumDashboard />
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>

      {/* DRAWERS & DIALOG MODALS CONTAINER */}
      
      {/* User Inspection Details Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailsDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>

      {/* Mentor Application Details Modal */}
      {selectedApplication && (
        <MentorApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onApprove={handleApproveMentor}
          onReject={handleRejectMentor}
        />
      )}

      {/* Report details inspector Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          users={users}
          onClose={() => setSelectedReport(null)}
          onResolve={handleResolveReport}
          onDismiss={handleDismissReport}
        />
      )}

      {/* Block Confirm Modal */}
      <BlockUserDialog
        isOpen={Boolean(blockUserId)}
        userId={blockUserId}
        onClose={() => setBlockUserId(null)}
        onConfirm={handleBlockUser}
      />

      {/* Delete Confirm Modal */}
      <DeleteUserDialog
        isOpen={Boolean(deleteUserId)}
        userId={deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
      />

    </div>
  );
}
