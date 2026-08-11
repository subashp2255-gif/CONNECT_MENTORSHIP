import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';
import { useStore } from '../../store/useStore';

const routes = [
  { label: 'Home', path: '/' },
  { label: 'Find Mentors', path: '/mentors' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Mentor Dashboard', path: '/mentor/dashboard' },
  { label: 'Messages', path: '/messages' },
  { label: 'Login', path: '/login' },
  { label: 'Register', path: '/register' },
  { label: 'Onboarding', path: '/onboarding' }
];

export default function CommandPalette() {
  const navigate = useNavigate();
  const location = useLocation();
  const { commandPaletteOpen, setCommandPaletteOpen, role } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (event.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  useEffect(() => {
    setQuery('');
  }, [commandPaletteOpen]);

  const filteredRoutes = useMemo(
    () => routes
      .filter((route) => route.label.toLowerCase().includes(query.toLowerCase()))
      .filter((route) => role === 'mentor' ? route.label !== 'Find Mentors' : true),
    [query, role]
  );

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm px-4 pt-24" onClick={() => setCommandPaletteOpen(false)}>
      <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 border-b border-border">
          <Command className="w-4 h-4 text-text-dim" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a page..."
            className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-text-dim"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredRoutes.map((route) => (
            <button
              key={route.path}
              type="button"
              onClick={() => {
                navigate(route.path);
                setCommandPaletteOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                location.pathname === route.path ? 'bg-primary/20 text-primary-light' : 'text-gray-300 hover:bg-panel hover:text-white'
              }`}
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
