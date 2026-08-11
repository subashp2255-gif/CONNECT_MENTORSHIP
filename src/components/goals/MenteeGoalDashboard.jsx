import { useState, useMemo } from 'react';
import { Target, Layers, PlayCircle, CheckCircle2, AlertTriangle, Search, RefreshCw } from 'lucide-react';
import { useStore } from '../../store/useStore';
import GoalCard from './GoalCard';
import EmptyGoalsState from './EmptyGoalsState';
import StatCard from '../shared/StatCard';
import Select from '../ui/Select';
import Input from '../ui/Input';

export default function MenteeGoalDashboard() {
  const { currentUser, goals, goalTasks } = useStore();
  
  const currentMenteeId = currentUser?.id || 'u1';

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Filter goals assigned to this mentee
  const menteeGoals = useMemo(() => {
    return goals.filter(g => g.menteeId === currentMenteeId) || [];
  }, [goals, currentMenteeId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = menteeGoals.length;
    const active = menteeGoals.filter(g => ['Not Started', 'In Progress', 'Under Review'].includes(g.status)).length;
    const completed = menteeGoals.filter(g => g.status === 'Completed').length;
    const overdue = menteeGoals.filter(g => g.status === 'Overdue').length;

    return { total, active, completed, overdue };
  }, [menteeGoals]);

  // Apply filters & search
  const filteredGoals = useMemo(() => {
    return menteeGoals.filter(goal => {
      // Search matches
      const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (goal.description && goal.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filter matches
      const matchesStatus = selectedStatusFilter === 'all' || goal.status === selectedStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [menteeGoals, searchQuery, selectedStatusFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatusFilter('all');
  };

  return (
    <div className="space-y-8 animate-fadeUp flex-1">
      {/* Main Panel */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            My Tasks
            <span className="text-xs bg-panel border border-border text-text-muted px-2 py-0.5 rounded-full font-normal">
              {filteredGoals.length} task{filteredGoals.length !== 1 && 's'}
            </span>
          </h2>
        </div>

        {/* Filters Panel */}
        <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              icon={Search}
              className="h-10 sm:text-xs rounded-xl"
            />

            <Select
              value={selectedStatusFilter}
              onChange={setSelectedStatusFilter}
              size="sm"
              className="h-10 text-xs"
              placeholder="Filter by Status"
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Not Started', label: 'Not Started' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Under Review', label: 'Under Review' },
                { value: 'Completed', label: 'Completed' },
                { value: 'Paused', label: 'Paused' },
                { value: 'Overdue', label: 'Overdue' }
              ]}
            />
          </div>

          {(searchQuery || selectedStatusFilter !== 'all') && (
            <div className="flex justify-end pt-1">
              <button
                onClick={resetFilters}
                className="text-xs text-primary-light hover:text-white flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Goals List */}
        {filteredGoals.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                tasks={goalTasks.filter(t => t.goalId === goal.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyGoalsState role="mentee" />
        )}
      </div>
    </div>
  );
}
