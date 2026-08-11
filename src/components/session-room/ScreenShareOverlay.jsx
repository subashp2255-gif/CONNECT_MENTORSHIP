import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScreenShareOverlay = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 z-10 bg-[#0a0a0f] flex flex-col items-center justify-center p-8 overflow-hidden"
        >
          {/* Mock Screen Content */}
          <div className="w-full max-w-5xl aspect-video bg-[#16161e] border border-[#2a2a3a] rounded-2xl shadow-2xl overflow-hidden relative group">
            
            {/* Fake OS Top Bar */}
            <div className="h-8 bg-[#2a2a3a]/50 border-b border-[#2a2a3a] flex items-center px-4 space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="flex-1 text-center text-[10px] text-[#6b6b8a] font-mono tracking-widest pl-8">
                VS_CODE_PROJECT_CONNECT
              </div>
            </div>

            {/* Fake Code Content */}
            <div className="p-6 font-mono text-sm space-y-2 opacity-50 relative z-0">
              <p className="text-purple-400"><span className="text-pink-400">import</span> React <span className="text-pink-400">from</span> 'react';</p>
              <p className="text-purple-400"><span className="text-pink-400">import</span> useSessionRoomStore <span className="text-pink-400">from</span> '../../stores/sessionRoomStore';</p>
              <br/>
              <p><span className="text-blue-400">const</span> <span className="text-yellow-200">SessionRoom</span> = () <span className="text-blue-400">=&gt;</span> {'{'}</p>
              <p className="pl-4"><span className="text-blue-400">const</span> store = <span className="text-yellow-200">useSessionRoomStore</span>();</p>
              <p className="pl-4 mt-2">...</p>
              <p>{'}'}</p>
            </div>

            {/* Gradient Overlay for visual flair */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed]/10 to-[#f472b6]/5 pointer-events-none mix-blend-screen" />
            
            {/* Central Badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center space-x-3 shadow-2xl">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white font-medium tracking-wide">Screen Share Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenShareOverlay;
