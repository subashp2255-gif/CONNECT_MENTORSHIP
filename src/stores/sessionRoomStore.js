import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSessionRoomStore = create(
  persist(
    (set, get) => ({
      // Session state
      sessionId: null,
      startTime: null,
      duration: 60, // minutes
      isActive: false,

      // Media state
      isMuted: false,
      isCamOff: false,
      isScreenSharing: false,
      isRecording: false,
      recordingConsent: { mentor: false, mentee: false },

      // Whiteboard
      whiteboardStrokes: [],
      undoStack: [],

      // Code editor
      code: '',
      language: 'javascript',
      codeOutput: '',

      // Polls
      activePoll: null,
      pollHistory: [
        {
          id: 'mock-1',
          question: 'How are you feeling about the pace?',
          options: [
            { id: 'o1', text: 'Too fast', count: 0 },
            { id: 'o2', text: 'Just right', count: 1 },
            { id: 'o3', text: 'Too slow', count: 0 }
          ],
          totalVotes: 1,
          timestamp: new Date().toISOString()
        },
        {
          id: 'mock-2',
          question: 'Ready to move on?',
          options: [
            { id: 'o1', text: 'Yes', count: 1 },
            { id: 'o2', text: 'No, need a minute', count: 0 }
          ],
          totalVotes: 1,
          timestamp: Date.now() - 1000 * 60 * 5,
        }
      ],

      // Reactions
      reactionLog: [],
      lastReactionTime: {},

      // Recordings
      recordings: [
        {
          id: 'mock-rec-1',
          sessionId: 'prev-session-123',
          duration: 3500, // seconds
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          consentStatus: 'both'
        },
        {
          id: 'mock-rec-2',
          sessionId: 'prev-session-456',
          duration: 1800, // seconds
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
          consentStatus: 'both'
        }
      ],

      // Actions
      initSession: (sessionId, duration = 60) => set({
        sessionId,
        duration,
        startTime: Date.now(),
        isActive: true,
        // Reset state for new session slightly, but persist helps us resume
      }),

      endSession: () => set({ isActive: false }),

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      toggleCam: () => set((state) => ({ isCamOff: !state.isCamOff })),
      toggleScreenShare: () => set((state) => ({ isScreenSharing: !state.isScreenSharing })),
      
      setRecordingConsent: (role, status) => set((state) => ({
        recordingConsent: { ...state.recordingConsent, [role]: status }
      })),

      resetRecordingConsent: () => set({ recordingConsent: { mentor: false, mentee: false } }),
      
      startRecording: () => set({ isRecording: true }),
      stopRecording: (recordingInfo) => set((state) => ({
        isRecording: false,
        recordings: [recordingInfo, ...state.recordings]
      })),

      // Whiteboard Actions
      addStroke: (stroke) => set((state) => ({
        whiteboardStrokes: [...state.whiteboardStrokes, stroke],
        undoStack: []
      })),
      clearWhiteboard: () => set({ whiteboardStrokes: [], undoStack: [] }),
      undoWhiteboard: () => set((state) => {
        if (state.whiteboardStrokes.length === 0) return state;
        const strokes = [...state.whiteboardStrokes];
        const lastStroke = strokes.pop();
        return {
          whiteboardStrokes: strokes,
          undoStack: [...state.undoStack, lastStroke]
        };
      }),

      // Code Actions
      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setCodeOutput: (codeOutput) => set({ codeOutput }),

      // Poll Actions
      setActivePoll: (poll) => set({ activePoll: poll }),
      clearActivePoll: () => set({ activePoll: null }),
      addPollToHistory: (poll) => set((state) => ({
        pollHistory: [poll, ...state.pollHistory]
      })),
      votePoll: (optionId) => set((state) => {
        if (!state.activePoll) return state;
        const updatedOptions = state.activePoll.options.map(opt =>
          opt.id === optionId ? { ...opt, count: opt.count + 1 } : opt
        );
        return {
          activePoll: {
            ...state.activePoll,
            options: updatedOptions,
            totalVotes: (state.activePoll.totalVotes || 0) + 1
          }
        };
      }),

      // Reaction Actions
      addReaction: (reaction) => set((state) => {
        const now = Date.now();
        const type = reaction.type;
        const lastTime = state.lastReactionTime[type] || 0;
        
        // Rate limit: 10 seconds for the SAME reaction type
        // The prompt says "same reaction can't be sent twice within 10 seconds"
        if (now - lastTime < 10000) return state;

        return {
          reactionLog: [reaction, ...state.reactionLog].slice(0, 50), // keep last 50
          lastReactionTime: { ...state.lastReactionTime, [type]: now }
        };
      })

    }),
    {
      name: 'connect-session-room',
      partialize: (state) => ({
        // Keep timers and persistent state, don't persist active calls
        duration: state.duration,
        startTime: state.startTime,
        recordings: state.recordings,
        pollHistory: state.pollHistory,
        whiteboardStrokes: state.whiteboardStrokes,
        code: state.code,
        language: state.language
      })
    }
  )
);

export default useSessionRoomStore;
