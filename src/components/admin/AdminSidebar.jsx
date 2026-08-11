import { LayoutDashboard, Users, UserCheck, AlertTriangle, MessageSquareCode, CalendarRange, BarChart3, Star, ScrollText, Settings, LogOut, X, MessagesSquare } from 'lucide-react';

export default function AdminSidebar({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'approvals', label: 'Mentor Approvals', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
    { id: 'forum', label: 'Forum Management', icon: MessagesSquare },
    { id: 'requests', label: 'Mentorship Requests', icon: MessageSquareCode },
    { id: 'sessions', label: 'Active Sessions', icon: CalendarRange },
    { id: 'stats', label: 'Platform Statistics', icon: BarChart3 },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
    { id: 'audit', label: 'Audit Logs', icon: ScrollText }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-surface border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:h-screen shrink-0`}>
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <div className="flex items-center gap-2.5">
            <img 
              src={`${import.meta.env.BASE_URL || '/'}logo.png`} 
              alt="CONNECT" 
              className="w-8 h-8 object-contain" 
            />
            <span className="font-extrabold text-white text-lg tracking-wider">CONNECT <span className="text-[10px] text-primary-light font-bold bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded ml-1">ADMIN</span></span>
          </div>
          <button 
            className="p-1 rounded-lg hover:bg-white/5 text-text-muted hover:text-white lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-border mt-auto">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>

      </aside>
    </>
  );
}
