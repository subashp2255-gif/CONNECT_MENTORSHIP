import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar as CalendarIcon, Clock, MessageSquare, Video, ArrowRight, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useStore } from '../store/useStore';

export function BookingModal({ isOpen, onClose, mentor }) {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState('');
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const { addSession, currentUser } = useStore();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleConfirm = () => {
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#7c3aed', '#f472b6', '#ffffff']
    });

    // Save session to store
    const scheduledAt = new Date(`${format(date, 'yyyy-MM-dd')}T${time}:00Z`).toISOString();
    
    addSession({
      mentorId: mentor.id,
      menteeId: currentUser.id,
      type: sessionType,
      scheduledAt,
      duration,
      status: 'upcoming',
      meetLink: 'https://meet.google.com/mock-link-abc',
      feedback: null,
      rating: null
    });

    setStep(6); // Success step
  };

  const resetAndClose = () => {
    setStep(1);
    setSessionType('');
    setDuration(30);
    setDate(null);
    setTime('');
    setMessage('');
    onClose();
  };

  const handleDashboardRedirect = () => {
    resetAndClose();
    navigate('/dashboard');
  };

  // Generate next 7 days for the date picker
  const today = startOfToday();
  const next7Days = Array.from({ length: 7 }).map((_, i) => addDays(today, i));
  
  // Mock time slots
  const timeSlots = ['09:00', '10:00', '11:30', '14:00', '16:00', '18:30'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={step !== 6 ? onClose : undefined}
      />
      
      {/* Modal Box */}
      <div className="relative glass-card border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold">Book a Session</h2>
          {step !== 6 && (
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {step < 6 && (
          <div className="w-full h-1 bg-surface">
            <div 
              className="h-full bg-gradient-brand transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6 md:p-8 min-h-[400px] flex flex-col">
          {/* Step 1: Session Type */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">What kind of help do you need?</h3>
              <div className="grid gap-4">
                {mentor.sessionTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSessionType(type)}
                    className={`flex items-center p-4 rounded-xl border transition-all ${sessionType === type ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : 'bg-surface border-white/10 hover:border-white/30'}`}
                  >
                     <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mr-4">
                       {type === 'Mock Interview' && <Video className="w-5 h-5 text-primary" />}
                       {type === 'Project Guidance' && <CheckCircle2 className="w-5 h-5 text-secondary" />}
                       {type === 'Career Chat' && <MessageSquare className="w-5 h-5 text-blue-400" />}
                     </div>
                     <div className="text-left">
                       <div className="font-bold text-lg text-white">{type}</div>
                       <div className="text-sm text-gray-400">1-on-1 personalized session</div>
                     </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Duration */}
          {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">Select duration</h3>
              <div className="grid grid-cols-2 gap-4">
                {[30, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => setDuration(mins)}
                    className={`flex flex-col items-center justify-center p-8 rounded-xl border transition-all ${duration === mins ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : 'bg-surface border-white/10 hover:border-white/30'}`}
                  >
                    <Clock className={`w-8 h-8 mb-3 ${duration === mins ? 'text-primary' : 'text-gray-400'}`} />
                    <span className="text-2xl font-bold text-white mb-1">{mins}</span>
                    <span className="text-sm text-gray-400">minutes</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold mb-6 text-center">When do you want to meet?</h3>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {next7Days.map(d => {
                  const dayName = format(d, 'EEE');
                  const isAvailable = mentor.availability.includes(dayName);
                  const isSelected = date && date.getTime() === d.getTime();
                  
                  return (
                    <button
                      key={d.toISOString()}
                      disabled={!isAvailable}
                      onClick={() => setDate(d)}
                      className={`flex flex-col items-center p-3 rounded-xl border transition-all
                        ${!isAvailable ? 'opacity-30 cursor-not-allowed bg-surface border-white/5' 
                          : isSelected ? 'bg-primary/20 border-primary shadow-lg' 
                          : 'bg-surface border-white/10 hover:border-white/30'}`}
                    >
                      <span className="text-xs text-gray-400 mb-1">{format(d, 'MMM')}</span>
                      <span className="text-xl font-bold text-white mb-1">{format(d, 'd')}</span>
                      <span className="text-xs font-medium">{dayName}</span>
                    </button>
                  );
                })}
              </div>
              {!date && (
                <p className="text-center text-sm text-gray-400 mt-6">
                  Select an available date to continue.
                </p>
              )}
            </div>
          )}

          {/* Step 4: Time Slot */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-xl font-bold mb-2 text-center">Available time slots</h3>
              <p className="text-center text-sm text-gray-400 mb-6">For {date && format(date, 'EEEE, MMMM do')}</p>
              
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`p-3 rounded-xl border text-center transition-all font-medium
                      ${time === slot ? 'bg-primary/20 border-primary shadow-lg text-white' : 'bg-surface border-white/10 hover:border-white/30 text-gray-300'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Message */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 text-center">Add a message</h3>
              <p className="text-center text-sm text-gray-400 mb-6">Briefly describe what you'd like to discuss.</p>
              
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I would like to get some advice on..."
                className="w-full flex-1 min-h-[150px] bg-surface border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 resize-none"
              />
            </div>
          )}

          {/* Step 6: Success */}
          {step === 6 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-white">Booking Confirmed!</h2>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                Your {sessionType} session with {mentor.name} has been scheduled for {date && format(date, 'MMM do')} at {time}.
              </p>
              
              <Card glass className="w-full max-w-sm p-4 text-left mb-8 border-white/10">
                <div className="flex items-center text-sm mb-2">
                  <CalendarIcon className="w-4 h-4 mr-2 text-primary" />
                  <span className="text-gray-300">{date && format(date, 'EEEE, MMMM do, yyyy')}</span>
                </div>
                <div className="flex items-center text-sm mb-2">
                  <Clock className="w-4 h-4 mr-2 text-secondary" />
                  <span className="text-gray-300">{time} ({duration} minutes)</span>
                </div>
                <div className="flex items-center text-sm">
                  <Video className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-blue-400 underline">Google Meet Link provided</span>
                </div>
              </Card>

              <Button onClick={handleDashboardRedirect} variant="primary" className="w-full max-w-sm">
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* Footer Navigation */}
          {step < 6 && (
            <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/5">
              <Button 
                variant="ghost" 
                onClick={step === 1 ? onClose : handleBack}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              
              <Button 
                variant="primary" 
                onClick={step === 5 ? handleConfirm : handleNext}
                disabled={
                  (step === 1 && !sessionType) ||
                  (step === 2 && !duration) ||
                  (step === 3 && !date) ||
                  (step === 4 && !time) ||
                  (step === 5 && !message.trim())
                }
              >
                {step === 5 ? 'Confirm Booking' : 'Next'}
                {step < 5 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
