import React, { useEffect, useState } from 'react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import { BarChart2, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Generic results view for both active and historic polls
const PollResultsView = ({ poll, isHistory = false }) => {
  const totalVotes = poll.totalVotes || 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-white leading-snug">{poll.question}</h3>
      <p className="text-xs text-[#6b6b8a] uppercase tracking-wider font-bold">
        {totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'} Total
      </p>

      <div className="space-y-3 mt-4">
        {poll.options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.count / totalVotes) * 100) : 0;
          return (
            <div key={opt.id} className="relative">
              {/* Info row */}
              <div className="flex justify-between text-sm mb-1.5 relative z-10 px-1 text-white">
                <span className="font-medium drop-shadow-md">{opt.text}</span>
                <span className="font-mono opacity-80">{opt.count} ({percentage}%)</span>
              </div>
              
              {/* Progress Bar Track */}
              <div className="h-10 w-full bg-[#111118] border border-[#2a2a3a] rounded-lg overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute top-0 left-0 bottom-0 bg-[#7c3aed]/30 border-r-2 border-[#7c3aed]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PollResults = () => {
  const { activePoll, pollHistory, clearActivePoll, addPollToHistory } = useSessionRoomStore();

  const handleEndPoll = () => {
    if (activePoll) {
      addPollToHistory({ ...activePoll, status: 'completed' });
      clearActivePoll();
    }
  };

  // If there's an active poll, show its live results
  if (activePoll) {
    return (
      <div className="bg-[#1a1a24] border border-[#7c3aed]/30 p-5 rounded-xl space-y-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 p-3 flex -space-x-1">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse border border-[#1a1a24] z-10" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400 absolute animate-ping z-0" />
        </div>

        <div className="flex items-center text-green-400 font-medium text-sm">
          <BarChart2 className="w-4 h-4 mr-2" /> Live Poll Results
        </div>
        
        <PollResultsView poll={activePoll} />

        <button 
          onClick={handleEndPoll}
          className="w-full py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg font-medium transition-colors"
        >
          End Poll
        </button>
      </div>
    );
  }

  // Otherwise, show the poll history section in the tab
  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center text-white font-medium px-4">
        <CheckCircle2 className="w-5 h-5 text-green-400 mr-2" />
        Past Poll Results
      </div>

      {pollHistory.length === 0 ? (
        <div className="text-center p-8 text-[#6b6b8a]">
          <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No polls have been completed yet.</p>
        </div>
      ) : (
        <div className="space-y-4 px-4 pb-6">
          {pollHistory.map((poll) => (
            <div key={poll.id} className="bg-[#1a1a24] border border-[#2a2a3a] p-4 rounded-xl shadow-sm">
              <PollResultsView poll={poll} isHistory={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PollResults;
