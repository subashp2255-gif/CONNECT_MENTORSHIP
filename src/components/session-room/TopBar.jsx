import React from 'react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import SessionTimer from './SessionTimer';

const TopBar = ({ sessionId }) => {
  const { isRecording } = useSessionRoomStore();

  return (
    <div className="h-14 bg-[#0a0a0f] border-b border-[#2a2a3a] flex items-center justify-between px-4 shrink-0 z-10 w-full relative">
      {/* Session Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-brand font-bold text-white">Mentorship Session</h1>
        <span className="text-xs bg-[#2a2a3a] text-[#6b6b8a] px-2 py-0.5 rounded font-mono">
          {sessionId?.substring(0, 8)}
        </span>
      </div>

      {/* Center: Recording Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
        {isRecording && (
          <div className="flex items-center space-x-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-xs font-bold text-red-500 tracking-wider">REC</span>
          </div>
        )}
      </div>

      {/* Right: Timers */}
      <div className="flex items-center">
        <SessionTimer />
      </div>
    </div>
  );
};

export default TopBar;
