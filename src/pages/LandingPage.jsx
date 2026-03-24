import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Star, Users, Video, BookOpen, Clock, Target, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useStore } from '../store/useStore';

const stats = [
  { label: 'Verified Mentors', value: '500+', icon: Users, color: 'text-primary' },
  { label: 'Mentorship Sessions', value: '2000+', icon: Video, color: 'text-secondary' },
  { label: 'Partner Colleges', value: '50+', icon: BookOpen, color: 'text-blue-500' },
  { label: 'Average Rating', value: '4.9/5', icon: Star, color: 'text-yellow-500' },
];

const steps = [
  { title: 'Find your match', description: 'Browse through our curated list of mentors from top tech companies.', icon: Search },
  { title: 'Book a session', description: 'Pick a time that works for you and schedule a video call.', icon: Clock },
  { title: 'Achieve your goals', description: 'Get personalized guidance to crack interviews and build your career.', icon: Target },
];

export function LandingPage() {
  const { mentors, reviews } = useStore();
  const topMentors = mentors.slice(0, 6);
  const featuredReviews = reviews.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-6 py-1 px-4 text-sm font-normal rounded-full border-white/10 bg-white/5 backdrop-blur-md">
            🚀 The #1 Mentorship Platform for College Students
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Find Your Perfect <br className="hidden md:block"/>
            <span className="text-gradient">College Mentor</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Connect with alumni from top companies like Google, Microsoft, and Amazon. Get 1-on-1 guidance to accelerate your career.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto mb-16">
            <Link to="/mentors" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full text-lg h-14">
                Find a Mentor
              </Button>
            </Link>
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="glass" className="w-full text-lg h-14">
                Become a Mentor
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/5">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center px-4"
              >
                <stat.icon className={`w-8 h-8 mb-4 ${stat.color} opacity-80`} />
                <h3 className="text-3xl font-bold font-mono mb-2">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Three simple steps to connect with industry experts and start your mentorship journey.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 -z-10" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative"
            >
              <Card glass className="h-full pt-8 text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <CardContent>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Mentors */}
      <section className="py-24 bg-surface/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Rated Mentors</h2>
              <p className="text-gray-400">Learn from professionals who have walked your path.</p>
            </div>
            <Link to="/mentors" className="hidden sm:flex items-center text-primary hover:text-primary-light transition-colors group">
              View all
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topMentors.map((mentor) => (
              <motion.div key={mentor.id} whileHover={{ y: -5 }}>
                <Card glass className="overflow-hidden group flex flex-col h-full cursor-pointer" onClick={() => window.location.href=`/mentors/${mentor.id}`}>
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                    <img 
                      src={mentor.photo} 
                      alt={mentor.name} 
                      className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl border-4 border-surface object-cover bg-surface"
                    />
                  </div>
                  <CardContent className="pt-12 pb-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{mentor.name}</h3>
                        <p className="text-sm text-gray-400">{mentor.company} • {mentor.college}</p>
                      </div>
                      <div className="flex items-center bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-md text-xs font-bold">
                        <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                        {mentor.rating}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {mentor.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/mentors">
              <Button variant="outline" className="w-full">View all mentors</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Stories of Success</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredReviews.map((review, i) => {
            const reviewer = useStore.getState().mentees.find(m => m.id === review.menteeId);
            return (
              <Card glass key={review.id} className="p-8 relative">
                <p className="text-gray-300 italic mb-6 relative z-10">"{review.comment}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center font-bold text-white text-sm">
                    {reviewer?.name.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{reviewer?.name || 'Student'}</h4>
                    <p className="text-xs text-gray-500">{reviewer?.college}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

    </div>
  );
}
