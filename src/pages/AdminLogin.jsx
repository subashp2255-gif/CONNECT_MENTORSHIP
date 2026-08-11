import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useStore } from '../store/useStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError('Enter a valid email address');
      hasError = true;
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }
    
    if (hasError) return;

    setIsLoading(true);

    try {
      // Simulate network request latency
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const { users } = useStore.getState();
      const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

      if (!user) {
        throw new Error('Invalid credentials.');
      }

      if (password.trim() !== user.password) {
        throw new Error('Invalid credentials.');
      }

      // Check admin status
      if (user.role !== 'admin') {
        throw new Error('This account does not have administrator access.');
      }

      if (user.accountStatus !== 'active') {
        throw new Error('Your administrator account has been disabled.');
      }

      login(user, 'admin');
      toast.success(`Access Granted. Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/admin/dashboard');

    } catch (error) {
      console.error('Admin Auth Error:', error);
      toast.error(error.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full bg-background min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 18 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md"
      >
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group justify-center w-full">
            <div 
              className="relative w-36 h-36 flex items-center justify-center select-none pointer-events-none"
              style={{
                animation: 'float 2s ease-in-out infinite'
              }}
            >
              {/* Orbiting Rings */}
              <div 
                className="absolute w-[155px] h-[155px] rounded-full border-t border-r border-transparent" 
                style={{
                  borderTopColor: 'rgba(124,58,237,0.5)',
                  borderRightColor: 'rgba(124,58,237,0.15)',
                  animation: 'spin 4s linear infinite'
                }}
              />
              <div 
                className="absolute w-[172px] h-[172px] rounded-full border-b border-l border-transparent" 
                style={{
                  borderBottomColor: 'rgba(244,114,182,0.4)',
                  borderLeftColor: 'rgba(244,114,182,0.12)',
                  animation: 'spin 6s linear infinite reverse'
                }}
              />

              {/* Orbiting Dots */}
              <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: '#a78bfa', animation: 'orbit-large 3s linear infinite' }} />
              <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: '#f472b6', animation: 'orbit-large 5s linear infinite', animationDelay: '-1.5s' }} />
              <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: '#60a5fa', animation: 'orbit-large 4s linear infinite', animationDelay: '-2s' }} />
              <div className="absolute w-1.5 h-1.5 rounded-full" style={{ background: '#fb923c', animation: 'orbit-large 6s linear infinite', animationDelay: '-3s' }} />

              <img 
                src={`${import.meta.env.BASE_URL || '/'}logo.png`} 
                alt="CoNnEcT" 
                className="w-36 h-36 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:scale-105 transition-transform" 
                style={{
                  animation: 'glowShift 3s ease-in-out infinite'
                }}
              />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
            <span className="font-brand bg-gradient-brand bg-clip-text text-transparent tracking-widest uppercase text-3xl">CoNnEcT</span> Control Console
          </h2>
          <p className="text-text-muted text-xs mt-2">Sign in to access system administration portal</p>
        </div>

        {/* Form Box */}
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Ambient light overlay */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
          
          <form className="space-y-5 relative z-10" onSubmit={handleLogin}>
            
            {/* Email input */}
            <div className="space-y-1">
              <Input
                label="Administrator Email"
                required
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={emailError}
                icon={Mail}
              />
            </div>

            {/* Password input */}
            <div className="space-y-1 relative">
              <Input
                label="Access Password"
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={passwordError}
                icon={Lock}
              />
              <button
                type="button"
                className="absolute right-3.5 top-[39px] text-text-dim hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Options row */}
            <div className="flex items-center justify-between text-xs font-semibold text-text-muted pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  className="rounded border-border bg-panel text-primary focus:ring-primary w-4 h-4" 
                />
                <span>Remember console session</span>
              </label>
              <button 
                type="button"
                onClick={() => toast('Please contact the head of security to reset your administrator credentials.', { icon: '🔒' })}
                className="text-primary-light hover:underline hover:text-white transition-colors"
              >
                Forgot credentials?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Sign In to Console
            </Button>

          </form>

        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link 
            to="/login" 
            className="text-xs font-semibold text-text-dim hover:text-white transition-colors"
          >
            ← Back to Standard Portal Login
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
