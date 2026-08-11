import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, ChevronDown, LogOut, BookOpen, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';
import Button from '../ui/Button';
import NotificationBell from '../mentorship/NotificationBell';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isLoggedIn, currentUser, role, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [];
  if (role !== 'mentor') {
    navLinks.push({ name: 'Find Mentors', href: '/mentors' });
  }
  navLinks.push({ name: 'Discussion Forum', href: '/forum' });

  if (isLoggedIn) {
    navLinks.push({ name: 'SOCIAL', href: '/feed' });
    if (role === 'mentee') {
      navLinks.push({ name: 'Following Mentors', href: '/following-mentors' });
    }
    navLinks.push({ name: 'Dashboard', href: role === 'mentor' ? '/mentor/dashboard' : '/dashboard' });
    navLinks.push({ name: 'Tasks', href: role === 'mentor' ? '/mentor/dashboard?tab=goals' : '/dashboard?tab=goals' });
    navLinks.push({ name: 'Notes', href: '/notes', icon: BookOpen });
  }

  return (
    <nav className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-surface/80 backdrop-blur-lg border-b border-border shadow-lg' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ rotate: 20, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              style={{ display: 'inline-block' }}
            >
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="Connect" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
                style={{ 
                  animation: 'navGlow 3s ease-in-out infinite'
                }}
              />
            </motion.div>
            <span 
              className="font-mono text-base font-semibold tracking-widest"
              style={{ 
                background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              CONNECT
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.href) && link.href !== '/' || location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors relative py-2',
                    isActive ? 'text-primary-light' : 'text-gray-300 hover:text-white'
                  )}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fadeUp" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth/Profile */}
          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/messages" className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <NotificationBell />
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-border bg-panel hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random`} alt="Avatar" className="w-8 h-8 rounded-full bg-surface" />
                    <span className="text-sm font-medium text-white max-w-[100px] truncate">{currentUser?.name || 'User'}</span>
                    <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform duration-200", isProfileDropdownOpen && "rotate-180")} />
                  </button>
                  
                  <AnimatePresence>
                    {isProfileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-[#16161e] border border-border rounded-xl shadow-xl overflow-hidden origin-top-right z-50"
                      >
                        <div className="p-4 border-b border-border">
                          <p className="text-sm font-medium text-white truncate">{currentUser?.name || 'User'}</p>
                          <p className="text-xs text-text-muted truncate capitalize">{role}</p>
                        </div>
                        <div className="p-2 bg-panel/30">
                          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                            <LogOut className="w-4 h-4" />
                            Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-surface border-b border-border shadow-2xl animate-fadeUp">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'block px-4 py-3 rounded-xl text-base font-medium',
                  location.pathname === link.href ? 'bg-primary/20 text-primary-light' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <hr className="border-border my-4" />
            
            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-4 px-4">
                <Link to="/login"><Button variant="outline" fullWidth>Log in</Button></Link>
                <Link to="/register"><Button variant="primary" fullWidth>Sign up</Button></Link>
              </div>
            ) : (
              <div className="px-4 space-y-4">
                <div className="flex items-center gap-3">
                  <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random`} alt="Avatar" className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="text-base font-medium text-white">{currentUser?.name || 'User'}</p>
                    <p className="text-sm text-text-muted capitalize">{role}</p>
                  </div>
                </div>
                <Button variant="danger" fullWidth onClick={handleLogout}>
                  Log out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
