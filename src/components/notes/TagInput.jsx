import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onChange?.([...tags, tag]);
      setInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange?.(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text-muted">Tags</span>
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-border bg-panel min-h-[44px]">
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/20 text-primary-light text-xs font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <div className="flex items-center gap-1 flex-1 min-w-[120px]">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag..."
            className="flex-1 bg-transparent text-sm text-white placeholder-text-dim outline-none"
          />
          {input.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="p-1 rounded-md hover:bg-white/10 text-text-dim hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
