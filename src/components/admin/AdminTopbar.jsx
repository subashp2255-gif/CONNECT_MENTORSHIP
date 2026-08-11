import { useState } from 'react';
import { Menu, Search, Bell, ChevronDown, User, LogOut, ShieldAlert } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function AdminTopbar({ onMenuToggle, activeTab }) {
  const { currentUser, logout, reports } = useStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const pendingReportsCount = reports.filter(r => r.status === 'Open' || r.status === 'Under Review').length;

  const getTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard Overview';
      case 'users': return 'User Management';
      case 'approvals': return 'Mentor Application Approvals';
      case 'reports': return 'Reported Items Queue';
      case 'requests': return 'Mentorship Session Requests';
      case 'sessions': return 'Session Activity Monitor';
      case 'stats': return 'System Performance & Statistics';
      case 'reviews': return 'Student Reviews & Feedback';
      case 'audit': return 'Administrative Audit Logs';
      default: return 'CONNECT Admin';
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Title & Mobile Toggle */}
      <div className="flex items-center gap-4">
        <button 
          className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white lg:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-white tracking-wide hidden sm:block">
          {getTitle()}
        </h1>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-4 relative">
        
        {/* Search */}
        <div className="relative w-48 sm:w-60 md:w-72 hidden md:block">
          <Search className="w-4 h-4 text-text-dim absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dashboard..."
            className="w-full bg-panel border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-text-dim focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        {/* Notifications (Reports Warning) */}
        <div className="relative">
          <button 
            className="p-2 rounded-xl bg-panel border border-border hover:bg-white/5 text-text-muted hover:text-white transition-all relative"
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
          >
            <Bell className="w-4 h-4" />
            {pendingReportsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-surface animate-bounce">
                {pendingReportsCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-scaleUp">
              <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-panel">
                <span className="font-bold text-white text-xs">Alerts & System Reports</span>
                <span className="text-[10px] text-text-dim font-medium">{pendingReportsCount} unresolved</span>
              </div>
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {pendingReportsCount > 0 ? (
                  reports.filter(r => r.status === 'Open' || r.status === 'Under Review').map(r => (
                    <div key={r.id} className="p-3 border-b border-border/40 hover:bg-white/5 flex gap-2.5 items-start text-left cursor-pointer transition-colors">
                      <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">Report flag: {r.reason}</p>
                        <p className="text-[10px] text-text-muted mt-0.5 line-clamp-2">{r.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-text-dim text-xs">
                    All clear! No pending reports.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile popover */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 p-1 px-2.5 rounded-xl bg-panel border border-border hover:bg-white/5 transition-all text-left"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary-light uppercase">
              {currentUser?.name?.slice(0, 2) || 'AD'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[100px]">{currentUser?.name || 'Administrator'}</p>
              <p className="text-[9px] text-text-dim font-medium leading-none mt-0.5">Admin Account</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-scaleUp">
              <div className="px-4 py-2.5 border-b border-border">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                <p className="text-[10px] text-text-dim truncate">{currentUser?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2.5 hover:bg-red-500/10 text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-2.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
