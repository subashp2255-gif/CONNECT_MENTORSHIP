import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, Users, Video, BookOpen, Star, ArrowRight, UserPlus, CheckCircle2 } from 'lucide-react';
import { useRef, useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StatCard from '../components/shared/StatCard';
import MentorCard from '../components/shared/MentorCard';
import ReviewCard from '../components/shared/ReviewCard';
import { mentors, mentees, reviews } from '../data/mockData';
import { useStore } from '../store/useStore';

export default function Landing() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { setSearchQuery } = useStore();
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search.trim());
    navigate('/mentors');
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-background">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-10">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
           {/* Floating Avatars Background (Simulated via simple absolute positioned elements) */}
           <motion.img initial={{ y: 20, opacity: 0 }} animate={{ y: [0, -20, 0], opacity: 0.6 }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} src={mentors[0].avatar} className="absolute left-[10%] top-[20%] w-16 h-16 rounded-full border border-white/10 blur-[1px]" />
           <motion.img initial={{ y: 20, opacity: 0 }} animate={{ y: [0, 20, 0], opacity: 0.5 }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} src={mentors[1].avatar} className="absolute right-[15%] top-[15%] w-20 h-20 rounded-full border border-white/10 blur-[2px]" />
           <motion.img initial={{ y: 20, opacity: 0 }} animate={{ y: [0, -15, 0], opacity: 0.7 }} transition={{ duration: 4.5, repeat: Infinity, delay: 0 }} src={mentors[2].avatar} className="absolute left-[20%] bottom-[25%] w-14 h-14 rounded-full border border-white/10" />
           <motion.img initial={{ y: 20, opacity: 0 }} animate={{ y: [0, 25, 0], opacity: 0.6 }} transition={{ duration: 6, repeat: Infinity, delay: 1.5 }} src={mentors[3].avatar} className="absolute right-[25%] bottom-[20%] w-24 h-24 rounded-full border border-white/10 blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fadeUp">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center mb-6"
          >
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="Connect"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
              style={{
                filter: 'drop-shadow(0 0 32px rgba(124,58,237,0.6)) drop-shadow(0 0 64px rgba(244,114,182,0.3))',
                animation: 'glowShift 3s ease-in-out infinite'
              }}
            />
          </motion.div>
          <Badge className="mb-6 inline-flex" variant="primary">#1 Platform for College Students</Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Find Your Perfect <br className="hidden md:block" />
            <span className="bg-gradient-brand bg-clip-text text-transparent">College Mentor</span>
          </h1>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            Connect with seniors who've been where you want to go. Get 1-on-1 guidance, mock interviews, and resume reviews from alumni at top companies.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 relative z-20 flex items-center bg-surface p-2 rounded-2xl border border-border shadow-2xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            <Search className="w-6 h-6 text-gray-500 ml-4 absolute left-2 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search by skill (e.g. React, DMA, System Design)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-white placeholder-text-dim focus:ring-0 focus:outline-none"
            />
            <Button type="submit" className="flex-shrink-0 text-sm h-12 px-6 shadow-none">Find Mentors</Button>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/mentors"><Button size="lg" className="w-full sm:w-auto">Browse Mentors</Button></Link>
            <Link to="/register"><Button size="lg" variant="outline" className="w-full sm:w-auto bg-surface"><UserPlus className="w-5 h-5 mr-2" /> Become a Mentor</Button></Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section ref={statsRef} className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isStatsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}>
            <StatCard label="Verified Mentors" value="500+" icon={Users} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isStatsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}>
            <StatCard label="Sessions Completed" value="2000+" icon={Video} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isStatsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }}>
            <StatCard label="Colleges Nationwide" value="50+" icon={BookOpen} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isStatsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.4 }}>
            <StatCard label="Average Rating" value="4.9★" icon={Star} />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">Three simple steps to connect with industry experts and accelerate your career growth.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-brand opacity-20" />
          
          {[
            { step: '01', title: 'Create Profile', desc: 'Sign up and tell us your goals, college, and skills you want to learn.', icon: UserPlus },
            { step: '02', title: 'Find Your Mentor', desc: 'Browse through our curated list of mentors from top companies and colleges.', icon: Search },
            { step: '03', title: 'Book a Session', desc: 'Schedule a 1-on-1 video session based on your mentors availability.', icon: Video }
          ].map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: idx * 0.2 }} className="relative bg-surface border border-border p-8 rounded-3xl text-center group hover:border-primary/50 transition-colors">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-panel border border-border flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all shadow-xl">
                <item.icon className="w-8 h-8 text-primary-light" />
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  {item.step}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED MENTORS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Mentors</h2>
            <p className="text-text-muted text-lg">Learn from the best in the industry.</p>
          </div>
          <Link to="/mentors" className="hidden sm:flex items-center text-primary hover:text-primary-light font-medium transition-colors">
            View All Mentors <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.slice(0, 6).map((mentor, idx) => (
            <motion.div key={mentor.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <MentorCard mentor={mentor} />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
           <Link to="/mentors" className="inline-flex items-center text-primary font-medium">
             View All Mentors <ArrowRight className="w-4 h-4 ml-2" />
           </Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full mb-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Student Success Stories</h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">See how CoNnEcT has helped students land their dream internships and jobs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review, idx) => (
             <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.2 }}>
                <ReviewCard review={review} />
             </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}

// A simple local Badge for Hero section
function Badge({ children, variant, className }) {
  let colorClass = 'bg-white/5 text-gray-300 border-white/10';
  if (variant === 'primary') {
    colorClass = 'bg-primary/20 text-primary-light border-primary/30';
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${colorClass} ${className}`}>
      {children}
    </span>
  );
}
