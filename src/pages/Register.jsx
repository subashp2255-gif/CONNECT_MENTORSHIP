import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, GraduationCap, Star, ArrowRight, ArrowLeft, Target, Briefcase, Rocket, BookOpen, Trophy, Compass, CheckCircle2, Building2, Search } from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

import { useStore } from '../store/useStore';
import { mentees, mentors } from '../data/mockData';


import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import FileUpload from '../components/ui/FileUpload';
import TagInput from '../components/ui/TagInput';
import ToggleCard from '../components/ui/ToggleCard';
import StepProgress from '../components/ui/StepProgress';
import WeeklyGrid from '../components/ui/WeeklyGrid';
import Autocomplete from '../components/ui/Autocomplete';
import Select from '../components/ui/Select';
import { cn } from '../utils/helpers';

const COLLEGES = ['BITS Pilani', 'BITS Sathy', 'IIT Madras', 'IIT Bombay', 'IIT Delhi', 'NIT Trichy', 'NIT Surathkal', 'VIT Vellore', 'PSG Tech', 'Anna University', 'Amrita', 'SRM', 'Manipal'];
const BRANCHES = ['Computer Science', 'Electronics & Communication', 'Information Technology', 'Artificial Intelligence & Data Science', 'Mechanical', 'Civil', 'Other'];
const COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Razorpay', 'CRED', 'Swiggy', 'Infosys', 'Zoho', 'Freshworks', 'Wipro', 'TCS', 'Accenture', 'Startup'];
const ROLES = ['SDE Intern', 'SDE 1', 'SDE 2', 'Senior SDE', 'ML Engineer', 'Data Scientist', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer'];

const TECH_SKILLS = ['React', 'Node.js', 'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'DSA', 'System Design', 'Machine Learning', 'Deep Learning', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Flutter', 'Swift'];
const DOMAINS = ['Web Development', 'Mobile Development', 'Machine Learning', 'Data Science', 'DevOps', 'Cloud Computing', 'Competitive Programming', 'UI/UX Design', 'Blockchain', 'Cybersecurity'];
const LANGUAGES = ['Python', 'Java', 'C++', 'JavaScript', 'Go', 'Rust', 'Kotlin', 'Swift'];
const TOOLS = ['VS Code', 'Git', 'Docker', 'Figma', 'Postman', 'AWS', 'Firebase'];

export default function Register() {
  const navigate = useNavigate();
  const { login } = useStore();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null); // 'mentor' | 'mentee'
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', profilePhoto: null, phone: '', gender: '',
    college: '', branch: '', year: '', cgpa: '', graduationYear: '',
    placementStatus: '', currentCompany: '', jobRole: '', employmentType: '', workExperience: '', ctc: '', offerLetter: null,
    internCompany: '', internRole: '', internType: '', internDuration: '', internSource: '', stipend: '', ppoExpected: false,
    targeting: [], targetCompanies: [], targetRoles: [], targetCtc: '', prepStatus: '', interviewsGiven: '', prepNote: '',
    focusAreas: [], whyGoodMentor: '', notableAchievements: [],
    linkedin: '', github: '', portfolio: '', pastExperience: '',
    technicalSkills: [], domainExpertise: [], programmingLanguages: [], tools: [], hasCP: false, leetcode: '', codeforces: '', codechef: '',
    sessionTypes: [], preferredDuration: '', maxMenteesPerWeek: 3, mentoringLanguages: [], mentorExperience: '',
    availability: {}, timezone: 'IST', availableFrom: '',
    bio: '', journey: '', whatICanHelpWith: '', achievements: [], featuredConsent: false,
    menteeGoals: [], menteeSkillLevel: '', menteeTopics: [], menteeIntro: '' // mentee specific
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const nextStep = (e) => {
    e?.preventDefault();
    
    // Manual validation for smoother UX
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        return;
      }
    }

    if (step === 2) {
      if (!formData.college || !formData.branch || !formData.year || !formData.graduationYear) {
        toast.error('Please fill all academic details');
        return;
      }
    }

    setStep(s => s + 1);
  };

  const prevStep = () => {
    setStep(s => Math.max(0, s - 1));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitLoading(true);

    try {
      // MOCK REGISTRATION
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network request
      
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        accountStatus: 'active',
        isVerified: role === 'mentee',
        approvalStatus: role === 'mentor' ? 'Pending' : undefined,
        avatar: formData.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=7c3aed&color=fff&size=200`,
        college: formData.college,
        branch: formData.branch,
        year: formData.year || '1st',
        company: formData.currentCompany || formData.internCompany || '',
        skills: formData.technicalSkills || [],
        bio: formData.bio || '',
        linkedin: formData.linkedin || '',
        github: formData.github || '',
        portfolio: formData.portfolio || '',
        sessionTypes: formData.sessionTypes || ['Career Chat'],
        isAvailable: true,
        verificationDocuments: role === 'mentor' ? ['Resume_Uploaded.pdf'] : [],
        createdAt: new Date().toISOString()
      };

      const { registerNewUser } = useStore.getState();
      registerNewUser(newUser);

      const { users } = useStore.getState();
      const savedUser = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase()) || newUser;

      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#7c3aed', '#f472b6', '#ffffff'] });
      toast.success('Registration successful!', { style: { background: '#16161e', color: '#fff', border: '1px solid #2a2a3a' } });
      
      login(savedUser, role);
      setStep(100);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const addAchievement = () => {
    if (formData.achievements.length >= 6) return;
    update('achievements', [...formData.achievements, { category: 'Internship', description: '' }]);
  };

  const updateAchievement = (idx, field, val) => {
    const newA = [...formData.achievements];
    newA[idx][field] = val;
    update('achievements', newA);
  };

  const removeAchievement = (idx) => {
    update('achievements', formData.achievements.filter((_, i) => i !== idx));
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-6 pt-4 animate-fadeUp max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">Join <span className="font-brand text-primary-light uppercase tracking-widest font-normal text-4xl">CoNnEcT</span></h2>
            <p className="text-text-muted">Choose how you want to use the platform.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <ToggleCard 
              selected={role === 'mentee'}
              onClick={() => { setRole('mentee'); setStep(1); }}
              icon={GraduationCap}
              title="I'm a Student"
              subtitle="Find mentors, book sessions, grow your career"
              bullets={['Browse 500+ mentors', 'Book free sessions', 'Track your goals']}
            />
            <ToggleCard 
              selected={role === 'mentor'}
              onClick={() => { setRole('mentor'); setStep(1); }}
              icon={Star}
              title="I'm a Senior / Alumni"
              subtitle="Share your experience, guide the next generation"
              bullets={['Build your profile', 'Set your availability', 'Help students grow']}
            />
          </div>
        </div>
      );
    }
    
    if (step === 100) {
      return (
        <div className="bg-surface border border-border rounded-3xl p-10 text-center shadow-2xl animate-fadeUp max-w-xl mx-auto mt-20">
          <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to <span className="font-brand text-primary-light uppercase tracking-widest font-normal">CoNnEcT</span>, {formData.name.split(' ')[0]}! 🎉</h2>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">
            {role === 'mentor' 
              ? "Your profile is under review. We'll notify you within 24 hours." 
              : "You're all set! Start finding your perfect mentor today."}
          </p>
          <Button size="lg" fullWidth onClick={() => navigate('/onboarding')}>
             Continue to Onboarding <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )
    }

    const isMentor = role === 'mentor';
    const totalSteps = isMentor ? 8 : 3;
    const progressSteps = isMentor ? [
      { title: 'Identity' }, { title: 'Academics' }, { title: 'Professional' }, { title: 'Skills' }, 
      { title: 'Preferences' }, { title: 'Availability' }, { title: 'About You' }, { title: 'Review' }
    ] : [
      { title: 'Identity' }, { title: 'Academics' }, { title: 'Your Goals' }
    ];

    return (
      <div className="max-w-3xl mx-auto w-full pt-10 pb-24">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group justify-center w-full">
           <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CoNnEcT" className="w-32 h-32 object-contain mx-auto drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        </Link>
        <StepProgress currentStep={step} totalSteps={totalSteps} steps={progressSteps} />

        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <form noValidate onSubmit={step === totalSteps ? handleFinalSubmit : nextStep} className="space-y-8 animate-fadeUp">
            
            {/* COMMON: STEP 1 - Basic Identity */}
            {step === 1 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Basic Identity</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Full Name" placeholder="John Doe" value={formData.name} onChange={e=>update('name', e.target.value)} required />
                  <Input label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={e=>update('email', e.target.value)} required />
                  <Input label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={e=>update('password', e.target.value)} required minLength={8} />
                  <Input label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={e=>update('confirmPassword', e.target.value)} required 
                         error={formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords do not match" : ""} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Input label="Phone Number" type="tel" placeholder="+91 9876543210" value={formData.phone} onChange={e=>update('phone', e.target.value)} />
                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">Gender</label>
                    <div className="flex gap-4">
                      {['Male', 'Female', 'Prefer not to say'].map(g => (
                        <label key={g} className="flex items-center gap-2 text-sm text-gray-300">
                          <input type="radio" name="gender" checked={formData.gender === g} onChange={() => update('gender', g)} className="bg-panel border-border text-primary focus:ring-primary" /> {g}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <FileUpload label="Profile Photo" value={formData.profilePhoto?.file} preview={formData.profilePhoto?.preview} onChange={(data) => update('profilePhoto', data)} />
              </>
            )}

            {/* COMMON: STEP 2 - Academic Info */}
            {step === 2 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Academic Info</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Autocomplete label="College / University" required suggestions={[...COLLEGES, 'Other']} placeholder="Search college..." value={formData.college} onChange={v=>update('college', v)} />
                  <Select
                    label="Branch / Department"
                    required
                    options={BRANCHES}
                    value={formData.branch}
                    onChange={v => update('branch', v)}
                    placeholder="Select Branch"
                  />
                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Year / Status <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-4">
                      {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'].map(y => (
                        <label key={y} className="flex items-center gap-2 text-sm text-gray-300">
                          <input required type="radio" name="year" checked={formData.year === y} onChange={() => update('year', y)} className="bg-panel border-border text-primary focus:ring-primary" /> {y}
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {formData.year !== 'Alumni' && (
                    <Input label="CGPA (Optional)" type="number" min="0" max="10" step="0.01" placeholder="e.g. 8.5" value={formData.cgpa} onChange={e=>update('cgpa', e.target.value)} />
                  )}
                  
                  <Select
                    label="Graduation Year"
                    required
                    options={Array.from({length: 11}, (_, i) => 2020 + i)}
                    value={formData.graduationYear}
                    onChange={v => update('graduationYear', v)}
                    placeholder="Select Year"
                  />
                </div>
              </>
            )}

            {/* MENTEE: STEP 3 - Goals */}
            {!isMentor && step === 3 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Your Goals</h3>
                <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">What are you looking for? <span className="text-red-500">*</span></label>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[ { t: 'Crack Internships', i: Target }, { t: 'Get Placed (Full Time)', i: Briefcase }, { t: 'Build Projects', i: Rocket }, { t: 'Learn New Skills', i: BookOpen }, { t: 'Competitive Programming', i: Trophy }, { t: 'Career Guidance', i: Compass }].map(goal => (
                    <ToggleCard 
                      key={goal.t}
                      selected={formData.menteeGoals.includes(goal.t)}
                      onClick={() => {
                        const newGoals = formData.menteeGoals.includes(goal.t) ? formData.menteeGoals.filter(g => g !== goal.t) : [...formData.menteeGoals, goal.t];
                        update('menteeGoals', newGoals);
                      }}
                      icon={goal.i}
                      title={goal.t}
                    />
                  ))}
                </div>
                
                <div className="mb-8">
                  <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Current Skill Level <span className="text-red-500">*</span></label>
                  <div className="flex gap-6">
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                      <label key={l} className="flex items-center gap-2 text-sm text-gray-300">
                        <input required type="radio" name="menteeLevel" checked={formData.menteeSkillLevel === l} onChange={() => update('menteeSkillLevel', l)} className="bg-panel border-border text-primary focus:ring-primary" /> {l}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <TagInput label="What topics do you need help with?" required placeholder="e.g. React, DSA..." tags={formData.menteeTopics} onChange={v=>update('menteeTopics', v)} suggestions={TECH_SKILLS} />
                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">Brief Intro (Optional)</label>
                    <textarea maxLength={200} className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-colors" placeholder="I am a 2nd year student looking to master frontend engineering..." value={formData.menteeIntro} onChange={e=>update('menteeIntro', e.target.value)} />
                    <p className="text-right text-xs text-text-dim mt-1">{formData.menteeIntro.length} / 200</p>
                  </div>
                </div>
              </>
            )}

            {/* ─── REPLACE STEP 3 START ─── */}
            {isMentor && step === 3 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Professional Info</h3>
                
                <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">What is your current status? <span className="text-red-500">*</span></label>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <ToggleCard 
                    selected={formData.placementStatus === 'placed'}
                    onClick={() => update('placementStatus', 'placed')}
                    icon={Briefcase} title="Placed / Working" subtitle="I have a full-time job offer or currently working" 
                  />
                  <ToggleCard 
                    selected={formData.placementStatus === 'intern'}
                    onClick={() => update('placementStatus', 'intern')}
                    icon={Building2} title="Doing Internship" subtitle="I am currently doing an internship" 
                  />
                  <ToggleCard 
                    selected={formData.placementStatus === 'looking'}
                    onClick={() => update('placementStatus', 'looking')}
                    icon={Search} title="Looking for Opportunities" subtitle="I am actively applying for jobs or internships" 
                  />
                  <ToggleCard 
                    selected={formData.placementStatus === 'studying'}
                    onClick={() => update('placementStatus', 'studying')}
                    icon={GraduationCap} title="Still Studying" subtitle="I am focused on academics, not actively applying" 
                  />
                </div>

                <AnimatePresence mode="wait">
                  {formData.placementStatus && (
                    <motion.div
                      key={formData.placementStatus}
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-border flex-1"></div>
                        <span className="font-mono text-xs text-text-dim uppercase tracking-widest">Details</span>
                        <div className="h-px bg-border flex-1"></div>
                      </div>

                      <div className="bg-surface/50 border border-border rounded-2xl p-6 mb-8 space-y-6">
                        
                        {formData.placementStatus === 'placed' && (
                          <div className="grid md:grid-cols-2 gap-6">
                            <Autocomplete label="Current Company" required suggestions={['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Flipkart', 'Razorpay', 'CRED', 'Swiggy', 'Zomato', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'Zoho', 'Freshworks', 'Paytm', 'Ola', 'Byju\'s', 'Startup', 'Other']} placeholder="Search company..." value={formData.currentCompany} onChange={v=>update('currentCompany', v)} />
                            <Autocomplete label="Job Role / Designation" required suggestions={['SDE 1', 'SDE 2', 'Senior SDE', 'ML Engineer', 'Data Scientist', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 'Product Manager', 'UI/UX Designer']} placeholder="e.g. SDE 1" value={formData.jobRole} onChange={v=>update('jobRole', v)} />
                            
                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Employment Type <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-4">
                                {['Full Time', 'Contract', 'Remote'].map(e => (
                                  <label key={e} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input required type="radio" name="emptype" checked={formData.employmentType === e} onChange={() => update('employmentType', e)} className="bg-panel border-border text-primary focus:ring-primary" /> {e}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Work Experience <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-4">
                                {['Less than 1 Year', '1-2 Years', '2-3 Years', '3+ Years'].map(e => (
                                  <label key={e} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input required type="radio" name="exp" checked={formData.workExperience === e} onChange={() => update('workExperience', e)} className="bg-panel border-border text-primary focus:ring-primary" /> {e}
                                  </label>
                                ))}
                              </div>
                            </div>

                            <Select
                              label="Annual CTC (Optional)"
                              options={['Prefer not to say', 'Under 5 LPA', '5-10 LPA', '10-20 LPA', '20-30 LPA', '30+ LPA']}
                              value={formData.ctc}
                              onChange={v => update('ctc', v)}
                              placeholder="Select Range"
                            />
                            
                            <FileUpload label="Upload Offer Letter (optional - builds trust with mentees)" value={formData.offerLetter?.file} preview={formData.offerLetter?.preview} onChange={(data) => update('offerLetter', data)} accept=".pdf,image/*" />
                            <p className="text-xs text-text-dim col-span-2">🔒 Only shown as verified badge, not publicly visible</p>
                          </div>
                        )}

                        {formData.placementStatus === 'intern' && (
                          <div className="grid md:grid-cols-2 gap-6">
                            <Autocomplete label="Internship Company" required suggestions={['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Flipkart', 'Razorpay', 'CRED', 'Swiggy', 'Zomato', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'Zoho', 'Freshworks', 'Paytm', 'Ola', 'Byju\'s', 'Startup', 'Other']} placeholder="Search company..." value={formData.internCompany} onChange={v=>update('internCompany', v)} />
                            <Autocomplete label="Internship Role" required suggestions={['SDE Intern', 'ML Intern', 'Data Science Intern', 'Product Intern', 'Design Intern', 'Research Intern', 'Full Stack Intern']} placeholder="e.g. SDE Intern" value={formData.internRole} onChange={v=>update('internRole', v)} />
                            
                            <div className="col-span-2 md:col-span-1">
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Internship Type <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-4">
                                {['On-site', 'Remote', 'Hybrid'].map(e => (
                                  <label key={e} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input required type="radio" name="internType" checked={formData.internType === e} onChange={() => update('internType', e)} className="bg-panel border-border text-primary focus:ring-primary" /> {e}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Internship Duration <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-4">
                                {['2 Months', '3 Months', '6 Months', 'More than 6 Months'].map(e => (
                                  <label key={e} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input required type="radio" name="internDuration" checked={formData.internDuration === e} onChange={() => update('internDuration', e)} className="bg-panel border-border text-primary focus:ring-primary" /> {e}
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="col-span-2 text-sm text-gray-300">
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">How did you get this internship?</label>
                              <div className="flex flex-wrap gap-4">
                                {['Campus Placement', 'Off-Campus', 'Referral', 'Direct Apply', 'Hackathon'].map(e => (
                                  <label key={e} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input type="radio" name="internSource" checked={formData.internSource === e} onChange={() => update('internSource', e)} className="bg-panel border-border text-primary focus:ring-primary" /> {e}
                                  </label>
                                ))}
                              </div>
                            </div>

                            <Select
                              label="Stipend Range (Optional)"
                              className="col-span-2 md:col-span-1"
                              options={['Prefer not to say', 'Under ₹10k/month', '₹10k-20k', '₹20k-40k', '₹40k-60k', '₹60k+']}
                              value={formData.stipend}
                              onChange={v => update('stipend', v)}
                              placeholder="Select Range"
                            />

                            <div className="col-span-2 md:col-span-1 flex items-center h-full pt-6">
                              <label className="flex items-center gap-3 cursor-pointer border border-border rounded-xl bg-panel px-4 py-3 w-full">
                                <span className="font-bold text-white text-sm">Are you expecting a Pre-Placement Offer?</span>
                                <input type="checkbox" className="ml-auto w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary" checked={formData.ppoExpected} onChange={e=>update('ppoExpected', e.target.checked)} />
                              </label>
                            </div>
                          </div>
                        )}

                        {formData.placementStatus === 'looking' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">What are you targeting? <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-2">
                                {['Full Time Job', 'Internship', 'Research', 'Higher Studies (MS/MBA)', 'Startup'].map(t => {
                                  const sel = formData.targeting.includes(t);
                                  return (
                                    <button
                                      key={t} type="button"
                                      onClick={() => update('targeting', sel ? formData.targeting.filter(x=>x!==t) : [...formData.targeting, t])}
                                      className={cn("px-4 py-2 border rounded-full text-xs font-bold transition-all", sel ? "bg-primary/20 text-primary-light border-primary" : "bg-panel border-border text-gray-400 hover:text-white")}
                                    >
                                      {sel ? '✓ ' : ''}{t}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                               <TagInput label="Target Companies (Optional)" placeholder="Type company name and press Enter..." tags={formData.targetCompanies} onChange={v=>update('targetCompanies', v)} suggestions={['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Razorpay']} />
                               <TagInput label="Target Roles (Optional)" placeholder="SDE, ML Engineer, Data Scientist..." tags={formData.targetRoles} onChange={v=>update('targetRoles', v)} />
                               
                               <Select
                                 label="Target CTC (Optional)"
                                 className="col-span-2 md:col-span-1"
                                 options={['No preference', '5-10 LPA', '10-20 LPA', '20+ LPA']}
                                 value={formData.targetCtc}
                                 onChange={v => update('targetCtc', v)}
                                 placeholder="Select Range"
                               />

                              <Input label="Interviews Given So Far" type="number" placeholder="How many interviews have you appeared in?" value={formData.interviewsGiven} onChange={e=>update('interviewsGiven', e.target.value)} />
                            </div>

                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Current Preparation Status <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-4">
                                {['Just Started', 'Actively Preparing', 'Almost Ready', 'Appeared in Interviews'].map(e => (
                                  <label key={e} className="flex items-center gap-2 text-sm text-gray-300">
                                    <input required type="radio" name="prepStatus" checked={formData.prepStatus === e} onChange={() => update('prepStatus', e)} className="bg-panel border-border text-primary focus:ring-primary" /> {e}
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">Preparation Note (Optional)</label>
                              <textarea maxLength={200} className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-colors" placeholder="What are you currently preparing? e.g. Doing DSA on LeetCode, preparing system design..." value={formData.prepNote} onChange={e=>update('prepNote', e.target.value)} />
                            </div>

                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-primary-light text-sm flex gap-3 items-start">
                              <span className="shrink-0 text-xl">💜</span>
                              <p>Being honest about your journey helps mentees relate to you better. Many students prefer mentors who are still on the path — your experience is valuable!</p>
                            </div>
                          </div>
                        )}

                        {formData.placementStatus === 'studying' && (
                          <div className="space-y-6">
                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Main Focus Area <span className="text-red-500">*</span></label>
                              <div className="flex flex-wrap gap-2">
                                {['Academics', 'DSA & Competitive Programming', 'Building Projects', 'Open Source', 'Research', 'Learning New Technologies', 'Teaching Others'].map(t => {
                                  const sel = formData.focusAreas.includes(t);
                                  return (
                                    <button
                                      key={t} type="button"
                                      onClick={() => update('focusAreas', sel ? formData.focusAreas.filter(x=>x!==t) : [...formData.focusAreas, t])}
                                      className={cn("px-4 py-2 border rounded-full text-xs font-bold transition-all", sel ? "bg-primary/20 text-primary-light border-primary" : "bg-panel border-border text-gray-400 hover:text-white")}
                                    >
                                      {sel ? '✓ ' : ''}{t}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            <div>
                              <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">What makes you a good mentor? <span className="text-red-500">*</span></label>
                              <textarea required maxLength={300} className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-colors" placeholder="Even without placement, what unique experience or knowledge do you have that can help juniors? e.g. Won hackathons, strong in DSA, built 10+ projects..." value={formData.whyGoodMentor} onChange={e=>update('whyGoodMentor', e.target.value)} />
                            </div>

                            <TagInput label="Notable Achievements (Optional)" placeholder="Hackathon win, LeetCode top 5%, etc" tags={formData.notableAchievements} onChange={v=>update('notableAchievements', v)} />

                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-primary-light text-sm flex gap-3 items-start">
                              <span className="shrink-0 text-xl">🌟</span>
                              <p>You don't need to be placed to be a great mentor! Many of our best mentors are students who are exceptionally skilled in specific areas.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Input label="LinkedIn Profile URL" required type="url" placeholder="https://linkedin.com/in/you" value={formData.linkedin} onChange={e=>update('linkedin', e.target.value)} error={formData.linkedin.length > 0 && !formData.linkedin.includes('linkedin.com') ? 'Must be a valid LinkedIn URL' : ''} />
                        <Input label="GitHub Profile URL (Optional)" type="url" placeholder="https://github.com/you" value={formData.github} onChange={e=>update('github', e.target.value)} />
                        
                        <div className="md:col-span-2">
                          <Input label="Portfolio / Personal Website (Optional)" type="url" placeholder="https://yourwebsite.com" value={formData.portfolio} onChange={e=>update('portfolio', e.target.value)} />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">Any notable past experience? (Optional)</label>
                            <textarea maxLength={300} className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-colors" placeholder="Previous internships, projects, competitions, research papers, open source contributions..." value={formData.pastExperience} onChange={e=>update('pastExperience', e.target.value)} />
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
            {/* ─── REPLACE STEP 3 END ─── */}

            {/* MENTOR: STEP 4 - Skills & Expertise */}
            {isMentor && step === 4 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Skills & Expertise</h3>
                <div className="space-y-6">
                  <TagInput label="Technical Skills" required placeholder="Type and press enter..." tags={formData.technicalSkills} onChange={v=>update('technicalSkills', v)} suggestions={TECH_SKILLS} error={formData.technicalSkills.length > 0 && formData.technicalSkills.length < 3 ? 'Minimum 3 skills required' : ''} />
                  <TagInput label="Domain Expertise" required placeholder="Add domain..." tags={formData.domainExpertise} onChange={v=>update('domainExpertise', v)} suggestions={DOMAINS} />
                  <TagInput label="Programming Languages" placeholder="Add language..." tags={formData.programmingLanguages} onChange={v=>update('programmingLanguages', v)} suggestions={LANGUAGES} />
                  <TagInput label="Tools & Technologies" placeholder="Add tools..." tags={formData.tools} onChange={v=>update('tools', v)} suggestions={TOOLS} />
                  
                  <div className="border border-border rounded-xl p-4 bg-surface">
                    <label className="flex items-center justify-between cursor-pointer">
                       <span className="font-bold text-white">Competitive Programming Details</span>
                       <input type="checkbox" className="w-5 h-5 rounded border-border bg-panel text-primary focus:ring-primary" checked={formData.hasCP} onChange={e => update('hasCP', e.target.checked)} />
                    </label>
                    
                    <AnimatePresence>
                      {formData.hasCP && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 grid sm:grid-cols-3 gap-4">
                           <Input label="LeetCode Solved" type="number" placeholder="e.g. 500" value={formData.leetcode} onChange={e=>update('leetcode', e.target.value)} />
                           <Input label="Codeforces Rating" type="number" placeholder="e.g. 1500" value={formData.codeforces} onChange={e=>update('codeforces', e.target.value)} />
                           <Input label="CodeChef Rating" type="number" placeholder="e.g. 1800" value={formData.codechef} onChange={e=>update('codechef', e.target.value)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}

            {/* MENTOR: STEP 5 - Mentorship Preferences */}
            {isMentor && step === 5 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Mentorship Preferences</h3>
                <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Session Types Offered <span className="text-red-500">*</span></label>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[ 
                    { t: 'Mock Interview', d: 'Conduct technical and HR mock interviews', i: Target }, 
                    { t: 'Project Guidance', d: 'Help with project ideas and implementation', i: Rocket }, 
                    { t: 'Career Chat', d: 'Share career path insights and advice', i: Briefcase }, 
                    { t: 'Resume Review', d: 'Review and improve student resumes', i: BookOpen }, 
                    { t: 'DSA Practice', d: 'Practice data structures and algorithms together', i: Trophy }, 
                    { t: 'System Design', d: 'Teach system design concepts and practice', i: Compass }
                  ].map(type => (
                    <ToggleCard 
                      key={type.t}
                      selected={formData.sessionTypes.includes(type.t)}
                      onClick={() => {
                        const newTypes = formData.sessionTypes.includes(type.t) ? formData.sessionTypes.filter(g => g !== type.t) : [...formData.sessionTypes, type.t];
                        update('sessionTypes', newTypes);
                      }}
                      icon={type.i}
                      title={type.t}
                      subtitle={type.d}
                    />
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Preferred Session Duration <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-4 pt-1">
                      {['30 Minutes', '60 Minutes', 'Both'].map(d => (
                        <label key={d} className={cn("px-4 py-2 border rounded-xl cursor-pointer transition-colors text-sm font-medium", formData.preferredDuration === d ? "bg-primary/20 border-primary text-primary-light" : "bg-panel border-border text-gray-400 hover:text-white")}>
                          <input required type="radio" name="duration" className="hidden" checked={formData.preferredDuration === d} onChange={() => update('preferredDuration', d)} /> {d}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Max Mentees Per Week: {formData.maxMenteesPerWeek}</label>
                    <input type="range" min="1" max="10" value={formData.maxMenteesPerWeek} onChange={e=>update('maxMenteesPerWeek', e.target.value)} className="w-full h-2 bg-panel rounded-lg appearance-none cursor-pointer accent-primary mt-3" />
                  </div>
                </div>

                <div className="mt-8 space-y-6">
                   <TagInput label="Mentoring Languages" required placeholder="Add language..." tags={formData.mentoringLanguages} onChange={v=>update('mentoringLanguages', v)} suggestions={['English', 'Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'Bengali']} />
                   
                   <div>
                      <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Previous Mentoring Experience <span className="text-red-500">*</span></label>
                      <div className="flex gap-6">
                        {['First time mentor', 'I have mentored before'].map(ex => (
                          <label key={ex} className="flex items-center gap-2 text-sm text-gray-300">
                            <input required type="radio" name="mExp" checked={formData.mentorExperience === ex} onChange={() => update('mentorExperience', ex)} className="bg-panel border-border text-primary focus:ring-primary" /> {ex}
                          </label>
                        ))}
                      </div>
                   </div>
                </div>
              </>
            )}

            {/* MENTOR: STEP 6 - Set Availability */}
            {isMentor && step === 6 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Set Availability</h3>
                <WeeklyGrid value={formData.availability} onChange={v => update('availability', v)} />
                
                <div className="grid sm:grid-cols-2 gap-6 mt-6">
                  <Select
                    label="Timezone"
                    options={[
                      { value: 'IST', label: 'IST - Indian Standard Time' },
                      { value: 'PST', label: 'PST - Pacific Standard Time' },
                      { value: 'EST', label: 'EST - Eastern Standard Time' },
                      { value: 'GMT', label: 'GMT - Greenwich Mean Time' }
                    ]}
                    value={formData.timezone}
                    onChange={v => update('timezone', v)}
                  />
                  <Input label="I'm available starting from" type="date" value={formData.availableFrom} onChange={e=>update('availableFrom', e.target.value)} required />
                </div>
              </>
            )}

            {/* MENTOR: STEP 7 - About You */}
            {isMentor && step === 7 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">About You</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">Short Bio <span className="text-red-500">*</span></label>
                    <textarea required minLength={50} maxLength={300} className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-28 transition-colors" placeholder="I'm a final year CSE student at BITS Pilani with an internship at Google. I love DSA..." value={formData.bio} onChange={e=>update('bio', e.target.value)} />
                    <p className="text-right text-xs text-text-dim mt-1">{formData.bio.length} / 300</p>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">Your Journey (Optional)</label>
                    <textarea maxLength={500} className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-32 transition-colors" placeholder="How did you get to where you are? What challenges did you face?" value={formData.journey} onChange={e=>update('journey', e.target.value)} />
                    <p className="text-right text-xs text-text-dim mt-1">{formData.journey.length} / 500</p>
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-2">What I Can Help With <span className="text-red-500">*</span></label>
                    <textarea required className="w-full bg-surface border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24 transition-colors" placeholder="I can specifically help with DSA preparation, React projects..." value={formData.whatICanHelpWith} onChange={e=>update('whatICanHelpWith', e.target.value)} />
                  </div>

                  <div>
                    <label className="block font-mono text-xs text-text-dim uppercase tracking-wider mb-3">Achievements (Max 6)</label>
                    <div className="space-y-3 mb-3">
                      {formData.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-center gap-3 animate-fadeUp">
                           <Select
                             className="w-1/3"
                             options={['Internship', 'Hackathon', 'Certification', 'Competition', 'Project', 'Other']}
                             value={ach.category}
                             onChange={v => updateAchievement(idx, 'category', v)}
                           />
                           <input type="text" className="bg-surface border-border text-sm text-white border rounded-lg py-2.5 px-3 focus:ring-1 focus:ring-primary focus:border-primary w-full" placeholder="e.g. Winner at SIH 2023" value={ach.description} onChange={e=>updateAchievement(idx, 'description', e.target.value)} required />
                           <button type="button" onClick={() => removeAchievement(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors bg-panel border border-border"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                    {formData.achievements.length < 6 && (
                      <Button type="button" variant="outline" size="sm" onClick={addAchievement}>+ Add Achievement</Button>
                    )}
                  </div>

                  <hr className="border-border my-8" />
                  
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-border rounded-xl bg-panel">
                     <div className="flex-1">
                       <p className="font-bold text-white text-sm">Are you open to being featured?</p>
                       <p className="text-xs text-text-muted">Allow CoNnEcT to feature your profile on the homepage.</p>
                     </div>
                     <input type="checkbox" className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary" checked={formData.featuredConsent} onChange={e=>update('featuredConsent', e.target.checked)} />
                  </label>
                </div>
              </>
            )}

            {/* MENTOR: STEP 8 - Review & Submit */}
            {isMentor && step === 8 && (
              <>
                <h3 className="text-2xl font-bold text-white mb-6">Review & Submit</h3>
                <div className="grid lg:grid-cols-5 gap-6">
                  
                  {/* Left: Preview Card */}
                  <div className="lg:col-span-2">
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl sticky top-24">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-mono text-primary-light uppercase">Profile Preview</span>
                        <button type="button" onClick={() => setStep(1)} className="text-xs text-gray-500 hover:text-white underline">Edit</button>
                      </div>
                      <div className="text-center mb-4">
                        <img src={formData.profilePhoto?.preview || 'https://via.placeholder.com/150'} alt="Avatar" className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-primary/20" />
                        <h4 className="text-xl font-bold text-white mt-3">{formData.name}</h4>
                        <p className="text-primary-light text-sm font-medium">{formData.jobRole} @ {formData.company}</p>
                        <p className="text-text-muted text-xs mt-1">{formData.college}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                         {formData.technicalSkills.slice(0, 5).map(s => <span key={s} className="px-2 py-0.5 bg-panel border border-border rounded-full text-[10px] text-gray-300">{s}</span>)}
                      </div>
                      <Button variant="outline" size="sm" className="w-full pointer-events-none mb-4" onClick={(e)=>e.preventDefault()}>Book a Session</Button>
                      <div className="flex items-center justify-center gap-1 text-sm text-yellow-500 font-bold bg-panel py-2 rounded-xl border border-border">
                        <Star className="w-4 h-4 fill-current" /> New Mentor
                      </div>
                    </div>
                  </div>

                  {/* Right: Details List */}
                  <div className="lg:col-span-3 space-y-6">
                    <div className="bg-panel border border-border p-5 rounded-2xl">
                       <div className="flex justify-between items-center mb-2"><h5 className="font-bold text-sm text-white uppercase tracking-wider">Bio</h5> <button type="button" onClick={()=>setStep(7)} className="text-xs text-gray-400 hover:text-white underline">Edit</button></div>
                       <p className="text-sm text-gray-300">{formData.bio}</p>
                    </div>

                    <div className="bg-panel border border-border p-5 rounded-2xl">
                       <div className="flex justify-between items-center mb-3"><h5 className="font-bold text-sm text-white uppercase tracking-wider">Session Offerings</h5> <button type="button" onClick={()=>setStep(5)} className="text-xs text-gray-400 hover:text-white underline">Edit</button></div>
                       <div className="flex flex-wrap gap-2">
                         {formData.sessionTypes.map(s => <span key={s} className="bg-primary/20 text-primary-light border border-primary/20 px-2 py-1 rounded text-xs">{s}</span>)}
                       </div>
                    </div>

                    <div className="bg-panel border border-border p-5 rounded-2xl">
                       <div className="flex justify-between items-center mb-3"><h5 className="font-bold text-sm text-white uppercase tracking-wider">Availability ({formData.timezone})</h5> <button type="button" onClick={()=>setStep(6)} className="text-xs text-gray-400 hover:text-white underline">Edit</button></div>
                       <div className="space-y-1">
                         {Object.entries(formData.availability).filter(([_, slots]) => slots.length > 0).map(([day, slots]) => (
                           <p key={day} className="text-sm text-gray-300"><span className="text-text-muted w-24 inline-block">{day}:</span> {slots.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</p>
                         ))}
                       </div>
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <hr className="border-border my-8" />
            <div className="flex gap-4">
               <Button type="button" variant="outline" className="flex-1" onClick={prevStep} disabled={isSubmitLoading}>
                 <ArrowLeft className="w-4 h-4 mr-2" /> Back
               </Button>
               {step === totalSteps ? (
                 <Button type="submit" className="flex-1" isLoading={isSubmitLoading}>
                   Create {isMentor ? 'Mentor' : 'Mentee'} Profile <Sparkles className="w-4 h-4 ml-2 text-yellow-300" />
                 </Button>
               ) : (
                 <Button type="submit" className="flex-1" disabled={
                   (step === 1 && formData.password !== formData.confirmPassword) || 
                   (step === 3 && isMentor && (
                     !formData.placementStatus ||
                     (formData.placementStatus === 'placed' && (!formData.currentCompany || !formData.jobRole || !formData.employmentType || !formData.workExperience)) ||
                     (formData.placementStatus === 'intern' && (!formData.internCompany || !formData.internRole || !formData.internType || !formData.internDuration)) ||
                     (formData.placementStatus === 'looking' && (formData.targeting.length === 0 || !formData.prepStatus)) ||
                     (formData.placementStatus === 'studying' && (formData.focusAreas.length === 0 || !formData.whyGoodMentor)) ||
                     !formData.linkedin
                   )) ||
                   (step === 4 && isMentor && formData.technicalSkills.length < 3) ||
                   (step === 5 && isMentor && formData.sessionTypes.length === 0)
                 }>
                   Next Step <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
               )}
            </div>
            
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full bg-background min-h-screen">
      {renderStep()}
    </div>
  );
}
