import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';

export default function Select({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  label,
  error,
  required,
  className,
  dropdownClassName,
  disabled,
  size = 'md'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return { value: opt.toString(), label: opt.toString() };
    }
    if (!opt) return { value: '', label: '' };
    return {
      value: opt.value !== undefined ? opt.value.toString() : (opt.label || '').toString(),
      label: (opt.label || opt.value || '').toString()
    };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-text-muted mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full border border-border bg-panel text-white transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-left",
          size === 'sm' ? 'py-1.5 px-3 text-xs rounded-lg' : 'py-3 px-4 text-sm rounded-xl',
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
        )}
      >
        <span className={cn(!selectedOption && "text-text-dim", "truncate")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform duration-200 flex-shrink-0 ml-2", isOpen && "rotate-180")} />
      </button>

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              "absolute z-50 mt-2 w-full bg-[#16161e]/95 border border-border rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-xl",
              dropdownClassName
            )}
          >
            <ul className="py-1">
              {normalizedOptions.map((opt, i) => {
                const isSelected = opt.value === value;
                return (
                  <li
                    key={`${opt.value}-${i}`}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "px-4 py-2.5 text-sm text-gray-300 hover:bg-primary/15 hover:text-white cursor-pointer flex items-center justify-between transition-colors",
                      isSelected && "bg-primary/10 text-primary-light font-medium"
                    )}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary-light flex-shrink-0 ml-2" />}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
