import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import TopBar from '../../components/session-room/TopBar';
import VideoArea from '../../components/session-room/VideoArea';
import BottomControlBar from '../../components/session-room/BottomControlBar';
import RightPanel from '../../components/session-room/RightPanel';
import ReactionAnimation from '../../components/session-room/ReactionAnimation';
import BreakOverlay from '../../components/session-room/BreakOverlay';

const SessionRoom = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { initSession, endSession, isActive, isRecording } = useSessionRoomStore();

  useEffect(() => {
    initSession(sessionId);
    return () => {
      // We don't automatically end session on unmount here
      // End session is explicitly triggered via BottomControlBar
    };
  }, [sessionId, initSession]);

  if (!isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f] text-white">
        <div className="animate-pulse">Joining session...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0f] text-white overflow-hidden font-body">
      {/* Absolute Overlays */}
      <ReactionAnimation />
      <BreakOverlay />

      {/* Top Bar */}
      <TopBar sessionId={sessionId} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Video Area */}
        <div className="flex-1 relative border-r border-[#2a2a3a]">
          <VideoArea />
        </div>

        {/* Right Active Panel */}
        <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 border-l border-[#2a2a3a] bg-[#16161e]">
           <RightPanel />
        </div>
      </div>

      {/* Bottom Control Bar */}
      <BottomControlBar sessionId={sessionId} />
    </div>
  );
};

export default SessionRoom;
