import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import MentorCard from '../components/shared/MentorCard';
import SkillChip from '../components/shared/SkillChip';
import { motion, AnimatePresence } from 'framer-motion';
import { MentorCardSkeleton } from '../components/ui/Skeleton';
import Select from '../components/ui/Select';

export default function MentorsBrowse() {
  const { searchQuery, setSearchQuery, activeFilters, setFilter, clearFilters, mentorList, fetchMentors } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Best Rated'); // Best Rated, Most Sessions, Newest
  const [isLoadingGrid, setIsLoadingGrid] = useState(false);
  
  // Local state for debouncing
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(localSearch), 300);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeFilters.skills.length) params.set('skills', activeFilters.skills.join(','));
    if (activeFilters.companies.length) params.set('companies', activeFilters.companies.join(','));
    if (activeFilters.colleges.length) params.set('colleges', activeFilters.colleges.join(','));
    if (activeFilters.sessionTypes.length) params.set('type', activeFilters.sessionTypes.join(','));
    setSearchParams(params, { replace: true });
  }, [searchQuery, activeFilters, setSearchParams]);

  useEffect(() => {
    setIsLoadingGrid(true);
    const timer = setTimeout(() => setIsLoadingGrid(false), 350);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilters, sortBy]);

  // Extract unique filter options from mock data
  const allSkills = useMemo(() => Array.from(new Set(mentorList.flatMap((m) => m.skills))).sort(), [mentorList]);
  const allCompanies = useMemo(() => Array.from(new Set(mentorList.map((m) => m.company))).sort(), [mentorList]);
  const allColleges = useMemo(() => Array.from(new Set(mentorList.map((m) => m.college))).sort(), [mentorList]);
  const allSessionTypes = useMemo(() => Array.from(new Set(mentorList.flatMap((m) => m.sessionTypes))).sort(), [mentorList]);

  // Filter and Sort Mentors
  const filteredMentors = useMemo(() => {
    let result = [...mentorList];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.company.toLowerCase().includes(q) || 
        m.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // Filters
    if (activeFilters.skills.length > 0) {
      result = result.filter(m => activeFilters.skills.some(skill => m.skills.includes(skill)));
    }
    if (activeFilters.companies.length > 0) {
      result = result.filter(m => activeFilters.companies.includes(m.company));
    }
    if (activeFilters.colleges.length > 0) {
      result = result.filter(m => activeFilters.colleges.includes(m.college));
    }
    if (activeFilters.sessionTypes.length > 0) {
      result = result.filter(m => activeFilters.sessionTypes.some(type => m.sessionTypes.includes(type)));
    }

    // Sort
    if (sortBy === 'Best Rated') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'Most Sessions') {
      result.sort((a, b) => b.totalSessions - a.totalSessions);
    }

    return result;
  }, [mentorList, searchQuery, activeFilters, sortBy]);

  const activeFilterCount = activeFilters.skills.length + activeFilters.companies.length + activeFilters.colleges.length + activeFilters.sessionTypes.length;

  const FilterSection = ({ title, options, category }) => (
    <div className="mb-6">
      <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
        {options.map(option => (
          <label key={option} className="flex items-center group cursor-pointer">
            <input 
              type="checkbox" 
              checked={activeFilters[category].includes(option)}
              onChange={() => setFilter(category, option)}
              className="w-4 h-4 rounded border-border bg-panel text-primary focus:ring-primary focus:ring-offset-background"
            />
            <span className="ml-3 text-sm text-text-muted group-hover:text-white transition-colors">
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="bg-surface border border-border rounded-2xl p-6 h-max sticky top-24 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Filter className="w-5 h-5 mr-2 text-primary" /> Filters
        </h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-text-muted hover:text-white underline">
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Skills" options={allSkills} category="skills" />
      <hr className="border-border my-4" />
      <FilterSection title="Companies" options={allCompanies} category="companies" />
      <hr className="border-border my-4" />
      <FilterSection title="Colleges" options={allColleges} category="colleges" />
      <hr className="border-border my-4" />
      <FilterSection title="Session Types" options={allSessionTypes} category="sessionTypes" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find a Mentor</h1>
          <p className="text-text-muted">Showing {filteredMentors.length} mentors available to help you.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Input 
            icon={Search}
            placeholder="Search mentors, skills..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full md:w-64"
          />
          <button 
            className="md:hidden p-3 bg-panel border border-border rounded-xl text-white"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <SidebarContent />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileFiltersOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileFiltersOpen(false)}
              />
              <motion.div 
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-background border-r border-border z-50 lg:hidden overflow-y-auto p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2"><X className="w-6 h-6" /></button>
                </div>
                <SidebarContent />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Bar: Chips & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            
            {/* Active chips */}
            <div className="flex flex-wrap gap-2 flex-1">
              {['skills', 'companies', 'colleges', 'sessionTypes'].map(category => (
                activeFilters[category].map(val => (
                  <SkillChip 
                    key={`${category}-${val}`} 
                    skill={val} 
                    onRemove={() => setFilter(category, val)}
                  />
                ))
              ))}
            </div>

            <div className="flex items-center flex-shrink-0 gap-2">
              <span className="text-sm text-text-muted">Sort by:</span>
              <Select
                size="sm"
                className="w-40"
                options={['Best Rated', 'Most Sessions', 'Newest']}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>

          {/* Grid */}
          {isLoadingGrid ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <MentorCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredMentors.length > 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredMentors.map((mentor) => (
                <motion.div
                  key={mentor.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
                  }}
                >
                  <MentorCard mentor={mentor} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-surface/50">
              <div className="w-16 h-16 rounded-full bg-panel flex items-center justify-center mb-4 border border-border">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-xl font-bold mb-2">No mentors found</h3>
              <p className="text-text-muted mb-6 max-w-sm">We couldn't find any mentors matching your exact filters. Try tweaking your search.</p>
              <Button onClick={() => { clearFilters(); setLocalSearch(''); }}>Clear all filters</Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
