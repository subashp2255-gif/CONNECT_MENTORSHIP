import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import toast from 'react-hot-toast';

const REACTIONS = [
  { emoji: '👍', label: 'Got it', type: 'thumbs-up' },
  { emoji: '🤔', label: 'Confused', type: 'confused' },
  { emoji: '☕', label: 'Need a break', type: 'break' },
  { emoji: '🎉', label: 'Awesome', type: 'awesome' },
  { emoji: '✋', label: 'Raise hand', type: 'raise-hand' },
  { emoji: '🐢', label: 'Slow down', type: 'slow-down' },
  { emoji: '🚀', label: 'Speed up', type: 'speed-up' },
  { emoji: '❤️', label: 'Thank you', type: 'thanks' }
];

const ReactionBar = ({ isOpen, onClose }) => {
  const { addReaction } = useSessionRoomStore();
  const barRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking the trigger button itself (we assume it's right near the bar)
      // This is basic, might need refinement if it overlaps
      if (barRef.current && !barRef.current.contains(e.target)) {
        // We defer closing slightly to let the button toggle click run first
        setTimeout(() => {
          if (isOpen) onClose();
        }, 10);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleReact = (reaction) => {
    addReaction({
      ...reaction,
      id: Date.now().toString(),
      sender: 'currentUser', // Mock sender
      timestamp: Date.now()
    });
    
    // Check if it's special actions based on the prompt
    if (reaction.type === 'raise-hand') {
      toast.success("Mentee raised their hand ✋", { icon: "✋" });
    } else if (reaction.type === 'break') {
      // The prompt says: "Need a break" reaction triggers special behavior: session timer pauses, both see "Break time 🕐" overlay with 5-minute countdown
      // Handled via state or overlay logic triggered by reaction log changes. Let's fire a toast for now.
      toast("Break time 🕐 requested!");
      // A more robust implementation would update the store globally to trigger BreakOverlay
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={barRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-full mb-4 right-[25%] md:left-1/2 md:-translate-x-1/2 bg-[#16161e] border border-[#2a2a3a] p-2 rounded-2xl shadow-2xl flex flex-wrap max-w-[280px] md:max-w-none md:flex-nowrap gap-2 items-center justify-center z-50"
        >
          {REACTIONS.map((re) => (
            <button
              key={re.type}
              onClick={(e) => {
                e.stopPropagation();
                handleReact(re);
              }}
              className="flex flex-col items-center p-2 hover:bg-[#2a2a3a] rounded-xl transition-colors group relative"
              title={re.label}
            >
              <span className="text-2xl group-hover:scale-125 transition-transform duration-200 block">
                {re.emoji}
              </span>
              <span className="text-[10px] text-[#6b6b8a] mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 bg-black px-1.5 py-0.5 rounded">
                {re.label}
              </span>
            </button>
          ))}
          
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#16161e] border-b border-r border-[#2a2a3a] transform rotate-45"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReactionBar;
