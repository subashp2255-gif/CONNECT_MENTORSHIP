import { useState } from 'react';
import { Plus, Trash2, GripVertical, Lock, Clock } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AgendaBuilder({ agendaItems = [], onChange, sessionDate, isLocked = false }) {
  const [newItem, setNewItem] = useState('');

  // Calculate countdown
  const getCountdown = () => {
    if (!sessionDate) return null;
    const now = new Date();
    const session = new Date(sessionDate);
    const diff = session - now;
    if (diff <= 0) return 'Session has started';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return `Session starts in ${days} day${days > 1 ? 's' : ''}, ${hours % 24}h`;
    }
    return `Session starts in ${hours}h ${minutes}m`;
  };

  const addItem = () => {
    const text = newItem.trim();
    if (text) {
      onChange?.([...agendaItems, text]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    onChange?.(agendaItems.filter((_, i) => i !== index));
  };

  const handleLock = () => {
    if (agendaItems.length === 0) {
      toast.error('Add at least one agenda item first.');
      return;
    }
    toast.success('Agenda confirmed! Both parties have been notified.');
  };

  const countdown = getCountdown();

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          📋 Session Agenda
          {isLocked && <Lock className="w-4 h-4 text-text-dim" />}
        </h3>
        {countdown && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary-light text-xs font-medium"
          >
            <Clock className="w-3.5 h-3.5" />
            {countdown}
          </motion.div>
        )}
      </div>

      {/* Agenda Items */}
      <div className="space-y-2 mb-4">
        <AnimatePresence>
          {agendaItems.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 group"
            >
              <GripVertical className="w-4 h-4 text-text-dim opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-panel border border-border">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-sm text-white">{item}</span>
              </div>
              {!isLocked && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Item */}
      {!isLocked && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder="Add agenda item..."
            className="flex-1 px-4 py-3 rounded-xl bg-panel border border-border text-sm text-white placeholder-text-dim outline-none focus:border-primary transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={addItem}
            className="p-3 rounded-xl bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      )}

      {/* Confirm Button */}
      {!isLocked && agendaItems.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="button"
          onClick={handleLock}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]"
        >
          ✅ Confirm Agenda
        </motion.button>
      )}
    </div>
  );
}
