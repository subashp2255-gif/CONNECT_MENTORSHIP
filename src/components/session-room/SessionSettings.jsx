import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Settings, Mic, Video, Volume2 } from 'lucide-react';
import Select from '../ui/Select';

const SessionSettings = ({ open, onOpenChange }) => {
  const [camera, setCamera] = React.useState('FaceTime HD Camera');
  const [mic, setMic] = React.useState('MacBook Pro Microphone');
  const [speaker, setSpeaker] = React.useState('MacBook Pro Speakers');

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[#16161e] border border-[#2a2a3a] rounded-xl shadow-2xl p-6 w-[90vw] max-w-lg z-50 animate-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-brand font-bold text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-[#7c3aed]" />
              Session Settings
            </Dialog.Title>
            <Dialog.Close className="text-[#6b6b8a] hover:text-white transition-colors">
              <span className="sr-only">Close</span>
              &times;
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            {/* Camera */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center mb-1.5">
                <Video className="w-4 h-4 mr-2" /> Camera Device
              </label>
              <Select
                options={['FaceTime HD Camera', 'OBS Virtual Camera']}
                value={camera}
                onChange={setCamera}
              />
            </div>

            {/* Microphone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center mb-1.5">
                <Mic className="w-4 h-4 mr-2" /> Microphone
              </label>
              <Select
                options={['MacBook Pro Microphone', 'External USB Mic']}
                value={mic}
                onChange={setMic}
              />
            </div>

            {/* Speaker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center mb-1.5">
                <Volume2 className="w-4 h-4 mr-2" /> Speaker
              </label>
              <Select
                options={['MacBook Pro Speakers', 'External Headphones']}
                value={speaker}
                onChange={setSpeaker}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Dialog.Close className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#2a2a3a] transition-colors">
              Cancel
            </Dialog.Close>
            <Dialog.Close className="px-4 py-2 rounded-lg text-sm font-medium bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors">
              Save Changes
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SessionSettings;
