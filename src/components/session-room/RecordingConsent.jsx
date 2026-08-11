import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Video } from 'lucide-react';
import toast from 'react-hot-toast';
import useSessionRoomStore from '../../stores/sessionRoomStore';

const RecordingConsent = ({ open, onOpenChange }) => {
  const { startRecording } = useSessionRoomStore();

  const handleAgree = () => {
    // In a real app we'd wait for BOTH to consent.
    // For this mock we assume both agree when one clicks agree.
    startRecording();
    toast.success("Recording started");
    onOpenChange(false);
  };

  const handleDecline = () => {
    toast.error("Recording cancelled — both parties must consent");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#16161e] border border-[#2a2a3a] rounded-xl shadow-2xl p-6 w-[90vw] max-w-sm z-50 animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
            <Video className="w-6 h-6 text-red-500" />
          </div>
          
          <Dialog.Title className="text-lg font-brand font-bold text-white text-center mb-2">
            Record Session?
          </Dialog.Title>
          <Dialog.Description className="text-[#6b6b8a] text-center mb-6 text-sm">
            Mentor/Mentee wants to record this session. By agreeing, you consent to this session being recorded.
          </Dialog.Description>
          
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleAgree}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
            >
              I Agree
            </button>
            <button 
              onClick={handleDecline}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#2a2a3a] border border-[#2a2a3a] transition-colors"
            >
              Decline
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default RecordingConsent;
