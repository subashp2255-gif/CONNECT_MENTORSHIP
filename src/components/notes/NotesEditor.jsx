import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import EditorToolbar from './EditorToolbar';

export default function NotesEditor({ value = '', onChange, label, placeholder, isPrivate = false }) {
  const textareaRef = useRef(null);

  const wordCount = value
    ? value.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleFormat = useCallback((tag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText;
    let newCursorPos;

    if (tag === '- ' || tag === '# ' || tag === '## ') {
      // Line prefix tags
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      newText = value.substring(0, lineStart) + tag + value.substring(lineStart);
      newCursorPos = start + tag.length;
    } else if (tag === '```') {
      // Code block
      newText = value.substring(0, start) + '\n```\n' + selectedText + '\n```\n' + value.substring(end);
      newCursorPos = start + 5;
    } else {
      // Wrap tags (bold, italic, underline)
      newText = value.substring(0, start) + tag + selectedText + tag + value.substring(end);
      newCursorPos = selectedText ? end + tag.length * 2 : start + tag.length;
    }

    onChange?.(newText);
    // Focus and set cursor after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-full"
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{label}</span>
          {isPrivate && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-medium uppercase tracking-wider">
              Private
            </span>
          )}
        </div>
        <span className="text-[11px] text-text-dim">{wordCount} words</span>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col rounded-xl border border-border focus-within:border-primary transition-colors overflow-hidden">
        <EditorToolbar onFormat={handleFormat} />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || 'Start typing...'}
          className="flex-1 min-h-[200px] p-4 bg-[#111118] text-sm text-white placeholder-text-dim outline-none resize-none font-sans leading-relaxed"
          style={{ tabSize: 2 }}
        />
      </div>
    </motion.div>
  );
}
