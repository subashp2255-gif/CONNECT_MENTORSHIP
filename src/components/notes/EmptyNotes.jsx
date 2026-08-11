import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function EmptyNotes() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {/* SVG Empty State Illustration */}
      <svg
        width="200"
        height="180"
        viewBox="0 0 200 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-8"
      >
        {/* Notebook */}
        <rect x="40" y="20" width="120" height="150" rx="8" fill="#16161e" stroke="#2a2a3a" strokeWidth="2" />
        <rect x="40" y="20" width="15" height="150" rx="4" fill="#111118" stroke="#2a2a3a" strokeWidth="1" />
        {/* Spiral rings */}
        {[40, 60, 80, 100, 120, 140].map((y) => (
          <circle key={y} cx="55" cy={y} r="4" fill="#0a0a0f" stroke="#2a2a3a" strokeWidth="1.5" />
        ))}
        {/* Lines */}
        <line x1="70" y1="50" x2="140" y2="50" stroke="#2a2a3a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="70" x2="130" y2="70" stroke="#2a2a3a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="90" x2="145" y2="90" stroke="#2a2a3a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="70" y1="110" x2="120" y2="110" stroke="#2a2a3a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Pen */}
        <g transform="translate(130, 130) rotate(-30)">
          <rect x="0" y="0" width="6" height="50" rx="2" fill="#7c3aed" />
          <polygon points="0,50 6,50 3,60" fill="#f472b6" />
          <rect x="0" y="0" width="6" height="8" rx="2" fill="#a78bfa" />
        </g>
        {/* Sparkles */}
        <circle cx="170" cy="30" r="2" fill="#7c3aed" opacity="0.6">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="30" cy="50" r="1.5" fill="#f472b6" opacity="0.5">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="175" cy="80" r="1.5" fill="#a78bfa" opacity="0.4">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="text-center max-w-md">
        <h3 className="text-xl font-bold text-white mb-2">No notes yet</h3>
        <p className="text-text-muted text-sm leading-relaxed">
          Your session notes will appear here. Start a mentorship session and take notes to keep track
          of your progress, action items, and key takeaways.
        </p>
      </div>
    </motion.div>
  );
}
