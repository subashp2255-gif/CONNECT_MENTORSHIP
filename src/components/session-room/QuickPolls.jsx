import React from 'react';
import { Zap } from 'lucide-react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import toast from 'react-hot-toast';

const PRESET_POLLS = [
  {
    question: "Do you understand this concept?",
    options: ["Yes", "Mostly", "Need more explanation"]
  },
  {
    question: "Pace check",
    options: ["Too fast", "Just right", "Too slow"]
  },
  {
    question: "Ready to move on?",
    options: ["Yes", "Give me a moment"]
  },
  {
    question: "How are you feeling?",
    options: ["Great", "Good", "Confused", "Overwhelmed"]
  }
];

const QuickPolls = () => {
  const { setActivePoll, activePoll } = useSessionRoomStore();

  const handleLaunch = (preset) => {
    if (activePoll) {
      toast.error("A poll is already active");
      return;
    }
    
    // Create actual poll object
    const poll = {
      id: `poll-${Date.now()}`,
      question: preset.question,
      options: preset.options.map((opt, i) => ({ id: `opt-${i}`, text: opt, count: 0 })),
      totalVotes: 0,
      timestamp: Date.now(),
      timeLimit: 0 // Optional: can be hardcoded to like 60s for quick polls if wanted
    };

    setActivePoll(poll);
    toast.success("Poll launched");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center text-white font-medium mb-3">
        <Zap className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" />
        Quick Polls
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {PRESET_POLLS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleLaunch(preset)}
            disabled={!!activePoll}
            className="text-left bg-[#1a1a24] hover:bg-[#2a2a3a] border border-[#2a2a3a] p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <p className="text-sm font-medium text-white mb-1 group-hover:text-[#f472b6] transition-colors">{preset.question}</p>
            <p className="text-xs text-[#6b6b8a] truncate">
              {preset.options.join(' • ')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPolls;
