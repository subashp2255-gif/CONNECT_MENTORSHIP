import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Chrome, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { mentees, mentors } from '../data/mockData';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useStore();

  const handleLogin = async (e, asRole = 'mentee') => {
    e?.preventDefault();
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    }
    
    // Validate password min 6 chars
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.trim().length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }
    
    if (hasError) return;

    setIsLoading(true);

    try {
      // MOCK LOGIN
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { users } = useStore.getState();
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (password.trim() !== user.password) {
        throw new Error('Invalid email or password');
      }

      if (user.accountStatus === 'blocked') {
        throw new Error('Your CONNECT account has been blocked. Contact support for more information.');
      }
      if (user.accountStatus === 'suspended') {
        throw new Error('Your account is temporarily suspended. Please contact admin.');
      }
      if (user.accountStatus === 'deleted') {
        throw new Error('This account has been deleted.');
      }

      // If user is admin logging in via normal login page, let's allow it but redirect to admin dashboard
      if (user.role === 'admin') {
        login(user, 'admin');
        toast.success(`Welcome back, Admin ${user.name.split(' ')[0]}!`);
        navigate('/admin/dashboard');
        return;
      }

      login(user, user.role);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      
      if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockLogin = async (role) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const { users } = useStore.getState();
      const user = users.find(u => u.role === role && u.accountStatus === 'active');
      if (!user) {
        throw new Error(`No active ${role} user found for mock login.`);
      }

      login(user, user.role);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      
      if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Mock Login error:', error);
      toast.error(error.message || 'Mock login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-10">
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              required
            />
            
            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
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
                type="button"
                onClick={() => handleMockLogin('mentee')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl text-sm font-medium text-white bg-panel hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-white"
              >
                <Chrome className="w-5 h-5" />
                Sign in with Google (Simulate Mentee)
              </button>
              <button 
                type="button"
                onClick={() => handleMockLogin('mentor')}
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
        <p className="mt-4 text-center text-xs text-text-dim">
          Are you an administrator?{' '}
          <Link to="/admin/login" className="font-semibold text-primary-light hover:text-white hover:underline transition-colors">
            Login to Console
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
