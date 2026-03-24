import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Calendar as CalendarIcon, Clock, Clock3, Video, 
  CalendarDays, Info, LayoutDashboard, CalendarCheck, X 
} from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import SessionTypeCard from './SessionTypeCard';

const logo = '/logo.png';

export default function BookingModal({ isOpen, onClose, mentor }) {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [meetLink] = useState(
    () => 'meet.google.com/' + 
      Math.random().toString(36).substr(2,4) + '-' +
      Math.random().toString(36).substr(2,4) + '-' +
      Math.random().toString(36).substr(2,4)
  );

  useEffect(() => {
    if (step !== 6) return;

    // First burst — center explosion
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#a78bfa', '#f472b6', '#60a5fa', '#fb923c', '#34d399', '#ffffff'],
      startVelocity: 45,
      gravity: 0.8,
      scalar: 1.1,
    });

    // Second burst — left cannon after 300ms
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#a78bfa', '#f472b6', '#60a5fa'],
      });
    }, 300);

    // Third burst — right cannon after 500ms
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#fb923c', '#34d399', '#f472b6'],
      });
    }, 500);

    // Continuous paper burst for 2 seconds
    const end = Date.now() + 2000;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 90,
        spread: 120,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#a78bfa', '#f472b6', '#60a5fa', '#fb923c'],
        startVelocity: 20,
        gravity: 1.2,
        scalar: 0.8,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [step]);

  const resetBookingData = () => {
    setSessionType('');
    setDuration(30);
    setDate(null);
    setTimeSlot('');
    setMessage('');
  };

  const handleClose = () => {
    if (step === 6) {
      navigate('/dashboard');
    }
    onClose();
    setStep(1);
    resetBookingData();
  };

  const handleConfirm = () => {
    setStep(6);
  };

  if (!isOpen) return null;

  const today = startOfToday();
  const nextDates = Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '06:00 PM'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl overflow-hidden shadow-2xl animate-fadeUp flex flex-col max-h-[90vh]">
        
        {/* Header */}
        {step !== 6 && (
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between bg-panel">
            <h2 className="text-xl font-bold text-white">
              Book a Session
            </h2>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        {step === 6 && (
          <div className="absolute top-4 right-4 z-10">
            <button onClick={handleClose} className="p-2 rounded-full bg-surface/50 hover:bg-white/10 text-gray-400 hover:text-white transition-colors backdrop-blur">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Progress */}
        {step < 6 && (
          <div className="h-1 bg-panel w-full">
            <div 
              className="h-full bg-gradient-brand transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        {/* Content Body */}
        <div className={`flex-1 overflow-y-auto ${step === 6 ? '' : 'p-4 sm:p-6 sm:px-8'} min-h-[300px] custom-scrollbar`}>
          
          {step === 1 && (
            <div className="animate-fadeUp">
              <h3 className="text-lg font-bold mb-4 text-center">What kind of help do you need?</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Mock Interview', 'Project Guidance', 'Career Chat', 'Resume Review'].map(type => (
                  <SessionTypeCard
                    key={type}
                    type={type}
                    selected={sessionType === type}
                    onClick={() => setSessionType(type)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp">
              <h3 className="text-lg font-bold mb-4 text-center">Select duration</h3>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {[30, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl border transition-all ${
                      duration === mins ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-surface border-white/5 hover:border-white/20 text-gray-400'
                    }`}
                  >
                    <Clock className={`w-8 h-8 mb-3 ${duration === mins ? 'text-primary' : ''}`} />
                    <span className="text-2xl font-bold mb-1">{mins}</span>
                    <span className="text-sm">minutes</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeUp">
              <h3 className="text-lg font-bold mb-4 text-center">Select Date</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
                {nextDates.map(d => {
                  const dayName = format(d, 'EEE');
                  const isSelected = date && date.getTime() === d.getTime();
                  // Fake availability
                  const isAvailable = d.getDate() % 2 !== 0; 

                  return (
                    <button
                      key={d.toISOString()}
                      disabled={!isAvailable}
                      onClick={() => setDate(d)}
                      className={`flex flex-col items-center p-3 sm:p-4 rounded-xl border transition-all ${
                        !isAvailable ? 'opacity-30 cursor-not-allowed bg-panel border-transparent' 
                        : isSelected ? 'bg-primary/20 border-primary shadow-[0_0_10px_rgba(124,58,237,0.3)]'
                        : 'bg-surface border-white/5 hover:border-white/30'
                      }`}
                    >
                      <span className="text-[10px] sm:text-xs text-text-muted mb-1">{format(d, 'MMM')}</span>
                      <span className="text-lg sm:text-xl font-bold text-white mb-1">{format(d, 'd')}</span>
                      <span className="text-[10px] font-medium text-text-muted">{dayName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
             <div className="animate-fadeUp">
              <h3 className="text-lg font-bold mb-4 text-center">Select Time Slot</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
                {availableTimes.map((time, idx) => {
                  const isSelected = timeSlot === time;
                  const isAvailable = idx !== 2 && idx !== 4; // Fake unavailability
                  
                  return (
                    <button
                      key={time}
                      disabled={!isAvailable}
                      onClick={() => setTimeSlot(time)}
                      className={`p-3 rounded-xl border text-center transition-all text-sm font-bold ${
                        !isAvailable ? 'opacity-30 cursor-not-allowed bg-panel border-transparent'
                        : isSelected ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                        : 'bg-surface border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fadeUp h-full flex flex-col">
              <h3 className="text-lg font-bold mb-4">Add a message to {mentor?.name.split(' ')[0]}</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I need help with..."
                className="w-full flex-1 min-h-[150px] bg-panel border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col items-center justify-center text-center px-6 py-8 gap-6 min-h-[500px]">
              {/* SECTION 1 - Animated success icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #f472b6)',
                  boxShadow: '0 0 40px rgba(124,58,237,0.5), 0 0 80px rgba(244,114,182,0.3)'
                }}
              >
                <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #f472b6)', opacity: 0.3 }}
                />
              </motion.div>

              {/* SECTION 2 - Thank you heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                  <span style={{
                    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Booking Confirmed!
                  </span>
                </h2>
                <p className="text-text-muted text-sm mt-2 font-mono">
                  Your session has been scheduled successfully
                </p>
              </motion.div>

              {/* SECTION 3 - Session details card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full max-w-sm bg-surface border border-[#2a2a3a] rounded-2xl p-5 text-left"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-[#2a2a3a]">
                  <img src={mentor?.avatar} alt="Mentor Avatar" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <div className="text-white font-semibold text-sm">{mentor?.name}</div>
                    <div className="text-text-dim text-xs font-mono">{mentor?.college} • {mentor?.company}</div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-text-dim font-mono">Session Type</span>
                    </div>
                    <div className="text-xs text-white font-medium">{sessionType || 'Mentorship Session'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-text-dim font-mono">Duration</span>
                    </div>
                    <div className="text-xs text-white font-medium">{duration} minutes</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-text-dim font-mono">Date</span>
                    </div>
                    <div className="text-xs text-white font-medium">{date ? format(date, 'EEE, MMM d yyyy') : 'To be confirmed'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock3 className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-text-dim font-mono">Time</span>
                    </div>
                    <div className="text-xs text-white font-medium">{timeSlot || 'TBD'}</div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs text-text-dim font-mono">Meeting Link</span>
                    </div>
                    <a href="#" 
                      className="text-xs text-primary-light font-mono hover:underline truncate max-w-[130px]"
                      onClick={(e) => { e.preventDefault(); toast.success('Link copied!'); }}
                    >
                      {meetLink}
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* SECTION 4 - Info banner */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="w-full max-w-sm bg-primary/10 border border-primary/20 rounded-xl p-3 flex items-start gap-3"
              >
                <Info className="text-primary w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-primary-light font-mono leading-relaxed text-left">
                  A confirmation has been sent to your email. Your mentor will receive a notification shortly.
                </p>
              </motion.div>

              {/* SECTION 5 - Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="flex flex-col gap-3 w-full max-w-sm"
              >
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    handleClose();
                    navigate('/dashboard');
                    toast.success('Session booked! See you soon 🎉');
                  }}
                  className="w-full py-3 px-6 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #f472b6)' }}
                >
                  <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
                </motion.button>

                <button
                  onClick={() => {
                    handleClose();
                    navigate('/dashboard', { state: { activeTab: 'sessions' } });
                  }}
                  className="w-full py-3 px-6 rounded-xl font-medium text-sm bg-surface border border-[#2a2a3a] text-text-muted hover:border-primary/40 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" /> View My Sessions
                </button>

                <button
                  onClick={() => {
                    setStep(1);
                    resetBookingData();
                  }}
                  className="text-xs text-text-dim hover:text-primary-light transition font-mono bg-transparent border-none pt-2"
                >
                  + Book another session
                </button>
              </motion.div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        {step < 6 && (
          <div className="p-4 sm:p-6 border-t border-border flex justify-between bg-panel mt-auto">
            <Button 
              variant="ghost" 
              onClick={() => step > 1 ? setStep(s => s - 1) : handleClose()}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button 
              variant="primary" 
              onClick={() => step === 5 ? handleConfirm() : setStep(s => s + 1)}
              disabled={
                (step === 1 && !sessionType) ||
                (step === 2 && !duration) ||
                (step === 3 && !date) ||
                (step === 4 && !timeSlot) ||
                (step === 5 && !message.trim())
              }
            >
              {step === 5 ? 'Confirm Booking' : 'Next'}
            </Button>
          </div>
        )}
        
      </div>
    </div>
  );
}
