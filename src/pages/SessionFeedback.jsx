import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../store/useStore';
import { sessions, mentors } from '../data/mockData';
import Button from '../components/ui/Button';

export default function SessionFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useStore();
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState({
    strengths: '',
    improvements: '',
    resources: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fallback to avoid crashes if session ID isn't found
  const session = sessions.find(s => s.id === id) || sessions[0];
  const mentor = mentors.find(m => m.id === session.mentorId) || mentors[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
    setIsSubmitted(true);
  };

  if (!isLoggedIn) {
     navigate('/login');
     return null;
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-surface border border-border rounded-3xl p-10 text-center max-w-md w-full animate-fadeUp">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Feedback Submitted!</h2>
          <p className="text-text-muted mb-8">Thank you for helping us improve the CoNnEcT community.</p>
          <Button fullWidth onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-10 px-4 w-full">
      <div className="max-w-2xl mx-auto w-full">
        
        <h1 className="text-3xl font-bold text-white mb-2 text-center animate-fadeUp">Session Feedback</h1>
        <p className="text-text-muted text-center mb-8 animate-fadeUp opacity-90">Your honest feedback helps mentors improve.</p>

        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-10 shadow-2xl animate-fadeUp">
          
          {/* Session Summary Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-panel border border-border mb-8">
            <img src={mentor.avatar} alt="" className="w-12 h-12 rounded-full border border-white/10" />
            <div>
              <p className="font-bold text-white">{mentor.name}</p>
              <p className="text-sm text-text-muted">{session.type} • {session.duration} mins</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Star Rating Section */}
            <div>
              <label className="block text-base font-medium text-white mb-3 text-center">How would you rate this session?</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star 
                      className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-200 ${
                        star <= (hoveredRating || rating) 
                          ? 'fill-yellow-500 text-yellow-500' 
                          : 'fill-transparent text-gray-600'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Score Slider */}
            <div>
              <div className="flex justify-between items-end mb-4">
                 <label className="block text-sm font-medium text-white">Overall Value Score</label>
                 <span className="text-2xl font-bold text-primary-light">{score}/10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={score} 
                onChange={(e) => setScore(e.target.value)}
                className="w-full h-2 bg-panel rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <div className="flex justify-between text-xs text-text-muted mt-2">
                <span>Not helpful</span>
                <span className="text-center">Neutral</span>
                <span>Extremely helpful</span>
              </div>
            </div>

            {/* Detailed Feedback Textareas */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">What went well? (Strengths)</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-panel border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-1 focus:ring-primary focus:border-primary resize-none transition-colors"
                  placeholder="The mentor was clear, patient..."
                  value={feedback.strengths}
                  onChange={e => setFeedback({...feedback, strengths: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Areas for improvement (Optional)</label>
                <textarea 
                  rows={3}
                  className="w-full bg-panel border border-border rounded-xl p-4 text-white placeholder-text-dim focus:ring-1 focus:ring-primary focus:border-primary resize-none transition-colors"
                  placeholder="Audio quality could be better..."
                  value={feedback.improvements}
                  onChange={e => setFeedback({...feedback, improvements: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" fullWidth disabled={rating === 0 || !feedback.strengths.trim()}>
              Submit Feedback
            </Button>
          </form>

        </div>
      </div>
    </div>
  );
}
