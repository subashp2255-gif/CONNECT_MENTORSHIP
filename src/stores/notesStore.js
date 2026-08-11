import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const sampleNotes = [
  {
    id: 'note-1',
    sessionId: 's1',
    mentorId: 'm1',
    menteeId: 'u1',
    title: 'Mock Interview — DSA & System Design',
    createdAt: '2024-10-15T09:00:00Z',
    updatedAt: '2024-10-15T10:05:00Z',
    agendaItems: ['Review binary search patterns', 'System design: URL shortener', 'Behavioral question practice'],
    menteeNotes: 'Need to revisit sliding window technique. Arjun suggested focusing on medium-level problems first before jumping to hard ones.',
    mentorNotes: 'Ravi shows strong fundamentals in arrays and strings. Needs work on graph traversal algorithms. Recommend practicing BFS/DFS daily.',
    sharedNotes: '## Key Takeaways\n\n- Binary search patterns: always define the search space clearly\n- For system design, start with requirements clarification\n- Practice 2 medium LC problems daily for the next 2 weeks\n\n## Resources Shared\n- NeetCode 150 playlist\n- System Design Primer GitHub repo',
    actionItems: [
      { id: 'ai-1', text: 'Complete NeetCode 150 — Binary Search section', assignedTo: 'mentee', completed: true, dueDate: '2024-10-22T00:00:00Z' },
      { id: 'ai-2', text: 'Design a URL shortener system and submit doc', assignedTo: 'mentee', completed: false, dueDate: '2024-10-25T00:00:00Z' },
      { id: 'ai-3', text: 'Share graph algorithm resource list', assignedTo: 'mentor', completed: true, dueDate: '2024-10-18T00:00:00Z' },
    ],
    tags: ['DSA', 'System Design', 'Interview Prep'],
    isPinned: true,
    isPrivate: false,
    mood: 'great',
  },
  {
    id: 'note-2',
    sessionId: 's2',
    mentorId: 'm2',
    menteeId: 'u2',
    title: 'Career Chat — ML Career Path',
    createdAt: '2024-10-20T14:30:00Z',
    updatedAt: '2024-10-20T15:10:00Z',
    agendaItems: ['Discuss ML engineer vs Data Scientist roles', 'Portfolio review', 'Master\'s degree pros/cons'],
    menteeNotes: 'Priya said industry experience matters more than a Masters for most ML roles. Should build 2-3 strong projects instead.',
    mentorNotes: 'Sita has strong Python fundamentals. Portfolio needs more end-to-end projects with deployment. Recommended Kaggle competitions for visibility.',
    sharedNotes: '## Career Discussion Summary\n\n- ML Engineer: more coding, production systems\n- Data Scientist: more analysis, experimentation\n- Build projects that show full pipeline: data → model → deployment\n\n## Next Steps\n- Focus on MLOps skills (Docker, FastAPI)\n- Start 1 Kaggle competition this month',
    actionItems: [
      { id: 'ai-4', text: 'Deploy ML model using FastAPI + Docker', assignedTo: 'mentee', completed: false, dueDate: '2024-11-01T00:00:00Z' },
      { id: 'ai-5', text: 'Register for Kaggle competition', assignedTo: 'mentee', completed: true, dueDate: '2024-10-27T00:00:00Z' },
      { id: 'ai-6', text: 'Review updated portfolio and provide feedback', assignedTo: 'mentor', completed: false, dueDate: '2024-11-05T00:00:00Z' },
    ],
    tags: ['Career', 'ML', 'Portfolio'],
    isPinned: false,
    isPrivate: false,
    mood: 'good',
  },
  {
    id: 'note-3',
    sessionId: 's3',
    mentorId: 'm3',
    menteeId: 'u3',
    title: 'Project Guidance — React State Management',
    createdAt: '2024-11-05T10:00:00Z',
    updatedAt: '2024-11-05T11:05:00Z',
    agendaItems: ['Debug useEffect infinite loop', 'Discuss Zustand vs Redux', 'Review component architecture'],
    menteeNotes: 'The infinite loop was caused by an object dependency in useEffect. Rahul showed me how to use useRef to track previous values.',
    mentorNotes: 'Aryan is making good progress on React. His component structure is clean but he tends to over-engineer state management. Keep it simple.',
    sharedNotes: '## Session Notes\n\n### Bug Fix: useEffect Infinite Loop\n```javascript\n// Problem: object in dependency array\nuseEffect(() => { fetchData(filters) }, [filters])\n\n// Solution: compare specific values\nuseEffect(() => { fetchData(filters) }, [filters.search, filters.category])\n```\n\n### State Management Decision\n- For this project size: Zustand > Redux\n- Use context for theme/auth, Zustand for everything else',
    actionItems: [
      { id: 'ai-7', text: 'Refactor 3 components to use Zustand', assignedTo: 'mentee', completed: false, dueDate: '2024-11-12T00:00:00Z' },
      { id: 'ai-8', text: 'Write unit tests for custom hooks', assignedTo: 'mentee', completed: false, dueDate: '2024-11-15T00:00:00Z' },
    ],
    tags: ['React', 'State Management', 'Debugging'],
    isPinned: true,
    isPrivate: false,
    mood: 'okay',
  },
];

export const useNotesStore = create(
  persist(
    (set, get) => ({
      notes: sampleNotes,
      activeNote: null,

      addNote: (sessionId, mentorId, menteeId, title) => {
        const newNote = {
          id: `note-${Date.now()}`,
          sessionId,
          mentorId,
          menteeId,
          title: title || 'Untitled Session Note',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          agendaItems: [],
          menteeNotes: '',
          mentorNotes: '',
          sharedNotes: '',
          actionItems: [],
          tags: [],
          isPinned: false,
          isPrivate: false,
          mood: null,
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
        return newNote;
      },

      updateNote: (id, changes) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...changes, updatedAt: new Date().toISOString() }
              : note
          ),
        })),

      setActiveNote: (note) => set({ activeNote: note }),

      togglePin: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
          ),
        })),

      toggleActionItem: (noteId, actionItemId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  actionItems: note.actionItems.map((item) =>
                    item.id === actionItemId
                      ? { ...item, completed: !item.completed }
                      : item
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        })),

      addActionItem: (noteId, item) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  actionItems: [
                    ...note.actionItems,
                    { id: `ai-${Date.now()}`, completed: false, ...item },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        })),

      removeActionItem: (noteId, actionItemId) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId
              ? {
                  ...note,
                  actionItems: note.actionItems.filter((item) => item.id !== actionItemId),
                  updatedAt: new Date().toISOString(),
                }
              : note
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        })),

      getNoteBySession: (sessionId) => {
        return get().notes.find((note) => note.sessionId === sessionId) || null;
      },

      getPendingActionItems: () => {
        const allItems = [];
        get().notes.forEach((note) => {
          note.actionItems
            .filter((item) => !item.completed)
            .forEach((item) => {
              allItems.push({ ...item, noteId: note.id, sessionTitle: note.title, mentorId: note.mentorId });
            });
        });
        return allItems;
      },

      getAllActionItems: () => {
        const allItems = [];
        get().notes.forEach((note) => {
          note.actionItems.forEach((item) => {
            allItems.push({ ...item, noteId: note.id, sessionTitle: note.title, mentorId: note.mentorId });
          });
        });
        return allItems;
      },
    }),
    {
      name: 'connect-notes-store',
    }
  )
);
