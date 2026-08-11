import { motion } from 'framer-motion';

const moods = [
  { value: 'great', emoji: '🤩', label: 'Great' },
  { value: 'good', emoji: '😊', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'difficult', emoji: '😓', label: 'Difficult' },
];

export default function MoodSelector({ selected, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-text-muted">How was this session?</span>
      <div className="flex items-center gap-3">
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            type="button"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange?.(mood.value)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all cursor-pointer ${
              selected === mood.value
                ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(124,58,237,0.2)]'
                : 'border-border bg-panel hover:border-white/20'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-text-muted">{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
