import { Link } from 'react-router-dom';
import { Pin, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { mentors } from '../../data/mockData';

const moodEmoji = { great: '🤩', good: '😊', okay: '😐', difficult: '😓' };

export default function NoteCard({ note, index = 0 }) {
  const mentor = mentors.find((m) => m.id === note.mentorId);
  const pendingItems = note.actionItems.filter((i) => !i.completed).length;
  const totalItems = note.actionItems.length;
  const preview = note.sharedNotes
    ? note.sharedNotes
        .replace(/[#*`_\->\[\]]/g, '')
        .split('\n')
        .filter(Boolean)
        .slice(0, 2)
        .join(' ')
        .substring(0, 120)
    : 'No shared notes';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <Link to={`/session/${note.sessionId}/summary`}>
        <div
          className={`relative group bg-surface border rounded-2xl p-5 note-card-glow ${
            note.isPinned
              ? 'border-yellow-500/30 shadow-[0_4px_20px_rgba(234,179,8,0.08)]'
              : 'border-border'
          }`}
        >
          {/* Pin Icon */}
          {note.isPinned && (
            <div className="absolute top-3 right-3">
              <Pin className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          )}

          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            {mentor && (
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-10 h-10 rounded-xl object-cover border border-border"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white truncate pr-6">{note.title}</h3>
              <p className="text-xs text-text-muted">
                {mentor?.name} • {format(new Date(note.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Preview */}
          <p className="text-xs text-text-dim leading-relaxed mb-3 line-clamp-2">
            {preview}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Action Items Badge */}
              {totalItems > 0 && (
                <span
                  className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg ${
                    pendingItems > 0
                      ? 'bg-orange-500/15 text-orange-400'
                      : 'bg-green-500/15 text-green-400'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  {pendingItems}/{totalItems} items
                </span>
              )}

              {/* Mood */}
              {note.mood && (
                <span className="text-sm">{moodEmoji[note.mood]}</span>
              )}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-primary/10 text-primary-light text-[10px] font-medium"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 2 && (
                <span className="text-[10px] text-text-dim">+{note.tags.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
