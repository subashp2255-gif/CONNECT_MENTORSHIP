import React, { useState } from 'react';
import { Plus, Minus, Clock, Send } from 'lucide-react';
import useSessionRoomStore from '../../stores/sessionRoomStore';
import toast from 'react-hot-toast';
import PollResults from './PollResults';

const PollCreator = () => {
  const { setActivePoll, activePoll } = useSessionRoomStore();
  
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(0);

  const handleAddOption = () => {
    if (options.length >= 4) return;
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleLaunch = () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    const validOptions = options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least two valid options');
      return;
    }

    const poll = {
      id: `poll-${Date.now()}`,
      question,
      options: validOptions.map((opt, i) => ({ id: `opt-${i}`, text: opt, count: 0 })),
      totalVotes: 0,
      timestamp: Date.now(),
      timeLimit
    };

    setActivePoll(poll);
    toast.success('Custom poll launched');
    setQuestion('');
    setOptions(['', '']);
    setTimeLimit(0);
  };

  if (activePoll) {
    return <PollResults />;
  }

  return (
    <div className="space-y-4">
      <div className="text-white font-medium mb-3">Create New Poll</div>

      <div className="space-y-4 bg-[#1a1a24] p-4 rounded-xl border border-[#2a2a3a]">
        <div>
          <label className="block text-xs text-[#6b6b8a] uppercase tracking-wider font-bold mb-2">Question</label>
          <input 
            type="text" 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full bg-[#0a0a0f] border border-[#2a2a3a] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#7c3aed] text-sm"
          />
        </div>

        <div>
           <label className="block text-xs text-[#6b6b8a] uppercase tracking-wider font-bold mb-2">Options</label>
           <div className="space-y-2">
             {options.map((opt, i) => (
               <div key={i} className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                 <input 
                   type="text" 
                   value={opt}
                   onChange={(e) => handleOptionChange(i, e.target.value)}
                   placeholder={`Option ${i + 1}`}
                   className="w-full bg-[#0a0a0f] border border-[#2a2a3a] text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#7c3aed] text-sm"
                 />
                 <button 
                  onClick={() => handleRemoveOption(i)}
                  disabled={options.length <= 2}
                  className="p-2 text-[#6b6b8a] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#6b6b8a] self-end sm:self-auto"
                 >
                   <Minus className="w-4 h-4" />
                 </button>
               </div>
             ))}
           </div>
           
           {options.length < 4 && (
             <button 
              onClick={handleAddOption}
              className="mt-3 flex items-center text-sm text-[#7c3aed] hover:text-[#f472b6] font-medium transition-colors"
             >
               <Plus className="w-4 h-4 mr-1" /> Add Option
             </button>
           )}
        </div>

        {/* Time Limit */}
        <div>
          <label className="block text-xs text-[#6b6b8a] uppercase tracking-wider font-bold mb-2 flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Time Limit
          </label>
          <div className="flex bg-[#0a0a0f] border border-[#2a2a3a] rounded-lg p-1">
             {[
               { val: 0, label: 'None' },
               { val: 30, label: '30s' },
               { val: 60, label: '60s' }
             ].map(t => (
                <button
                 key={t.val}
                 onClick={() => setTimeLimit(t.val)}
                 className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                   timeLimit === t.val ? 'bg-[#2a2a3a] text-white shadow' : 'text-[#6b6b8a] hover:text-white'
                 }`}
                >
                  {t.label}
                </button>
             ))}
          </div>
        </div>

        <button 
          onClick={handleLaunch}
          className="w-full mt-4 flex items-center justify-center py-2.5 bg-[#7c3aed] text-white rounded-lg font-medium hover:bg-[#6d28d9] transition-colors"
        >
          <Send className="w-4 h-4 mr-2" />
          Launch Poll
        </button>
      </div>
    </div>
  );
};

export default PollCreator;
