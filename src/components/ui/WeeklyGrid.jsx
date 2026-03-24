import { cn } from '../../utils/helpers';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = [
  { id: 'morning', label: 'Morning', desc: '6AM-12PM' },
  { id: 'afternoon', label: 'Afternoon', desc: '12PM-5PM' },
  { id: 'evening', label: 'Evening', desc: '5PM-10PM' }
];

export default function WeeklyGrid({ value = {}, onChange }) {
  
  const toggleSlot = (day, slotId) => {
    const existingSlots = value[day] || [];
    let newSlots;
    if (existingSlots.includes(slotId)) {
      newSlots = existingSlots.filter(s => s !== slotId);
    } else {
      newSlots = [...existingSlots, slotId];
    }
    onChange({ ...value, [day]: newSlots });
  };

  const totalSlotsCount = Object.values(value).reduce((acc, curr) => acc + curr.length, 0);
  const activeDaysCount = Object.values(value).filter(slots => slots.length > 0).length;

  return (
    <div className="w-full">
      <div className="border border-border rounded-xl mb-4 overflow-hidden bg-surface">
        <div className="grid grid-cols-4 bg-panel/50 border-b border-border p-3 text-xs font-mono text-text-dim uppercase tracking-wider text-center">
          <div className="text-left pl-2">Day</div>
          <div>Morning</div>
          <div>Afternoon</div>
          <div>Evening</div>
        </div>
        
        <div className="divide-y divide-border">
          {DAYS.map(day => {
            const daySlots = value[day] || [];
            return (
              <div key={day} className="grid grid-cols-4 items-center p-2 sm:p-3 hover:bg-white/5 transition-colors">
                <div className="text-sm font-medium text-white pl-2">{day.substring(0, 3)}</div>
                {SLOTS.map(slot => {
                  const isSelected = daySlots.includes(slot.id);
                  return (
                    <div key={slot.id} className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => toggleSlot(day, slot.id)}
                        className={cn(
                          "w-full max-w-[80px] py-2 rounded-lg text-xs font-bold transition-all border",
                          isSelected 
                            ? "bg-primary/20 text-primary-light border-primary shadow-[0_0_10px_rgba(124,58,237,0.15)]" 
                            : "bg-panel text-text-muted border-transparent hover:bg-white/5 hover:border-border"
                        )}
                        title={slot.desc}
                      >
                        ✓
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-center">
        <p className="text-sm text-primary-light">
          You've selected <strong className="text-white">{totalSlotsCount}</strong> time slots across <strong className="text-white">{activeDaysCount}</strong> days.
        </p>
      </div>
    </div>
  );
}
