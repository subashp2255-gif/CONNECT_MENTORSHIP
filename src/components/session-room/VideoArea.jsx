import React, { useState, useEffect } from 'react';
import VideoTile from './VideoTile';
import ScreenShareOverlay from './ScreenShareOverlay';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import { motion, AnimatePresence } from 'framer-motion';

const VideoArea = () => {
  const { isScreenSharing, isCamOff, isMuted } = useSessionRoomStore();
  const [partnerJoined, setPartnerJoined] = useState(false);

  // Simulate partner joining after 3 seconds for mock demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setPartnerJoined(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Mock speaking state based on generic random timer
  const [mentorSpeaking, setMentorSpeaking] = useState(false);
  const [menteeSpeaking, setMenteeSpeaking] = useState(false);

  useEffect(() => {
    if (!partnerJoined) return;
    const interval = setInterval(() => {
      const isMentor = Math.random() > 0.5;
      if (isMentor) {
        setMentorSpeaking(true);
        setTimeout(() => setMentorSpeaking(false), 2000 + Math.random() * 2000);
      } else {
        setMenteeSpeaking(true);
        setTimeout(() => setMenteeSpeaking(false), 1500 + Math.random() * 1500);
      }
    }, 5000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [partnerJoined]);

  // Determine layouts
  const showWaiting = !partnerJoined;
  
  return (
    <div className="w-full h-full relative bg-[#0a0a0f] flex items-center justify-center overflow-hidden">
      
      {/* 
        Main Area Layout
      */}
      <AnimatePresence mode="wait">
        {showWaiting ? (
          <motion.div
            key="waiting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center p-6"
          >
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-[#7c3aed]/20 rounded-full animate-ping"></div>
              <div className="absolute inset-0 bg-[#7c3aed]/40 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-[#16161e] border border-[#2a2a3a] rounded-full flex items-center justify-center z-10">
                <span className="text-2xl text-white font-brand">S</span>
              </div>
            </div>
            <h2 className="text-xl font-medium text-white mb-2">Waiting for Sarah to join...</h2>
            <p className="text-[#6b6b8a]">The session will start automatically when they arrive.</p>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full relative"
          >
            {/* Screen Share Overlay (takes up main area if active) */}
            <ScreenShareOverlay isActive={isScreenSharing} />

            {/* Main large tile (Mentor typically, or mentee if mentor is PiP)
                When screen sharing, this is hidden or covered by ScreenShareOverlay
             */}
            {!isScreenSharing && (
              <div className="absolute inset-4 lg:inset-8 rounded-2xl overflow-hidden shadow-2xl">
                <VideoTile 
                  name="Sarah (Mentor)"
                  initials="SM"
                  size="large"
                  isSpeaking={mentorSpeaking}
                />
              </div>
            )}

            {/* Picture-in-Picture small tile (Mentee typically) 
                When screen sharing, the speaker moves here, but we'll mock it by keeping you (mentee) here 
            */}
            <motion.div 
              layout
              className={`
                absolute transition-all duration-500 ease-in-out z-20
                ${isScreenSharing ? 'bottom-8 right-8' : 'bottom-8 right-8 lg:bottom-12 lg:right-12'}
              `}
            >
              <VideoTile 
                name="You (Mentee)"
                initials="YM"
                size="small"
                isLocal={true}
                isMuted={isMuted}
                isCamOff={isCamOff}
                isSpeaking={menteeSpeaking && !isMuted}
              />
            </motion.div>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Share Banner */}
      <AnimatePresence>
        {isScreenSharing && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-4 bg-black/80 backdrop-blur-md border border-[#2a2a3a] px-6 py-3 rounded-full shadow-2xl"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-sm font-medium">You are sharing your screen</span>
            </div>
            <div className="w-px h-4 bg-[#2a2a3a]"></div>
            <button 
              onClick={() => useSessionRoomStore.getState().toggleScreenShare()}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
            >
              Stop Sharing
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoArea;
