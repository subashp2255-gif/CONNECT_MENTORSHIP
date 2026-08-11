import React from 'react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee } from 'lucide-react';

const BreakOverlay = () => {
  // Mock break state. In a real app we'd track this in Zustand store (e.g. isBreakTime)
  // For the prompt's sake, we'll assume there's a 5-minute timer whenever "Need a break" is triggered.
  // We'll leave it hidden by default or expose a mock state.
  
  // Since we haven't added `isBreakTime` to the store yet, let's just make it return null
  // unless we want it fully functional via store later.
  const isBreakTime = false; // Mock disabled for now unless added later to store

  if (!isBreakTime) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md"
      >
        <div className="text-center">
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 mx-auto mb-8 bg-[#7c3aed]/20 rounded-full flex items-center justify-center text-[#7c3aed]"
          >
            <Coffee className="w-12 h-12" />
          </motion.div>
          <h1 className="text-4xl font-brand font-bold text-white mb-4">Break Time 🕐</h1>
          {/* Mock countdown for 5 minutes */}
          <div className="text-6xl font-mono font-bold text-[#f472b6] mb-8">
            05:00
          </div>
          <p className="text-[#6b6b8a] mb-8">Take a moment to stretch and hydrate.</p>
          <button className="px-6 py-3 bg-[#2a2a3a] hover:bg-[#323246] text-white rounded-xl font-medium transition-colors">
            End Break Early
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BreakOverlay;
