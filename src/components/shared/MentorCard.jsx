import { Link } from 'react-router-dom';
import { Star, Video, Circle } from 'lucide-react';
import Badge from '../ui/Badge';
import SkillChip from './SkillChip';
import Button from '../ui/Button';

export default function MentorCard({ mentor, variant = 'default' }) {
  const isCompact = variant === 'compact';

  const displaySkills = isCompact ? mentor.skills.slice(0, 2) : mentor.skills.slice(0, 3);
  const extraSkillsCount = mentor.skills.length - displaySkills.length;

  return (
    <div className="group relative bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex gap-4 items-start mb-4">
          <div className="relative flex-shrink-0">
            <img 
              src={mentor.avatar} 
              alt={mentor.name}
              className="w-16 h-16 rounded-xl border border-white/10 group-hover:border-primary/50 transition-colors object-cover"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 p-0.5 bg-surface rounded-full">
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
            <Badge company={mentor.company}>{mentor.company}</Badge>
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
          <Link to={`/mentors/${mentor.id}`} className="block">
            <Button variant="outline" fullWidth className="group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
