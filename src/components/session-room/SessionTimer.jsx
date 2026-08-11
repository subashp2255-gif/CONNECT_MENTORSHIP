import React, { useEffect, useState } from 'react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import * as Dialog from '@radix-ui/react-dialog';

const SessionTimer = () => {
  const { startTime, duration, isActive, duration: maxDuration } = useSessionRoomStore();
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(duration * 60);
  const [showExtensionDialog, setShowExtensionDialog] = useState(false);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diffSeconds = Math.floor((now - startTime) / 1000);
      setElapsed(diffSeconds);
      
      const totalSeconds = maxDuration * 60;
      const timeRemaining = Math.max(0, totalSeconds - diffSeconds);
      setRemaining(timeRemaining);

      if (timeRemaining === 0 && !showExtensionDialog) {
        setShowExtensionDialog(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, startTime, maxDuration, showExtensionDialog]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getRemainingColor = () => {
    if (remaining <= 5 * 60) return 'text-red-500 animate-pulse'; // 5 min
    if (remaining <= 10 * 60) return 'text-yellow-500'; // 10 min
    return 'text-white';
  };

  const handleExtend = () => {
    useSessionRoomStore.setState(state => ({ duration: state.duration + 15 }));
    setShowExtensionDialog(false);
  };

  const handleDismiss = () => {
    setShowExtensionDialog(false);
  };

  return (
    <>
      <div className="flex items-center space-x-4 font-mono text-sm bg-[#16161e] px-3 py-1.5 rounded-lg border border-[#2a2a3a]">
        <div className="flex items-center space-x-2">
          <span className="text-[#6b6b8a]">Elapsed:</span>
          <span>{formatTime(elapsed)}</span>
        </div>
        <div className="w-px h-4 bg-[#2a2a3a]"></div>
        <div className={`flex items-center space-x-2 ${getRemainingColor()}`}>
          <span className="text-[#6b6b8a] inline-block mr-1">Left:</span>
          <span className="font-bold">{formatTime(remaining)}</span>
        </div>
      </div>

      <Dialog.Root open={showExtensionDialog} onOpenChange={setShowExtensionDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#16161e] border border-[#2a2a3a] rounded-xl shadow-2xl p-6 w-[90vw] max-w-md z-50 animate-in zoom-in-95">
            <Dialog.Title className="text-xl font-brand font-bold text-white mb-2">
              Time is up!
            </Dialog.Title>
            <Dialog.Description className="text-[#6b6b8a] mb-6">
              The scheduled session time has ended. Would you like to extend the session by 15 minutes?
            </Dialog.Description>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={handleDismiss}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#2a2a3a] transition-colors"
              >
                End Now
              </button>
              <button 
                onClick={handleExtend}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
              >
                Extend 15 min
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default SessionTimer;
