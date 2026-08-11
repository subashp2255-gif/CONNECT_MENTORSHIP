import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import toast from 'react-hot-toast';

export default function EditGoalForm({ isOpen, onClose, goal }) {
  const { updateGoalDetails } = useStore();

  // State fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize values
  useEffect(() => {
    if (goal) {
      setTitle(goal.title || '');
      setDescription(goal.description || '');
      setPriority(goal.priority || 'Medium');
      if (goal.targetDate) {
        setTargetDate(goal.targetDate.split('T')[0]);
      }
    }
  }, [goal]);

  if (!isOpen || !goal) return null;

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!targetDate) {
      newErrors.targetDate = 'Deadline is required';
    } else if (new Date(targetDate) < new Date(goal.startDate)) {
      newErrors.targetDate = 'Deadline cannot be earlier than start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Goal Updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      updateGoalDetails(goal.id, {
        title: title.trim(),
        description: description.trim(),
        targetDate: new Date(targetDate).toISOString(),
        priority
      });

      toast.success('Learning Task updated successfully! 🎯');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to update goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-lg shadow-2xl my-8 flex flex-col">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <h2 className="text-xl font-bold text-white">Edit Task Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* GOAL TITLE */}
          <Input
            label="Task Title"
            required
            placeholder="e.g. Master React Basics"
            value={title}
            onChange={e => setTitle(e.target.value)}
            error={errors.title}
          />

          {/* GOAL DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Task Description
            </label>
            <textarea
              placeholder="Provide context and summary of what this task covers..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-3 px-4 text-sm focus:outline-none transition-colors"
            />
          </div>

          {/* GOAL DATES & PRIORITY */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Target Completion Date"
              required
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              error={errors.targetDate}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={['Low', 'Medium', 'High']}
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="flex gap-4 pt-6 border-t border-border mt-6">
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              fullWidth
              type="submit"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
