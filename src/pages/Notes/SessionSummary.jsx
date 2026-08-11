import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Pin, Calendar, Clock, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useNotesStore } from '../../stores/notesStore';
import { useStore } from '../../store/useStore';
import { mentors } from '../../data/mockData';
import ActionItemsPanel from '../../components/notes/ActionItemsPanel';
import MoodSelector from '../../components/notes/MoodSelector';
import TagInput from '../../components/notes/TagInput';

export default function SessionSummary() {
  const { id: sessionId } = useParams();
  const { sessions } = useStore();
  const { notes, updateNote, togglePin, toggleActionItem } = useNotesStore();

  const note = notes.find((n) => n.sessionId === sessionId);
  const session = sessions.find((s) => s.id === sessionId);
  const mentor = session ? mentors.find((m) => m.id === session.mentorId) : null;

  if (!note || !session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted text-lg">No notes found for this session.</p>
        <Link to="/notes" className="text-primary-light hover:text-white mt-4 inline-block text-sm">
          ← Back to Notes
        </Link>
      </div>
    );
  }

  const handleExport = () => {
    const lines = [
      `SESSION NOTES — ${note.title}`,
      `${'='.repeat(50)}`,
      '',
      `Mentor: ${mentor?.name || 'Unknown'}`,
      `Date: ${format(new Date(note.createdAt), 'MMMM d, yyyy')}`,
      `Duration: ${session.duration} minutes`,
      `Mood: ${note.mood || 'Not rated'}`,
      '',
      `AGENDA`,
      `${'-'.repeat(30)}`,
      ...note.agendaItems.map((item, i) => `${i + 1}. ${item}`),
      '',
      `SHARED NOTES`,
      `${'-'.repeat(30)}`,
      note.sharedNotes || 'No shared notes.',
      '',
      `ACTION ITEMS`,
      `${'-'.repeat(30)}`,
      ...note.actionItems.map(
        (item) => `[${item.completed ? 'x' : ' '}] ${item.text} (${item.assignedTo})${item.dueDate ? ` — Due: ${format(new Date(item.dueDate), 'MMM d')}` : ''}`
      ),
      '',
      `Tags: ${note.tags.join(', ') || 'None'}`,
    ];
    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-notes-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Summary exported!');
  };

  const handleShare = () => {
    const lines = [
      `📝 ${note.title}`,
      `👤 Mentor: ${mentor?.name}`,
      `📅 ${format(new Date(note.createdAt), 'MMM d, yyyy')}`,
      '',
      note.sharedNotes?.substring(0, 300) || '',
      '',
      `✅ Action Items: ${note.actionItems.filter((i) => i.completed).length}/${note.actionItems.length} done`,
      note.tags.length > 0 ? `🏷️ ${note.tags.join(', ')}` : '',
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    toast.success('Summary copied to clipboard!');
  };

  // Render shared notes with basic formatting
  const renderFormattedNotes = (text) => {
    if (!text) return <p className="text-text-dim italic">No notes recorded.</p>;
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-lg font-bold text-white mt-4 mb-2">{line.slice(3)}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} className="text-xl font-bold text-white mt-5 mb-2">{line.slice(2)}</h2>;
      }
      if (line.startsWith('- ')) {
        return (
          <li key={i} className="text-sm text-gray-300 ml-4 list-disc leading-relaxed">
            {line.slice(2)}
          </li>
        );
      }
      if (line.startsWith('```')) {
        return null; // simplified
      }
      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-sm text-gray-300 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <Link
          to="/notes"
          className="flex items-center gap-2 text-sm text-text-dim hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notes
        </Link>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border text-sm text-text-dim hover:text-white hover:border-white/20 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </motion.div>

      {/* Session Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface border border-border rounded-2xl p-6 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {mentor && (
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-14 h-14 rounded-2xl object-cover border border-border"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{note.title}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {mentor?.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(note.createdAt), 'MMM d, yyyy')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {session.duration} min
                </span>
              </div>
            </div>
          </div>

          {/* Pin Toggle */}
          <button
            type="button"
            onClick={() => togglePin(note.id)}
            className={`p-3 rounded-xl border transition-all ${
              note.isPinned
                ? 'bg-yellow-500/15 border-yellow-500/30 text-yellow-500'
                : 'bg-panel border-border text-text-dim hover:text-white'
            }`}
          >
            <Pin className={`w-5 h-5 ${note.isPinned ? 'fill-yellow-500' : ''}`} />
          </button>
        </div>
      </motion.div>

      {/* Agenda Section */}
      {note.agendaItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface border border-border rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            📋 Agenda Items
          </h2>
          <div className="space-y-2">
            {note.agendaItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-panel border border-border">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary-light text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-white">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Shared Notes Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-border rounded-2xl p-6 mb-6"
      >
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary-light" />
          Shared Notes
        </h2>
        <div className="prose prose-invert max-w-none">
          {renderFormattedNotes(note.sharedNotes)}
        </div>
      </motion.div>

      {/* Action Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface border border-border rounded-2xl p-6 mb-6"
      >
        <ActionItemsPanel
          items={note.actionItems}
          onToggle={(actionItemId) => toggleActionItem(note.id, actionItemId)}
          compact
        />
      </motion.div>

      {/* Mood & Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface border border-border rounded-2xl p-6 space-y-6"
      >
        <MoodSelector
          selected={note.mood}
          onChange={(mood) => updateNote(note.id, { mood })}
        />
        <TagInput
          tags={note.tags}
          onChange={(tags) => updateNote(note.id, { tags })}
        />
      </motion.div>
    </div>
  );
}
