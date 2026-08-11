import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ChevronRight, ChevronLeft, User, Briefcase, Video, Calendar, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Bio & Photo', icon: User },
  { id: 2, title: 'Skills & Role', icon: Briefcase },
  { id: 3, title: 'Session Types', icon: Video },
  { id: 4, title: 'Availability', icon: Calendar },
  { id: 5, title: 'Go Live', icon: Sparkles }
];

export default function MentorOnboarding({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const { currentUser } = useStore();

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  
  const handleComplete = () => {
    // Mock updating completion score to 100
    toast.success('Profile completed! You are now live.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-background/90 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-panel border border-border rounded-3xl w-full max-w-3xl flex flex-col shadow-2xl relative my-auto max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface text-text-muted hover:text-white transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-6 border-b border-border">
           <h2 className="text-2xl font-bold text-white mb-6">Complete Your Mentor Profile</h2>
           
           <div className="flex justify-between relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface -z-10 -translate-y-1/2" />
             <div className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }} />
             
             {STEPS.map((s) => {
               const Icon = s.icon;
               const isActive = step >= s.id;
               const isCurrent = step === s.id;
               return (
                 <div key={s.id} className="flex flex-col items-center gap-2">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'bg-surface border border-border text-text-muted'}`}>
                     {step > s.id ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                   </div>
                   <span className={`text-xs font-medium hidden sm:block ${isCurrent ? 'text-primary-light' : 'text-text-muted'}`}>{s.title}</span>
                 </div>
               )
             })}
           </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Let mentees know who you are</h3>
                  <div className="flex gap-6 items-center mb-6">
                     <div className="w-24 h-24 rounded-full bg-surface border border-border overflow-hidden shrink-0">
                       {currentUser?.avatar ? <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <User className="w-12 h-12 m-6 text-text-muted" />}
                     </div>
                     <Button variant="outline">Upload Photo</Button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-muted">Short Bio</label>
                    <textarea rows={4} className="w-full bg-surface border border-border rounded-xl p-4 text-white focus:outline-none focus:border-primary resize-none" placeholder="I am a software engineer with 5 years of experience..." defaultValue="Passionate software engineer building scalable systems." />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Your Professional Background</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-muted">Current Role</label>
                      <input type="text" className="w-full bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" defaultValue="Senior Developer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-text-muted">Company</label>
                      <input type="text" className="w-full bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" defaultValue="Tech Corp" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-text-muted">Top Skills (comma separated)</label>
                    <input type="text" className="w-full bg-surface border border-border rounded-xl p-3 text-white focus:outline-none focus:border-primary" defaultValue="React, Node.js, System Design" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4 text-white">What can you help with?</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {['Mock Interview', 'Project Guidance', 'Career Chat', 'Resume Review'].map(type => (
                      <label key={type} className="flex items-start gap-3 p-4 bg-surface border border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                        <input type="checkbox" defaultChecked className="mt-1 accent-primary" />
                        <div>
                          <p className="font-medium text-white">{type}</p>
                          <p className="text-xs text-text-muted mt-1">Provide guidance on {type.toLowerCase()}.</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-4 text-white">Set Your Availability</h3>
                  <p className="text-sm text-text-muted mb-4">Select the days you are typically available for mentoring.</p>
                  <div className="space-y-3">
                    {['Monday', 'Wednesday', 'Friday', 'Saturday'].map(day => (
                      <div key={day} className="flex items-center justify-between p-4 bg-surface border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                           <input type="checkbox" defaultChecked className="accent-primary" />
                           <span className="font-medium text-white">{day}</span>
                        </div>
                        <div className="text-sm text-text-muted">
                           10:00 AM - 4:00 PM
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 text-center py-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white">You're All Set!</h3>
                  <p className="text-text-muted max-w-md mx-auto mb-8">
                    Your profile is complete. You will now appear higher in mentee search results and get 3x more session requests.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-border flex justify-between bg-panel/50 rounded-b-3xl">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrev}><ChevronLeft className="w-4 h-4 mr-2" /> Back</Button>
          ) : <div />}
          
          {step < 5 ? (
            <Button onClick={handleNext}>Next Step <ChevronRight className="w-4 h-4 ml-2" /></Button>
          ) : (
            <Button variant="successSolid" onClick={handleComplete}>
              Publish Profile
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
