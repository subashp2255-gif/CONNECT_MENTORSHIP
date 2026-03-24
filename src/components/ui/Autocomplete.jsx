import { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

export default function Autocomplete({ value, onChange, suggestions = [], placeholder, label, error, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const filtered = suggestions.filter(s => s.toLowerCase().includes(internalValue.toLowerCase()));

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (val) => {
    setInternalValue(val);
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={ref}>
      {label && (
        <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input 
        type="text"
        value={internalValue}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full bg-surface border border-border rounded-xl px-4 py-3 pb-3 text-sm text-white focus:outline-none transition-all placeholder-text-dim",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        )}
      />
      
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {isOpen && internalValue && filtered.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-panel border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar overflow-hidden">
          {filtered.map((s, i) => (
            <li 
              key={i}
              onClick={() => handleSelect(s)}
              className="px-4 py-3 text-sm text-gray-300 hover:bg-primary/10 hover:text-primary-light cursor-pointer border-b border-white/5 last:border-0 transition-colors"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
