import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, 
  Circle, Square, Smile, BarChart2, Settings, PhoneOff, PauseCircle
} from 'lucide-react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import * as Tooltip from '@radix-ui/react-tooltip';
import SessionSettings from './SessionSettings';
import LeaveConfirmDialog from './LeaveConfirmDialog';
import RecordingConsent from './RecordingConsent';
import ReactionBar from './ReactionBar';

const IconButton = ({ icon: Icon, label, isActive, isDanger, onClick, activeColor = 'text-[#7c3aed] bg-[#7c3aed]/10 border-[#7c3aed]/30' }) => {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={onClick}
            className={`
              relative p-3 rounded-xl border transition-all duration-200 group
              ${isDanger ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white' : ''}
              ${isActive && !isDanger ? activeColor : ''}
              ${!isActive && !isDanger ? 'bg-[#16161e] border-[#2a2a3a] text-white hover:bg-[#2a2a3a]' : ''}
            `}
          >
            <Icon className="w-5 h-5" />
            
            {/* Active Glow */}
            {isActive && !isDanger && (
              <div className="absolute inset-0 rounded-xl bg-[#7c3aed]/20 blur-md -z-10" />
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-[#2a2a3a] text-white text-xs px-2 py-1 rounded shadow-xl animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95"
            sideOffset={8}
          >
            {label}
            <Tooltip.Arrow className="fill-[#2a2a3a]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const BottomControlBar = ({ sessionId }) => {
  const { 
    isMuted, isCamOff, isScreenSharing, isRecording, toggleMute, toggleCam, toggleScreenShare, stopRecording
  } = useSessionRoomStore();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [recordingConsentOpen, setRecordingConsentOpen] = useState(false);
  const [reactionsOpen, setReactionsOpen] = useState(false);

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording({
        id: `rec-${Date.now()}`,
        sessionId,
        duration: Math.floor(Math.random() * 3600), // mock duration
        timestamp: new Date().toISOString(),
        consentStatus: 'both'
      });
    } else {
      setRecordingConsentOpen(true);
    }
  };

  return (
    <div className="h-20 bg-[#0a0a0f] border-t border-[#2a2a3a] px-4 flex items-center justify-center shrink-0 z-20">
      
      {/* Floating Reaction Bar relative to this container or absolute above it */}
      <ReactionBar isOpen={reactionsOpen} onClose={() => setReactionsOpen(false)} />

      <div className="flex items-center space-x-3">
        <IconButton 
          icon={isMuted ? MicOff : Mic} 
          label={isMuted ? "Unmute" : "Mute"}
          isActive={isMuted}
          activeColor="text-red-500 bg-red-500/10 border-red-500/30"
          onClick={toggleMute}
        />
        <IconButton 
          icon={isCamOff ? VideoOff : Video} 
          label={isCamOff ? "Turn on camera" : "Turn off camera"}
          isActive={isCamOff}
          activeColor="text-white bg-[#2a2a3a] border-[#2a2a3a]" // Just dim it when off
          onClick={toggleCam}
        />
        
        <div className="w-px h-8 bg-[#2a2a3a] mx-2"></div>
        
        <IconButton 
          icon={MonitorUp} 
          label={isScreenSharing ? "Stop sharing" : "Share screen"}
          isActive={isScreenSharing}
          onClick={toggleScreenShare}
        />
        
        <IconButton 
          icon={isRecording ? Square : Circle} 
          label={isRecording ? "Stop recording" : "Record session"}
          isActive={isRecording}
          activeColor="text-red-500 bg-red-500/10 border-red-500/30"
          onClick={handleRecordClick}
        />
        
        <div className="w-px h-8 bg-[#2a2a3a] mx-2"></div>
        
        <IconButton 
          icon={Smile} 
          label="React"
          isActive={reactionsOpen}
          onClick={() => setReactionsOpen(!reactionsOpen)}
        />
        
        {/* Mocking Poll opening from bottom bar, though prompt says mentor creates from Poll tab. We'll leave the button as a shortcut to open Poll tab or just keep it as specified in prompt (Bottom Control Bar has [📊 Poll]) */}
        <IconButton 
          icon={BarChart2} 
          label="Polls"
          isActive={false}
          onClick={() => {
            // In a real app, this might switch the RightPanel tab to 'Polls'
            // For now, we'll just trigger a toast or let it be handled by state if added later
          }}
        />
        
        <IconButton 
          icon={Settings} 
          label="Settings"
          isActive={settingsOpen}
          onClick={() => setSettingsOpen(true)}
        />
        
        <div className="w-px h-8 bg-[#2a2a3a] mx-2"></div>
        
        <IconButton 
          icon={PhoneOff} 
          label="Leave session"
          isDanger={true}
          onClick={() => setLeaveOpen(true)}
        />
      </div>

      <SessionSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
      <LeaveConfirmDialog open={leaveOpen} onOpenChange={setLeaveOpen} sessionId={sessionId} />
      <RecordingConsent open={recordingConsentOpen} onOpenChange={setRecordingConsentOpen} />
      
    </div>
  );
};

export default BottomControlBar;
