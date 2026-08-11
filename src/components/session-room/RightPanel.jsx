import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Code2, PenTool, BarChart2 } from 'lucide-react';

// Placeholders for tabs
import LiveCodeEditor from './LiveCodeEditor';
import WhiteboardCanvas from './WhiteboardCanvas';
import QuickPolls from './QuickPolls';
import PollCreator from './PollCreator';
import PollDisplay from './PollDisplay';

// We'll mock the notes tab for now since the prompt didn't explicitly ask for a full note editor in SessionRoom,
// just that the tab exists and "Right panel is tabbed: Notes | Code | Whiteboard | Poll"
const NotesTab = () => (
  <div className="h-full bg-[#111118] p-4 flex flex-col items-center justify-center text-[#6b6b8a]">
    <FileText className="w-12 h-12 mb-4 opacity-50" />
    <p>Session notes are available here.</p>
  </div>
);

const TABS = [
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
  { id: 'poll', label: 'Polls', icon: BarChart2 }
];

const RightPanel = () => {
  const [activeTab, setActiveTab] = useState('whiteboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'notes': return <NotesTab />;
      case 'code': return <LiveCodeEditor />;
      case 'whiteboard': return <WhiteboardCanvas />;
      case 'poll': return (
        <div className="flex flex-col h-full bg-[#111118] overflow-y-auto custom-scrollbar">
           {/* For mock, we show the poll creator for mentors */}
           <div className="p-4 space-y-6">
             <QuickPolls />
             <div className="h-px bg-[#2a2a3a] w-full" />
             <PollCreator />
           </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#16161e]">
      {/* Tabs Header */}
      <div className="flex h-12 bg-[#0a0a0f] border-b border-[#2a2a3a] shrink-0">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 text-sm font-medium transition-colors relative
                ${isActive ? 'text-[#7c3aed]' : 'text-[#6b6b8a] hover:text-white'}
              `}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline-block">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed]"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 relative overflow-hidden bg-[#111118]">
        <AnimatePresence mode="wait">
          <motion.div
             key={activeTab}
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -20 }}
             transition={{ duration: 0.2 }}
             className="absolute inset-0"
          >
             {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Mentee Poll Display overlay (shows over everything when activePoll is set) */}
      <PollDisplay />
    </div>
  );
};

export default RightPanel;
