import { Bold, Italic, Underline, List, Heading1, Heading2, Code } from 'lucide-react';

const tools = [
  { icon: Bold, label: 'Bold', tag: '**', shortcut: 'Ctrl+B' },
  { icon: Italic, label: 'Italic', tag: '*', shortcut: 'Ctrl+I' },
  { icon: Underline, label: 'Underline', tag: '__', shortcut: 'Ctrl+U' },
  { icon: List, label: 'Bullet List', tag: '- ', shortcut: null },
  { icon: Heading1, label: 'Heading 1', tag: '# ', shortcut: null },
  { icon: Heading2, label: 'Heading 2', tag: '## ', shortcut: null },
  { icon: Code, label: 'Code Block', tag: '```', shortcut: null },
];

export default function EditorToolbar({ onFormat }) {
  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-surface/50 rounded-t-xl">
      {tools.map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={() => onFormat?.(tool.tag)}
          title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
          className="p-1.5 rounded-lg text-text-dim hover:text-white hover:bg-surface transition-colors"
        >
          <tool.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
}
