import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, SortDesc, BookOpen, Pin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotesStore } from '../../stores/notesStore';
import { mentors } from '../../data/mockData';
import NoteCard from '../../components/notes/NoteCard';
import EmptyNotes from '../../components/notes/EmptyNotes';
import Select from '../../components/ui/Select';

const filterOptions = ['All', 'Pinned', 'This Month', 'By Mentor', 'By Tag'];
const sortOptions = ['Most Recent', 'Oldest', 'Session Rating'];

export default function NotesLibrary() {
  const { notes } = useNotesStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort, setActiveSort] = useState('Most Recent');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Get unique mentor IDs and tags
  const mentorIds = useMemo(() => [...new Set(notes.map((n) => n.mentorId))], [notes]);
  const allTags = useMemo(() => [...new Set(notes.flatMap((n) => n.tags))], [notes]);

  const mentorOptions = useMemo(() => {
    return [
      { value: '', label: 'All Mentors' },
      ...mentorIds.map((id) => {
        const m = mentors.find((mentor) => mentor.id === id);
        return m ? { value: id, label: m.name } : null;
      }).filter(Boolean)
    ];
  }, [mentorIds]);

  const tagOptions = useMemo(() => {
    return [
      { value: '', label: 'All Tags' },
      ...allTags.map((tag) => ({ value: tag, label: tag }))
    ];
  }, [allTags]);

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((note) => {
        const mentor = mentors.find((m) => m.id === note.mentorId);
        return (
          note.title.toLowerCase().includes(q) ||
          note.sharedNotes.toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q)) ||
          mentor?.name.toLowerCase().includes(q)
        );
      });
    }

    // Filter
    switch (activeFilter) {
      case 'Pinned':
        result = result.filter((n) => n.isPinned);
        break;
      case 'This Month': {
        const now = new Date();
        result = result.filter((n) => {
          const d = new Date(n.createdAt);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });
        break;
      }
      case 'By Mentor':
        if (selectedMentor) result = result.filter((n) => n.mentorId === selectedMentor);
        break;
      case 'By Tag':
        if (selectedTag) result = result.filter((n) => n.tags.includes(selectedTag));
        break;
    }

    // Sort
    switch (activeSort) {
      case 'Most Recent':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'Oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'Session Rating': {
        const moodOrder = { great: 0, good: 1, okay: 2, difficult: 3 };
        result.sort((a, b) => (moodOrder[a.mood] ?? 4) - (moodOrder[b.mood] ?? 4));
        break;
      }
    }

    return result;
  }, [notes, search, activeFilter, activeSort, selectedMentor, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary-light" />
          Session Notes
        </h1>
        <p className="text-text-muted">All your mentorship session notes in one place.</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by mentor name, tag, or keyword..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface border border-border text-sm text-white placeholder-text-dim outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Filter & Sort Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-text-dim" />
            {filterOptions.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeFilter === f
                    ? 'bg-primary/20 text-primary-light border border-primary/30'
                    : 'bg-panel text-text-dim hover:text-white border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Conditional sub-filter */}
          {activeFilter === 'By Mentor' && (
            <Select
              size="sm"
              className="w-48"
              options={mentorOptions}
              value={selectedMentor}
              onChange={setSelectedMentor}
              placeholder="All Mentors"
            />
          )}
          {activeFilter === 'By Tag' && (
            <Select
              size="sm"
              className="w-48"
              options={tagOptions}
              value={selectedTag}
              onChange={setSelectedTag}
              placeholder="All Tags"
            />
          )}

          {/* Sort */}
          <div className="flex items-center gap-1.5 ml-auto">
            <SortDesc className="w-4 h-4 text-text-dim flex-shrink-0" />
            <Select
              size="sm"
              className="w-40"
              options={sortOptions}
              value={activeSort}
              onChange={setActiveSort}
              placeholder="Sort by"
            />
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note, index) => (
            <NoteCard key={note.id} note={note} index={index} />
          ))}
        </div>
      ) : (
        <EmptyNotes />
      )}
    </div>
  );
}
