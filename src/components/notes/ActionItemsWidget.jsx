import { Link } from 'react-router-dom';
import { Check, Circle, Calendar, ChevronRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isPast, isToday, isBefore, addDays } from 'date-fns';
import { useNotesStore } from '../../stores/notesStore';

export default function ActionItemsWidget() {
  const { notes, toggleActionItem } = useNotesStore();

  // Collect all pending action items
  const pendingItems = [];
  notes.forEach((note) => {
    note.actionItems
      .filter((item) => !item.completed)
      .forEach((item) => {
        pendingItems.push({
          ...item,
          noteId: note.id,
          sessionTitle: note.title,
        });
      });
  });

  // Group by timing
  const overdue = pendingItems.filter(
    (i) => i.dueDate && isPast(new Date(i.dueDate)) && !isToday(new Date(i.dueDate))
  );
  const today = pendingItems.filter((i) => i.dueDate && isToday(new Date(i.dueDate)));
  const thisWeek = pendingItems.filter((i) => {
    if (!i.dueDate) return false;
    const d = new Date(i.dueDate);
    return !isPast(d) && !isToday(d) && isBefore(d, addDays(new Date(), 7));
  });
  const later = pendingItems.filter((i) => {
    if (!i.dueDate) return true; // No date = later
    const d = new Date(i.dueDate);
    return !isPast(d) && !isToday(d) && !isBefore(d, addDays(new Date(), 7));
  });

  const groups = [
    { label: 'Overdue', items: overdue, color: 'text-red-400', dotColor: 'bg-red-500' },
    { label: 'Today', items: today, color: 'text-yellow-400', dotColor: 'bg-yellow-500' },
    { label: 'This Week', items: thisWeek, color: 'text-blue-400', dotColor: 'bg-blue-500' },
    { label: 'Later', items: later, color: 'text-text-dim', dotColor: 'bg-text-dim' },
  ].filter((g) => g.items.length > 0);

  if (pendingItems.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary-light" />
            Action Items
          </h3>
          <Link to="/notes" className="text-xs text-primary-light hover:text-white transition-colors flex items-center gap-1">
            View Notes <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs text-text-dim text-center py-4">🎉 All caught up! No pending items.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-light" />
          Action Items
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400">
            {pendingItems.length}
          </span>
        </h3>
        <Link to="/notes" className="text-xs text-primary-light hover:text-white transition-colors flex items-center gap-1">
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Groups */}
      <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
        {groups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${group.dotColor}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${group.color}`}>
                {group.label}
              </span>
            </div>
            <div className="space-y-1.5">
              {group.items.slice(0, 3).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-2 group"
                >
                  <button
                    type="button"
                    onClick={() => toggleActionItem(item.noteId, item.id)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    <div className="w-4 h-4 rounded-full border border-border group-hover:border-primary transition-colors flex items-center justify-center">
                      <Circle className="w-1.5 h-1.5 fill-orange-400 text-orange-400" />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{item.text}</p>
                    <p className="text-[10px] text-text-dim truncate">{item.sessionTitle}</p>
                  </div>
                </motion.div>
              ))}
              {group.items.length > 3 && (
                <p className="text-[10px] text-text-dim pl-6">+{group.items.length - 3} more</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
