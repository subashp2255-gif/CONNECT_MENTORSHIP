import React, { useState, useEffect } from 'react';
import { MicOff, Signal } from 'lucide-react';

const VideoTile = ({ name, initials, size = 'large', isMuted = false, isSpeaking = false, isLocal = false }) => {
  // Simulated connection quality
  const [quality, setQuality] = useState(3);

  useEffect(() => {
    // Randomly fluctuate connection quality for mock
    if (Math.random() > 0.8) {
      setQuality(Math.floor(Math.random() * 3) + 1);
      setTimeout(() => setQuality(3), 5000);
    }
  }, []);

  const sizeClasses = {
    large: 'w-full h-full',
    small: 'w-36 h-48 md:w-48 md:h-64 rounded-xl shadow-2xl border border-[#2a2a3a]'
  };

  return (
    <div className={`relative bg-[#111118] overflow-hidden ${sizeClasses[size]}`}>
      {/* Mock Video Gradient Background (simulating user camera) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] animate-pulse-slow">
        {/* Animated Avatar */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`
            flex items-center justify-center rounded-full bg-[#7c3aed]/20 text-white font-brand font-bold
            ${size === 'large' ? 'w-32 h-32 text-4xl' : 'w-16 h-16 text-xl'}
            ${isSpeaking ? 'ring-4 ring-[#7c3aed] animate-pulse' : ''}
            transition-all duration-300
          `}>
            {initials}
          </div>
        </div>
      </div>

      {/* Speaking Indicator Outline */}
      {isSpeaking && (
        <div className="absolute inset-0 border-4 border-[#7c3aed] transition-all duration-300 pointer-events-none rounded-inherit"></div>
      )}

      {/* Name and Status Overlays */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        {/* Name Label */}
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center space-x-2 border border-white/5 shadow-sm">
          <span className={`text-white font-medium ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
            {name}
            {isLocal && ' (You)'}
          </span>
        </div>

        {/* Status Icons */}
        <div className="flex flex-col items-center space-y-2">
          {/* Connection Quality */}
          <div className="bg-black/60 backdrop-blur-md p-1.5 rounded shadow-sm border border-white/5 flex items-end space-x-0.5" title={`Connection: ${quality}/3`}>
            <div className={`w-1 h-2 rounded-sm ${quality >= 1 ? 'bg-green-500' : 'bg-[#2a2a3a]'}`}></div>
            <div className={`w-1 h-3 rounded-sm ${quality >= 2 ? 'bg-green-500' : 'bg-[#2a2a3a]'}`}></div>
            <div className={`w-1 h-4 rounded-sm ${quality >= 3 ? 'bg-green-500' : 'bg-[#2a2a3a]'}`}></div>
          </div>
          
          {/* Mic Status */}
          {isMuted && (
            <div className="bg-red-500 p-1.5 rounded-full shadow-sm text-white border border-red-400">
              <MicOff className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoTile;
