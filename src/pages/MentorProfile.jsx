import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Linkedin, Video, CheckCircle, Clock, MessageSquare, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SkillChip from '../components/shared/SkillChip';
import SessionTypeCard from '../components/shared/SessionTypeCard';
import ReviewCard from '../components/shared/ReviewCard';
import BookingModal from '../components/shared/BookingModal';
import LazyImage from '../components/ui/LazyImage';

export default function MentorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    isLoggedIn, 
    currentUser, 
    role, 
    mentorList, 
    fetchMentors, 
    reviews, 
    follows = [], 
    socialPosts = [], 
    socialLikes = [], 
    socialComments = [], 
    sessions, 
    followMentor, 
    unfollowMentor 
  } = useStore();
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (mentorList.length === 0) {
      fetchMentors();
    }
  }, [mentorList.length, fetchMentors]);

  const mentor = mentorList.find(m => m.id === id);
  const mentorReviews = reviews.filter(r => r.mentor_id === id);

  const isFollowing = follows.some(f => f.followerId === currentUser?.id && f.mentorId === id);
  const followersCount = follows.filter(f => f.mentorId === id).length;
  const postsCount = socialPosts.filter(p => p.authorId === id && !p.deletedAt).length;
  const menteesCount = Math.max(
    new Set(sessions.filter(s => s.mentorId === id && s.status === 'completed').map(s => s.menteeId)).size,
    1
  );

  const mentorRecentPosts = socialPosts
    .filter(p => p.authorId === id && !p.deletedAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleFollowToggle = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    if (role !== 'mentee') return;
    if (isFollowing) {
      unfollowMentor(id);
    } else {
      followMentor(id);
    }
  };

  if (!mentor) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Mentor not found</h2>
          <Button onClick={() => navigate('/mentors')}>Back to Directory</Button>
        </div>
      </div>
    );
  }

  const handleBookSession = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
      
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-sm font-medium text-text-muted hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
        
        {/* LEFT COLUMN (35%) */}
        <div className="w-full lg:w-[35%] flex-shrink-0 space-y-6 lg:sticky lg:top-28">
          
          <div className="bg-surface border border-border rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
            {/* Header backdrop blur */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
            
            <div className="relative inline-block mb-6 z-10">
              <LazyImage
                src={mentor.avatar || mentor.avatar_url}
                alt={mentor.name || mentor.full_name}
                className="w-32 h-32 rounded-2xl mx-auto border-4 border-panel shadow-2xl object-cover"
                placeholderClassName="w-32 h-32 rounded-2xl mx-auto"
              />
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 border-surface text-xs font-bold ${mentor.isAvailable ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-500 text-white'}`}>
                {mentor.isAvailable ? 'Online' : 'Busy'}
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{mentor.name || mentor.full_name}</h1>
            <p className="text-primary-light font-medium mb-1">{mentor.role || mentor.role_title}</p>
            <p className="text-text-muted text-sm mb-6">{mentor.college} • {mentor.company}</p>
            
            <div className="flex justify-center mb-6">
              <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-panel border border-border hover:border-blue-500/50 hover:text-blue-400 rounded-xl transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <div className="flex justify-center mb-8">
              {(() => {
                const rate = mentor.response_rate || 99;
                if (rate >= 90) return <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Fast responder · replies in ~2h</div>;
                if (rate >= 70) return <div className="px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Usually responds within a day</div>;
                return <div className="px-3 py-1.5 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-400 text-xs font-medium">Response rate: {rate}%</div>;
              })()}
            </div>

            {/* Follow Button */}
            {(!isLoggedIn || role === 'mentee') && (
              <div className="mb-4">
                <Button
                  variant={isFollowing ? "outline" : "primary"}
                  fullWidth
                  onClick={handleFollowToggle}
                  className="font-bold flex items-center justify-center gap-2"
                >
                  {isFollowing ? '✓ Following' : '+ Follow'}
                </Button>
              </div>
            )}

            <div className="flex gap-3 mb-6">
              <Button variant="primary" fullWidth size="lg" className="h-14 text-base flex-1" onClick={handleBookSession} style={{ background: 'linear-gradient(135deg, #7c6ff7, #e879f9)', border: 'none' }}>
                Book a Session
              </Button>
              <Button variant="outline" size="lg" className="h-14 aspect-square px-0" onClick={() => navigate('/messages')} title="Message Mentor">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-2 py-6 border-t border-border">
              <div className="text-center">
                <div className="text-lg font-bold text-white mb-1">{followersCount}</div>
                <div className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Followers</div>
              </div>
              <div className="text-center border-l border-border/80">
                <div className="text-lg font-bold text-white mb-1">{postsCount}</div>
                <div className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Posts</div>
              </div>
              <div className="text-center border-l border-border/80">
                <div className="text-lg font-bold text-white mb-1">{menteesCount}</div>
                <div className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Mentees</div>
              </div>
              <div className="text-center border-l border-border/80">
                <div className="text-lg font-bold text-white flex items-center justify-center gap-0.5 mb-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                  {mentor.rating ? mentor.rating.toFixed(1) : 'N/A'}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Rating</div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-3xl p-6">
            <h3 className="font-bold flex items-center text-white mb-4">
               <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
               Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {mentor.skills.map(skill => (
                <SkillChip key={skill} skill={skill} />
              ))}
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-3xl p-6 hidden lg:block">
            <h3 className="font-bold flex items-center text-white mb-4">
               <Video className="w-5 h-5 mr-2 text-primary" />
               Session Types Offered
            </h3>
            <div className="space-y-3">
               {mentor.session_types?.map(type => (
                 <div key={type} className="relative">
                   <SessionTypeCard type={type} className="hover:bg-transparent pointer-events-none p-3" />
                   <div className="absolute top-4 right-4 px-2 py-1 bg-surface border border-border rounded-lg text-xs font-bold text-primary-light">
                     {mentor.pricing?.[type] === 0 || !mentor.pricing?.[type] ? 'Free' : `$${mentor.pricing[type]}`}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (65%) */}
        <div className="w-full lg:w-[65%] space-y-8">
          
          <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
             <h2 className="text-2xl font-bold mb-6 text-white pb-6 border-b border-border">About Me</h2>
             <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-[15px] sm:text-base">
                  {mentor.bio}
                  {'\n\n'}
                  I specialize in helping students navigate the complex landscape of technical interviews and career progression in software engineering. With extensive experience at {mentor.company}, I understand what top-tier tech companies look for in candidates. I can help refine your resume, conduct realistic mock interviews, and provide actionable feedback to level up your system design and DSA skills.
                </p>
             </div>
          </section>

          <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
             <h2 className="text-2xl font-bold mb-6 text-white pb-6 border-b border-border flex items-center">
               <Clock className="w-6 h-6 mr-3 text-primary-light" /> General Availability
             </h2>
             <p className="text-text-muted text-sm mb-6">These are the general days {mentor.name.split(' ')[0]} mentors. Exact time slots are selected during booking.</p>
             
             <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  // Fake availability based on totalSessions mod math to be deterministic but varied
                  const isAvailable = (mentor.totalSessions + i) % 2 === 0;
                  return (
                    <div key={day} className={`flex flex-col items-center justify-center p-3 sm:py-4 rounded-xl border ${isAvailable ? 'bg-primary/20 border-primary shadow-[0_0_10px_rgba(124,58,237,0.15)]' : 'bg-panel border-transparent opacity-50'}`}>
                      <span className={`text-[10px] sm:text-xs font-bold uppercase ${isAvailable ? 'text-primary-light' : 'text-text-muted'}`}>{day}</span>
                      {isAvailable && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>}
                    </div>
                  )
                })}
              </div>
           </section>

           {/* Recent Posts Section */}
           <section className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
             <h2 className="text-2xl font-bold mb-6 text-white pb-6 border-b border-border">Recent Posts</h2>
             {mentorRecentPosts.length > 0 ? (
               <div className="space-y-4">
                 {mentorRecentPosts.map(post => {
                   const likesCount = socialLikes.filter(l => l.postId === post.id).length;
                   const commentsCount = socialComments.filter(c => c.postId === post.id && !c.deletedAt).length;

                   return (
                     <Link 
                       key={post.id} 
                       to={`/feed?postId=${post.id}`} 
                       className="block p-5 bg-panel border border-border rounded-xl hover:border-primary/40 transition-colors"
                     >
                       <h3 className="text-base font-bold text-white mb-2">{post.title}</h3>
                       <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">
                         {post.content.replace(/<[^>]*>/g, '')}
                       </p>
                       <div className="flex items-center justify-between text-[11px] text-text-dim">
                         <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         <div className="flex items-center gap-3">
                           <span>{likesCount} Likes</span>
                           <span>{commentsCount} Comments</span>
                         </div>
                       </div>
                     </Link>
                   );
                 })}
               </div>
             ) : (
               <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-panel">
                 <p className="text-text-muted">No posts published yet.</p>
               </div>
             )}
           </section>
           
           <section className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
             <h2 className="text-2xl font-bold mb-6 text-white pb-6 border-b border-border">
               Mentee Reviews <span className="text-primary-light ml-2">({mentorReviews.length})</span>
             </h2>

             {mentorReviews.length > 0 ? (
               <div className="space-y-4">
                 {mentorReviews.map(review => (
                   <ReviewCard key={review.id} review={review} />
                 ))}
               </div>
             ) : (
               <div className="text-center py-10 border border-dashed border-border rounded-2xl bg-panel">
                 <p className="text-text-muted">No reviews yet for this mentor.</p>
               </div>
             )}
          </section>

        </div>
      </div>

      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        mentor={mentor} 
      />
    </div>
  );
}
