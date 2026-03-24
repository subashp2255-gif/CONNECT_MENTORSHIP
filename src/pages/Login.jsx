import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, Chrome, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { mentees, mentors } from '../data/mockData';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleLogin = (e, asRole = 'mentee') => {
    e?.preventDefault();
    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      // Mock auth logic: find user in mentees or mentors
      const mentorMatch = mentors.find(m => m.id === 'm1'); // For demo, use m1 if mentor
      const menteeMatch = mentees.find(m => m.id === 'u1'); // For demo, use u1 if mentee
      
      if (asRole === 'mentor') {
        login(mentorMatch, 'mentor');
        navigate('/mentor/dashboard');
      } else {
        login(menteeMatch, 'mentee');
        navigate('/dashboard');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full max-w-md animate-fadeUp">
        
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group justify-center w-full">
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="CoNnEcT" 
              className="w-32 h-32 object-contain mx-auto drop-shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform" 
            />
          </Link>
          <h2 className="text-3xl font-extrabold text-white mb-2">Welcome back</h2>
          <p className="text-text-muted">Sign in to your account to continue</p>
        </div>

        {/* Form Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
          
          <form className="relative z-10 space-y-5" onSubmit={(e) => handleLogin(e, 'mentee')}>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between text-sm py-2">
              <label className="flex items-center text-text-muted hover:text-white cursor-pointer transition-colors">
                <input type="checkbox" className="mr-2 rounded border-border bg-panel text-primary focus:ring-primary focus:ring-offset-background" />
                Remember me
              </label>
              <a href="#" className="font-medium text-primary hover:text-primary-light transition-colors">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} className="mt-2 h-12 text-base">
              Sign In
            </Button>
          </form>

          <div className="mt-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button 
                onClick={(e) => handleLogin(e, 'mentee')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-medium text-white bg-panel hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
              >
                <Chrome className="w-5 h-5" />
                Sign in with Google (Simulate Mentee)
              </button>
              <button 
                onClick={(e) => handleLogin(e, 'mentor')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-medium text-white bg-panel hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              >
                Sign in as Mock Mentor <ArrowRight className="w-4 h-4 ml-1 text-primary-light" />
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-white hover:text-primary-light transition-colors underline decoration-border underline-offset-4">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}
