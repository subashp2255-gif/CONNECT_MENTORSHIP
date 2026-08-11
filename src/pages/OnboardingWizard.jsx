import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { useStore } from '../store/useStore';

const skillsList = ['React', 'Node.js', 'DSA', 'System Design', 'Machine Learning', 'DevOps'];
const availabilitySlots = ['Weekday Morning', 'Weekday Evening', 'Weekend Morning', 'Weekend Evening'];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { completeOnboarding, addNotification } = useStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('mentee');
  const [skills, setSkills] = useState([]);
  const [availability, setAvailability] = useState([]);

  const toggle = (value, list, setter) =>
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);

  const handleNext = () => {
    if (step === 1) {
      if (!role) {
        toast.error('Please select a role');
        return;
      }
    } else if (step === 2) {
      if (skills.length === 0) {
        toast.error('Please select at least one skill/interest');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const submit = () => {
    if (availability.length === 0) {
      toast.error('Please set your availability');
      return;
    }
    completeOnboarding({ role, skills, interests: skills, availability: { preferred: availability } });
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#7c3aed', '#f472b6', '#ffffff'] });
    toast.success('Onboarding completed successfully.');
    navigate(role === 'mentor' ? '/mentor/dashboard' : '/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Onboarding Wizard</h1>
        <p className="text-text-muted mb-8">Set up your CoNnEcT profile in 3 quick steps.</p>

        {step === 1 && (
          <div>
            <p className="text-white font-semibold mb-4">Choose your role</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {['mentor', 'mentee'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`rounded-2xl border p-5 text-left transition-colors ${
                    role === item ? 'border-primary bg-primary/10 text-white' : 'border-border bg-panel text-text-muted hover:text-white'
                  }`}
                >
                  <p className="font-semibold capitalize">{item}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-white font-semibold mb-4">Pick skills / interests</p>
            <div className="flex flex-wrap gap-3">
              {skillsList.map((item) => {
                const isSelected = skills.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(item, skills, setSkills)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      isSelected ? 'border-primary bg-primary/20 text-primary-light' : 'border-border text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item}
                    {isSelected && <X className="w-3.5 h-3.5 mt-0.5 opacity-70 hover:opacity-100" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="text-white font-semibold mb-4">Set availability</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {availabilitySlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => toggle(slot, availability, setAvailability)}
                  className={`px-4 py-3 rounded-xl border text-sm transition-colors ${
                    availability.includes(slot) ? 'border-primary bg-primary/10 text-primary-light' : 'border-border text-text-muted hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={() => setStep((prev) => Math.max(1, prev - 1))} disabled={step === 1}>
            Back
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={submit}>Complete Setup</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
