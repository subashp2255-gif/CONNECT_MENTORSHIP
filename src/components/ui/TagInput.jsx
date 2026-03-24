import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function TagInput({ tags = [], onChange, suggestions = [], placeholder, label, error, required }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/,$/, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  const addSuggestion = (suggestion) => {
    if (!tags.includes(suggestion)) {
      onChange([...tags, suggestion]);
    }
  };

  return (
    <div className="w-full relative">
      {label && (
        <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={cn(
        "bg-surface border border-border rounded-xl px-4 py-3 pb-2 transition-all min-h-[52px]",
        "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
        error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20"
      )}>
        <div className="flex flex-wrap gap-2 mb-1">
          {tags.map(tag => (
            <span key={tag} className="bg-primary/20 text-primary-light border border-primary/30 rounded-full px-3 py-1 text-xs flex items-center gap-1.5 animate-fadeUp">
              {tag} 
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 p-0 text-white placeholder-text-dim text-sm"
          />
        </div>
      </div>
      
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {suggestions.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-text-dim mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.filter(s => !tags.includes(s)).slice(0, 10).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => addSuggestion(s)}
                className="bg-panel border border-border rounded-full px-3 py-1 text-xs text-text-muted hover:text-white hover:border-primary/50 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
