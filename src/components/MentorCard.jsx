import { Star } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

export function MentorCard({ mentor }) {
  return (
    <Card glass className="overflow-hidden group flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
      <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
        <img 
          src={mentor.photo} 
          alt={mentor.name} 
          className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-4 border-surface object-cover bg-surface"
        />
        <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-white">{mentor.rating}</span>
        </div>
      </div>
      
      <CardContent className="pt-12 pb-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-lg mb-1">{mentor.name}</h3>
          <p className="text-sm text-gray-400 font-medium mb-1">{mentor.company}</p>
          <p className="text-xs text-gray-500">{mentor.college} • {mentor.branch}</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6 flex-1">
          {mentor.skills.slice(0, 3).map(skill => (
            <span key={skill} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
              {skill}
            </span>
          ))}
          {mentor.skills.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400">
              +{mentor.skills.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
          <div className="text-xs text-gray-400">
            <span className="font-bold text-white">{mentor.totalSessions}</span> sessions
          </div>
          <Link to={`/mentors/${mentor.id}`} className="w-1/2">
            <Button variant="outline" size="sm" className="w-full text-xs">View Profile</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
