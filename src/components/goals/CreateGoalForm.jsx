import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import toast from 'react-hot-toast';

export default function CreateGoalForm({ isOpen, onClose, connectedMentees = [] }) {
  const { createGoal } = useStore();

  // State fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [menteeId, setMenteeId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  
  // List of tasks to create
  const [tasks, setTasks] = useState([{ title: '', description: '' }]);

  // Errors state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Add a task field
  const handleAddTaskField = () => {
    setTasks([...tasks, { title: '', description: '' }]);
  };

  // Remove a task field
  const handleRemoveTaskField = (idx) => {
    if (tasks.length === 1) {
      toast.error('At least one task is required.');
      return;
    }
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  // Update task field content
  const handleTaskChange = (idx, field, value) => {
    const updated = tasks.map((task, i) => {
      if (i === idx) return { ...task, [field]: value };
      return task;
    });
    setTasks(updated);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!menteeId) {
      newErrors.menteeId = 'Assigned mentee is required';
    }

    if (!targetDate) {
      newErrors.targetDate = 'Deadline is required';
    } else if (new Date(targetDate) < new Date(startDate)) {
      newErrors.targetDate = 'Deadline cannot be earlier than start date';
    }

    // Task validations
    const taskErrors = [];
    const titles = tasks.map(t => t.title.trim());
    const duplicateIndices = [];

    titles.forEach((tTitle, idx) => {
      if (!tTitle) {
        taskErrors[idx] = 'Task name cannot be empty';
      } else {
        // Check for duplicates
        const firstIdx = titles.indexOf(tTitle);
        if (firstIdx !== idx) {
          duplicateIndices.push(idx);
          taskErrors[idx] = 'Duplicate task name (shows warning)';
        }
      }
    });

    if (taskErrors.length > 0 || duplicateIndices.length > 0) {
      newErrors.tasks = taskErrors;
      if (duplicateIndices.length > 0) {
        newErrors.duplicateWarning = 'Warning: Duplicate task names detected. Please make them unique.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validateForm()) {
      toast.error('Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    try {
      createGoal({
        title: title.trim(),
        description: description.trim(),
        menteeId,
        startDate: new Date(startDate).toISOString(),
        targetDate: new Date(targetDate).toISOString(),
        priority,
        tasks: tasks.map(t => ({ title: t.title.trim(), description: t.description.trim() }))
      });

      toast.success('Learning Goal created successfully! 🎯');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-surface border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl my-8 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
          <h2 className="text-xl font-bold text-white">Create New Learning Task</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          
          {/* MENTEE SELECT & DATES */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Select
              label="Assigned Mentee"
              required
              value={menteeId}
              onChange={setMenteeId}
              error={errors.menteeId}
              placeholder="Select Connected Mentee"
              options={connectedMentees.map(m => ({ value: m.id, label: m.name }))}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={['Low', 'Medium', 'High']}
            />
          </div>

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

          {/* GOAL DATES */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />

            <Input
              label="Target Completion Date"
              required
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              error={errors.targetDate}
            />
          </div>

          {/* TASKS CHECKLIST BUILDER */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white text-sm">Task Milestones</h3>
                <p className="text-xs text-text-dim mt-0.5">Define step-by-step milestones to complete this task.</p>
              </div>
              <button
                type="button"
                onClick={handleAddTaskField}
                className="text-xs text-primary-light hover:text-white flex items-center gap-1 font-semibold transition-colors bg-primary/10 border border-primary/20 rounded-lg px-2 py-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            {errors.duplicateWarning && (
              <div className="flex items-center gap-2 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.duplicateWarning}</span>
              </div>
            )}

            <div className="space-y-4">
              {tasks.map((task, idx) => (
                <div key={idx} className="flex gap-4 items-start p-4 bg-panel border border-border rounded-2xl relative group">
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder={`Task #${idx + 1} Name`}
                      value={task.title}
                      onChange={e => handleTaskChange(idx, 'title', e.target.value)}
                      error={errors.tasks?.[idx]}
                      className="py-2.5"
                    />
                    <textarea
                      placeholder="Task details/resources (optional)"
                      rows={1.5}
                      value={task.description}
                      onChange={e => handleTaskChange(idx, 'description', e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-xs focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveTaskField(idx)}
                    className="p-2 mt-1 rounded-lg text-red-500/60 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all shrink-0 self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
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
              Create Task
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
