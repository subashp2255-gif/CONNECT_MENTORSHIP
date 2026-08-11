import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSessionRoomStore from '../../stores/sessionRoomStore';

const ReactionAnimation = () => {
  const reactionLog = useSessionRoomStore(state => state.reactionLog);
  const [activeAnimations, setActiveAnimations] = useState([]);

  useEffect(() => {
    if (reactionLog.length === 0) return;
    
    // Gets the newest reaction
    const latestReaction = reactionLog[0];
    
    // Add to active animations if it's very recent (within last second to avoid showing stale ones on mount)
    if (Date.now() - latestReaction.timestamp < 1000) {
      const newAnim = {
        id: `${latestReaction.id}-${Date.now()}`,
        emoji: latestReaction.emoji,
        // Random starting x position near the center/sender video tile
        // For mock, we just pop them up from bottom middle area loosely
        left: 30 + Math.random() * 40 // %
      };

      setActiveAnimations(prev => [...prev, newAnim]);

      // Remove after animation completes (3s)
      setTimeout(() => {
        setActiveAnimations(prev => prev.filter(a => a.id !== newAnim.id));
      }, 3000);
    }
  }, [reactionLog]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {activeAnimations.map(anim => (
          <motion.div
            key={anim.id}
            initial={{ opacity: 0, y: '80vh', scale: 0.5, x: '-50%' }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              y: '20vh', 
              scale: [0.5, 2, 2, 1],
              x: '-50%'
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2.5, 
              ease: 'easeOut',
            }}
            style={{ left: `${anim.left}%` }}
            className="absolute text-5xl md:text-7xl filter drop-shadow-xl"
          >
            {anim.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ReactionAnimation;
