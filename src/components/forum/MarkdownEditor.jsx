import { useState } from 'react';
import { Bold, Italic, Heading1, Quote, List, Link as LinkIcon, Code, Image, Eye, Edit3 } from 'lucide-react';
import Button from '../ui/Button';

export default function MarkdownEditor({ value, onChange, placeholder = 'Write your content here...', minLength = 20 }) {
  const [activeTab, setActiveTab] = useState('write');

  const insertText = (before, after = '') => {
    const textarea = document.getElementById('markdown-editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + selected + after;

    onChange(text.substring(0, start) + replacement + text.substring(end));
    
    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  const formattingOptions = [
    { icon: Bold, label: 'Bold', action: () => insertText('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertText('*', '*') },
    { icon: Heading1, label: 'Heading', action: () => insertText('# ', '\n') },
    { icon: Quote, label: 'Quote', action: () => insertText('> ', '\n') },
    { icon: List, label: 'List', action: () => insertText('- ', '\n') },
    { icon: LinkIcon, label: 'Link', action: () => insertText('[', '](url)') },
    { icon: Code, label: 'Code Block', action: () => insertText('```javascript\n', '\n```') },
    { icon: Image, label: 'Image', action: () => insertText('![alt text](', ')') }
  ];

  // Helper to parse a simplified Markdown for the preview tab
  const renderPreview = (text) => {
    if (!text) return `<p class="text-text-dim italic">Nothing to preview yet. Start typing...</p>`;
    
    // Escape HTML to prevent XSS
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold text-white mt-4 mb-2">$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold text-white mt-3 mb-2">$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold text-white mt-2 mb-1">$1</h3>');

    // Code blocks
    html = html.replace(/```(?:[a-zA-Z]*)\n([\s\S]*?)\n```/g, '<pre class="bg-panel border border-border rounded-xl p-4 my-3 font-mono text-sm overflow-x-auto text-primary-light">$1</pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-panel px-1.5 py-0.5 rounded font-mono text-xs text-secondary">$1</code>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-4 border-primary bg-primary/5 px-4 py-2 rounded-r-xl my-2 italic text-gray-300">$1</blockquote>');

    // Lists
    html = html.replace(/^\- (.*?)$/gm, '<li class="list-disc ml-6 my-1 text-gray-200">$1</li>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-light hover:underline">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl border border-border max-h-[300px] object-contain my-3" />');

    // Newlines to breaks (except inside code blocks or lists)
    html = html.split('\n').map(line => {
      if (line.trim().startsWith('<h') || line.trim().startsWith('<pre') || line.trim().startsWith('</pre') || line.trim().startsWith('<li') || line.trim().startsWith('<blockquote')) {
        return line;
      }
      return line ? `<p class="mb-2 text-gray-200 leading-relaxed">${line}</p>` : '';
    }).join('\n');

    return html;
  };

  return (
    <div className="border border-border rounded-2xl bg-panel overflow-hidden transition-all focus-within:border-primary/50">
      
      {/* Editor Tabs & Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-surface px-4 py-2 gap-2">
        <div className="flex bg-panel p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'write' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${activeTab === 'preview' ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>

        {activeTab === 'write' && (
          <div className="flex flex-wrap items-center gap-1">
            {formattingOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={opt.action}
                  title={opt.label}
                  className="p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Editor Body */}
      <div className="p-4 bg-[#111118]">
        {activeTab === 'write' ? (
          <div>
            <textarea
              id="markdown-editor-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={8}
              className="w-full bg-transparent border-0 outline-none text-white placeholder-text-dim font-sans text-base resize-y min-h-[150px] focus:ring-0 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={value.length >= minLength ? 'text-green-400' : 'text-text-dim'}>
                {value.length} / {minLength} min characters
              </span>
              <span className="text-text-dim font-mono">Supports Markdown</span>
            </div>
          </div>
        ) : (
          <div 
            className="min-h-[168px] overflow-y-auto max-h-[400px] prose prose-invert font-sans"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
          />
        )}
      </div>

    </div>
  );
}
