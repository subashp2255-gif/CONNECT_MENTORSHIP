import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNotesStore } from '../../stores/notesStore';
import { useStore } from '../../store/useStore';
import { mentors } from '../../data/mockData';
import NotesEditor from '../../components/notes/NotesEditor';
import ActionItemsPanel from '../../components/notes/ActionItemsPanel';
import AgendaBuilder from '../../components/notes/AgendaBuilder';
import AutoSaveIndicator from '../../components/notes/AutoSaveIndicator';
import SessionResources from '../../components/mentorship/SessionResources';

export default function SessionNotes() {
  const { id: sessionId } = useParams();
  const { sessions, role } = useStore();
  const { notes, addNote, updateNote, getNoteBySession, toggleActionItem, addActionItem, removeActionItem } = useNotesStore();

  // Find or create note
  const existingNote = getNoteBySession(sessionId);
  const [noteId, setNoteId] = useState(existingNote?.id || null);

  const session = sessions.find((s) => s.id === sessionId);
  const mentor = session ? mentors.find((m) => m.id === session.mentorId) : null;

  // Initialize note if not found
  useEffect(() => {
    if (!noteId && session) {
      const newNote = addNote(sessionId, session.mentorId, session.menteeId, `${session.type} — Session Notes`);
      setNoteId(newNote.id);
    }
  }, [noteId, session, sessionId, addNote]);

  const note = notes.find((n) => n.id === noteId) || existingNote;

  // Local editor state
  const [menteeNotes, setMenteeNotes] = useState(note?.menteeNotes || '');
  const [mentorNotes, setMentorNotes] = useState(note?.mentorNotes || '');
  const [sharedNotes, setSharedNotes] = useState(note?.sharedNotes || '');
  const [mentorTakeaways, setMentorTakeaways] = useState(note?.mentorTakeaways || '');
  const [agendaItems, setAgendaItems] = useState(note?.agendaItems || []);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [activeTab, setActiveTab] = useState('notes');

  // Session timer
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-save every 10 seconds
  const saveNotes = useCallback(() => {
    if (!note) return;
    setSaveStatus('saving');
    updateNote(note.id, {
      menteeNotes: role === 'mentee' ? menteeNotes : note.menteeNotes,
      mentorNotes: role === 'mentor' ? mentorNotes : note.mentorNotes,
      mentorTakeaways: role === 'mentor' ? mentorTakeaways : note.mentorTakeaways,
      sharedNotes,
      agendaItems,
    });
    setTimeout(() => setSaveStatus('saved'), 500);
    setTimeout(() => setSaveStatus('idle'), 3000);
  }, [note, menteeNotes, mentorNotes, mentorTakeaways, sharedNotes, agendaItems, role, updateNote]);

  useEffect(() => {
    const interval = setInterval(saveNotes, 10000);
    return () => clearInterval(interval);
  }, [saveNotes]);

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveNotes();
        toast.success('Notes saved!');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [saveNotes]);

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted">Session not found.</p>
        <Link to="/dashboard" className="text-primary-light hover:text-white mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const privateNotes = role === 'mentor' ? mentorNotes : menteeNotes;
  const setPrivateNotes = role === 'mentor' ? setMentorNotes : setMenteeNotes;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl bg-surface border border-border text-text-dim hover:text-white hover:border-white/20 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              📝 Live Notes
              {mentor && <span className="text-sm font-normal text-text-muted">— {mentor.name}</span>}
            </h1>
            <p className="text-xs text-text-dim">{session.type} • Press Ctrl+S to save</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Session Timer */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-border">
            <Timer className="w-4 h-4 text-primary-light" />
            <span className="text-sm font-mono font-bold text-white">{formatTimer(elapsed)}</span>
          </div>

          {/* Auto Save */}
          <AutoSaveIndicator status={saveStatus} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-border mb-6">
        <button onClick={() => setActiveTab('notes')} className={`pb-2 px-2 text-sm font-medium ${activeTab === 'notes' ? 'border-b-2 border-primary text-white' : 'text-text-muted hover:text-white'}`}>Session Notes</button>
        <button onClick={() => setActiveTab('resources')} className={`pb-2 px-2 text-sm font-medium ${activeTab === 'resources' ? 'border-b-2 border-primary text-white' : 'text-text-muted hover:text-white'}`}>Resources</button>
      </div>

      {activeTab === 'resources' ? (
        <SessionResources sessionId={sessionId} />
      ) : (
        <>
          {/* Agenda (if items exist or session is upcoming) */}
          {(agendaItems.length > 0 || session.status === 'upcoming') && (
        <div className="mb-6">
          <AgendaBuilder
            agendaItems={agendaItems}
            onChange={setAgendaItems}
            sessionDate={session.scheduledAt}
          />
        </div>
      )}

      {/* Three-Panel Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[500px]">
        {/* Left: Private Notes */}
        <div className="lg:col-span-3">
          <NotesEditor
            value={privateNotes}
            onChange={setPrivateNotes}
            label="My Private Notes"
            placeholder="Only you can see these notes..."
            isPrivate
          />
        </div>

        {/* Center: Shared Notes */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex-1">
            <NotesEditor
              value={sharedNotes}
              onChange={setSharedNotes}
              label="Shared Notes"
              placeholder="Both mentor and mentee can see these notes..."
            />
            <p className="text-xs text-text-muted mt-2 font-mono">Added by: {mentor?.name} & You</p>
          </div>
          
          {/* Mentor's Takeaways */}
          <div className="flex-1 mt-4">
            <NotesEditor
              value={mentorTakeaways}
              onChange={role === 'mentor' ? setMentorTakeaways : undefined}
              label="Mentor's Takeaways"
              placeholder="Mentor's official feedback and summary..."
            />
            {role !== 'mentor' && <p className="text-xs text-text-muted mt-2">Read-only. Only the mentor can edit this.</p>}
          </div>
        </div>

        {/* Right: Action Items */}
        <div className="lg:col-span-3">
          <div className="h-full bg-surface border border-border rounded-xl p-4">
            <ActionItemsPanel
              items={note?.actionItems || []}
              onToggle={(actionItemId) => note && toggleActionItem(note.id, actionItemId)}
              onAdd={(item) => note && addActionItem(note.id, item)}
              onRemove={(actionItemId) => note && removeActionItem(note.id, actionItemId)}
            />
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
