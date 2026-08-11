import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Video, Circle, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import Badge from '../ui/Badge';
import SkillChip from './SkillChip';
import Button from '../ui/Button';
import LazyImage from '../ui/LazyImage';

function MentorCard({ mentor, variant = 'default' }) {
  const isCompact = variant === 'compact';

  const displaySkills = isCompact ? mentor.skills.slice(0, 2) : mentor.skills.slice(0, 3);
  const extraSkillsCount = mentor.skills.length - displaySkills.length;
  const domain = mentor.skills[0] || 'General';

  const { savedMentorIds, toggleSaveMentor } = useStore();
  const isSaved = savedMentorIds.includes(mentor.id);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveMentor(mentor.id);
    if (!isSaved) toast.success('Mentor saved!');
    else toast.success('Removed from saved');
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
      className="group relative bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 flex flex-col h-full"
    >
      <div className="p-5 flex-1 flex flex-col relative">
        <button 
          onClick={handleSave} 
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-surface/80 backdrop-blur-md border border-border hover:bg-white/10 transition-colors"
        >
          <motion.div whileTap={{ scale: 0.8 }} animate={isSaved ? { scale: [1, 1.2, 1] } : {}}>
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-secondary text-secondary' : 'text-gray-400'}`} />
          </motion.div>
        </button>

        {/* Header */}
        <div className="flex gap-4 items-start mb-4">
          <div className="relative flex-shrink-0">
            <div 
              className="w-16 h-16 flex items-center justify-center text-white font-bold text-xl border border-white/10 group-hover:border-primary/50 transition-colors"
              style={{ borderRadius: '50%', background: 'linear-gradient(135deg, #7c6ff7, #3C3489)' }}
            >
              {mentor.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 p-0.5 bg-surface rounded-full">
              <Circle className={`w-3.5 h-3.5 fill-current ${mentor.isAvailable ? 'text-green-500' : 'text-gray-500'}`} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-light transition-colors">
              {mentor.name}
            </h3>
            <p className="text-sm text-text-muted truncate mb-1">
              {mentor.college} • {mentor.year}
            </p>
            <div className="flex items-center gap-2">
              <Badge company={mentor.company}>{mentor.company}</Badge>
              <span className="text-[10px] px-2 py-1 rounded-full border border-primary/30 text-primary-light bg-primary/10">{domain}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-panel border border-border">
          <div className="flex flex-col items-center justify-center p-1 border-r border-border">
            <div className="flex items-center text-sm font-bold text-white">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
              {mentor.rating.toFixed(1)}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-1">
            <div className="flex items-center text-sm font-bold text-white">
              <Video className="w-4 h-4 text-primary-light mr-1" />
              {mentor.totalSessions}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4 flex-1">
          {displaySkills.map(skill => (
            <SkillChip key={skill} skill={skill} size="sm" />
          ))}
          {extraSkillsCount > 0 && (
            <span className="text-[10px] font-medium text-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded-full flex items-center">
              +{extraSkillsCount}
            </span>
          )}
        </div>
        
        {/* Footer actions */}
        <div className="mt-auto">
          <div className="mb-3 text-xs">
            <span className={`px-2 py-1 rounded-full border ${mentor.isAvailable ? 'text-green-300 border-green-500/40 bg-green-500/10' : 'text-gray-300 border-gray-500/40 bg-gray-500/10'}`}>
              {mentor.isAvailable ? 'Available now' : 'Limited availability'}
            </span>
          </div>
          <div className="flex gap-2">
            <Link to={`/messages`} className="flex-shrink-0">
               <Button variant="outline" className="px-3 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all" title="Message Mentor">
                 <MessageSquare className="w-4 h-4" />
               </Button>
            </Link>
            <Link to={`/mentors/${mentor.id}`} className="flex-1">
              <Button variant="outline" fullWidth className="group-hover:bg-primary/20 group-hover:border-primary/50 transition-all font-mono text-[11px] font-bold tracking-widest text-primary-light hover:text-white uppercase px-1">
                Profile
              </Button>
            </Link>
            <Link to={`/mentors/${mentor.id}#book`} className="flex-1">
              <Button fullWidth className="font-mono text-[11px] font-bold tracking-widest text-white uppercase transition-all px-1" style={{ background: 'linear-gradient(135deg, #7c6ff7, #e879f9)', border: 'none' }}>
                Book
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(MentorCard);
