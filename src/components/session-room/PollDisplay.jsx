import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';
import useSessionRoomStore from '../../stores/sessionRoomStore';

const PollDisplay = () => {
  const { activePoll, votePoll } = useSessionRoomStore();
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Reset state when new poll starts
    if (activePoll) {
      setHasVoted(false);
      if (activePoll.timeLimit) {
        setTimeLeft(activePoll.timeLimit);
      } else {
        setTimeLeft(0);
      }
    }
  }, [activePoll?.id]);

  useEffect(() => {
    if (!activePoll || !activePoll.timeLimit || hasVoted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activePoll, hasVoted, timeLeft]);

  // Auto-close simulated mentee view if time runs out and hasn't voted
  // For mock, we'll just disable buttons and say time's up.

  if (!activePoll) return null;

  const handleVote = (optionId) => {
    votePoll(optionId);
    setHasVoted(true);
  };

  const progressPercentage = activePoll.timeLimit
    ? (timeLeft / activePoll.timeLimit) * 100
    : 100;

  return (
    <AnimatePresence>
      <motion.div
        key={activePoll.id}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute inset-0 z-40 bg-[#16161e] flex flex-col pt-12"
      >
        {/* Time Progress Bar */}
        {activePoll.timeLimit > 0 && !hasVoted && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2a2a3a]">
            <motion.div 
              className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-[#7c3aed]'}`}
              style={{ width: `${progressPercentage}%` }}
              layout
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
          
          {hasVoted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-brand font-bold text-white mb-2">Response Submitted</h2>
              <p className="text-[#6b6b8a]">Waiting for the mentor to close the poll...</p>
            </motion.div>
          ) : (
             <div className="w-full max-w-sm mx-auto">
               
               {/* Header indicator */}
               <div className="flex items-center justify-between mb-6">
                 <span className="text-xs font-bold uppercase tracking-widest text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full">
                   Active Poll
                 </span>
                 {activePoll.timeLimit > 0 && (
                   <span className={`text-sm font-mono flex items-center ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-[#6b6b8a]'}`}>
                     <Clock className="w-4 h-4 mr-1.5" /> 00:{timeLeft.toString().padStart(2, '0')}
                   </span>
                 )}
               </div>

               <h2 className="text-2xl font-medium text-white mb-8 leading-snug">
                 {activePoll.question}
               </h2>

               <div className="space-y-3">
                 {activePoll.options.map((opt) => (
                   <button
                     key={opt.id}
                     onClick={() => handleVote(opt.id)}
                     disabled={timeLeft === 0 && activePoll.timeLimit > 0}
                     className="w-full text-left bg-[#1a1a24] hover:bg-[#2a2a3a] border border-[#2a2a3a] hover:border-[#7c3aed]/50 text-white p-4 rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                   >
                     {opt.text}
                   </button>
                 ))}
               </div>
               
               {timeLeft === 0 && activePoll.timeLimit > 0 && (
                 <p className="text-center text-red-400 mt-6 font-medium">Time is up!</p>
               )}
             </div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PollDisplay;
