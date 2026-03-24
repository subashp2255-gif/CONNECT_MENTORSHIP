import { create } from 'zustand';
import { mentees } from '../data/mockData';

export const useStore = create((set) => ({
  currentUser: mentees[0],
  isLoggedIn: false,
  role: 'mentee',
  
  activeFilters: {
    skills: [],
    companies: [],
    colleges: [],
    sessionTypes: []
  },
  searchQuery: '',
  
  selectedMentor: null,
  bookingStep: 0,
  bookingData: {
    mentorId: null,
    sessionType: '',
    duration: 30,
    date: null,
    timeSlot: '',
    message: ''
  },

  // Actions
  login: (userData, roleOverride) => set({ isLoggedIn: true, currentUser: userData || mentees[0], role: roleOverride || 'mentee' }),
  logout: () => set({ isLoggedIn: false, currentUser: mentees[0], role: 'mentee', activeFilters: { skills: [], companies: [], colleges: [], sessionTypes: [] }, searchQuery: '', selectedMentor: null, bookingStep: 0 }),
  
  setRole: (role) => set({ role }),
  
  setFilter: (category, value) => set((state) => {
    const currentList = state.activeFilters[category];
    const newList = currentList.includes(value) 
      ? currentList.filter(item => item !== value)
      : [...currentList, value];
    
    return {
      activeFilters: {
        ...state.activeFilters,
        [category]: newList
      }
    };
  }),
  
  clearFilters: () => set({ activeFilters: { skills: [], companies: [], colleges: [], sessionTypes: [] } }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setSelectedMentor: (mentor) => set({ selectedMentor: mentor }),
  
  setBookingStep: (step) => set({ bookingStep: step }),
  
  updateBookingData: (data) => set((state) => ({ 
    bookingData: { ...state.bookingData, ...data } 
  })),
  
  resetBooking: () => set({ 
    bookingStep: 0, 
    selectedMentor: null,
    bookingData: { mentorId: null, sessionType: '', duration: 30, date: null, timeSlot: '', message: '' } 
  })
}));
