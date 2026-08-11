import React from 'react';
import { 
  MousePointer2, PenTool, Square, Circle, Type, Eraser, Trash2, Undo, Download 
} from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

const COLORS = [
  '#ffffff', // White
  '#f1f5f9', // Slate
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#eab308', // Yellow
  '#f97316', // Orange
  '#ec4899', // Pink
  '#a855f7'  // Purple
];

const STROKE_WIDTHS = [
  { id: 'thin', value: 2, label: 'Thin' },
  { id: 'medium', value: 5, label: 'Medium' },
  { id: 'thick', value: 8, label: 'Thick' }
];

const TOOLS = [
  { id: 'pen', icon: PenTool, label: 'Pen' },
  { id: 'line', icon: MousePointer2, label: 'Line (Mock)' },
  { id: 'rect', icon: Square, label: 'Rectangle (Mock)' },
  { id: 'circle', icon: Circle, label: 'Circle (Mock)' },
  { id: 'text', icon: Type, label: 'Text (Mock)' },
  { id: 'eraser', icon: Eraser, label: 'Eraser' },
];

const WhiteboardToolbar = ({ 
  currentTool, setCurrentTool, 
  currentColor, setCurrentColor, 
  currentWidth, setCurrentWidth,
  onClear, onUndo, onDownload
}) => {
  return (
    <div className="h-14 bg-[#16161e] border-b border-[#2a2a3a] px-4 flex items-center justify-between shrink-0 overflow-x-auto w-full">
      <Tooltip.Provider>
        
        {/* Tools */}
        <div className="flex items-center space-x-1 border-r border-[#2a2a3a] pr-4">
          {TOOLS.map((tool) => (
            <Tooltip.Root key={tool.id}>
              <Tooltip.Trigger asChild>
                <button
                  onClick={() => setCurrentTool(tool.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    currentTool === tool.id ? 'bg-[#7c3aed]/20 text-[#7c3aed]' : 'text-[#6b6b8a] hover:bg-[#2a2a3a] hover:text-white'
                  }`}
                >
                  <tool.icon className="w-4 h-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content className="bg-[#2a2a3a] text-white text-xs px-2 py-1 rounded shadow-xl" sideOffset={5}>
                  {tool.label}
                  <Tooltip.Arrow className="fill-[#2a2a3a]" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </div>

        {/* Colors & Widths */}
        <div className="flex items-center space-x-4 border-r border-[#2a2a3a] px-4">
          {/* Colors */}
          <div className="flex items-center space-x-1">
            {COLORS.slice(0, 8).map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                style={{ backgroundColor: color }}
                className={`w-5 h-5 rounded-full transition-transform ${
                  currentColor === color ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100 hover:scale-110'
                }`}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-[#2a2a3a]"></div>

          {/* Width */}
          <div className="flex items-center space-x-1">
             {STROKE_WIDTHS.map(width => (
                <button
                 key={width.id}
                 onClick={() => setCurrentWidth(width.value)}
                 className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                   currentWidth === width.value ? 'bg-[#2a2a3a]' : 'hover:bg-[#2a2a3a]/50'
                 }`}
                 title={width.label}
               >
                 <div 
                   className="bg-white rounded-full bg-current" 
                   style={{ 
                     width: width.value, 
                     height: width.value,
                     color: currentWidth === width.value ? 'white' : '#6b6b8a' 
                   }} 
                 />
               </button>
             ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 pl-4">
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button onClick={onUndo} className="p-2 text-[#6b6b8a] hover:bg-[#2a2a3a] hover:text-white rounded-lg transition-colors">
                <Undo className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal><Tooltip.Content className="bg-[#2a2a3a] text-xs px-2 py-1 rounded text-white" sideOffset={5}>Undo (Ctrl+Z)</Tooltip.Content></Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button onClick={onClear} className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal><Tooltip.Content className="bg-[#2a2a3a] text-xs px-2 py-1 rounded text-white" sideOffset={5}>Clear All</Tooltip.Content></Tooltip.Portal>
          </Tooltip.Root>

          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button onClick={onDownload} className="p-2 text-[#6b6b8a] hover:bg-[#2a2a3a] hover:text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal><Tooltip.Content className="bg-[#2a2a3a] text-xs px-2 py-1 rounded text-white" sideOffset={5}>Save PNG</Tooltip.Content></Tooltip.Portal>
          </Tooltip.Root>
        </div>

      </Tooltip.Provider>
    </div>
  );
};

export default WhiteboardToolbar;
