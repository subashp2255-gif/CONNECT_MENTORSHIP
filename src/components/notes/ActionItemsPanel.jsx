import { useState } from 'react';
import { Plus, Trash2, Check, Circle, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isPast, isToday } from 'date-fns';
import Select from '../ui/Select';

export default function ActionItemsPanel({
  items = [],
  onToggle,
  onAdd,
  onRemove,
  compact = false,
}) {
  const [newText, setNewText] = useState('');
  const [newAssignee, setNewAssignee] = useState('mentee');
  const [newDueDate, setNewDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    onAdd?.({
      text,
      assignedTo: newAssignee,
      dueDate: newDueDate ? new Date(newDueDate).toISOString() : null,
    });
    setNewText('');
    setNewDueDate('');
    setShowForm(false);
  };

  const pendingCount = items.filter((i) => !i.completed).length;
  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className={`flex flex-col ${compact ? '' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Action Items</span>
          <span className="px-2 py-0.5 rounded-full bg-panel text-text-dim text-[10px] font-medium">
            {completedCount}/{items.length}
          </span>
        </div>
        {!compact && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="p-1.5 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="p-3 rounded-xl border border-border bg-panel space-y-2">
              <input
                type="text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="What needs to be done?"
                className="w-full px-3 py-2 rounded-lg bg-[#111118] border border-border text-sm text-white placeholder-text-dim outline-none focus:border-primary transition-colors"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Select
                  size="sm"
                  className="w-28"
                  value={newAssignee}
                  onChange={setNewAssignee}
                  options={[
                    { value: 'mentee', label: 'Mentee' },
                    { value: 'mentor', label: 'Mentor' }
                  ]}
                />
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-[#111118] border border-border text-sm text-white outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 rounded-lg text-sm text-text-dim hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/80 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="space-y-2 flex-1 overflow-y-auto">
        <AnimatePresence>
          {items.map((item, index) => {
            const isOverdue = item.dueDate && isPast(new Date(item.dueDate)) && !item.completed;
            const isDueToday = item.dueDate && isToday(new Date(item.dueDate));

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`group flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  item.completed
                    ? 'bg-green-500/5 border-green-500/20'
                    : isOverdue
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-panel border-border hover:border-white/20'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggle?.(item.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {item.completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-orange-400/60 flex items-center justify-center">
                      <Circle className="w-2 h-2 fill-orange-400 text-orange-400" />
                    </div>
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm transition-all ${
                      item.completed
                        ? 'text-text-dim line-through decoration-green-500/50'
                        : 'text-white'
                    }`}
                    style={
                      item.completed
                        ? {
                            textDecorationColor: 'rgba(34, 197, 94, 0.5)',
                            textDecorationThickness: '2px',
                          }
                        : {}
                    }
                  >
                    {item.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase ${
                        item.assignedTo === 'mentor'
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-primary/15 text-primary-light'
                      }`}
                    >
                      {item.assignedTo}
                    </span>
                    {item.dueDate && (
                      <span
                        className={`flex items-center gap-1 text-[10px] ${
                          isOverdue
                            ? 'text-red-400'
                            : isDueToday
                            ? 'text-yellow-400'
                            : 'text-text-dim'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.dueDate), 'MMM d')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove?.(item.id)}
                    className="p-1 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.length === 0 && (
          <div className="text-center py-8 text-text-dim text-sm">
            No action items yet
          </div>
        )}
      </div>
    </div>
  );
}
