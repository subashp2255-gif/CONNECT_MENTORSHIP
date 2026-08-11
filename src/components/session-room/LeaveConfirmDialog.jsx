import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useSessionRoomStore from '../../stores/sessionRoomStore';

const LeaveConfirmDialog = ({ open, onOpenChange, sessionId }) => {
  const navigate = useNavigate();
  const endSession = useSessionRoomStore(state => state.endSession);

  const handleLeave = () => {
    endSession();
    onOpenChange(false);
    navigate(`/session/${sessionId}/summary`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#16161e] border border-[#2a2a3a] rounded-xl shadow-2xl p-6 w-[90vw] max-w-sm z-50 animate-in zoom-in-95">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto">
            <LogOut className="w-6 h-6 text-red-500 ml-1" />
          </div>
          
          <Dialog.Title className="text-xl font-brand font-bold text-white text-center mb-2">
            Leave Session?
          </Dialog.Title>
          <Dialog.Description className="text-[#6b6b8a] text-center mb-6 text-sm">
            Are you sure you want to leave this session? You will be redirected to the session summary.
          </Dialog.Description>
          
          <div className="flex flex-col space-y-3">
            <button 
              onClick={handleLeave}
              className="w-full py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Yes, Leave Session
            </button>
            <button 
              onClick={() => onOpenChange(false)}
              className="w-full py-2.5 rounded-lg text-sm font-medium text-white hover:bg-[#2a2a3a] border border-[#2a2a3a] transition-colors"
            >
              Cancel
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default LeaveConfirmDialog;
