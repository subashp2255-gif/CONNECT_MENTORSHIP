import { useState, useMemo } from 'react';
import { Plus, Search, Filter, RefreshCw, Layers, CheckCircle2, Clock, AlertTriangle, PlayCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import GoalCard from './GoalCard';
import CreateGoalForm from './CreateGoalForm';
import EditGoalForm from './EditGoalForm';
import DeleteGoalDialog from './DeleteGoalDialog';
import EmptyGoalsState from './EmptyGoalsState';
import GoalActivityTimeline from './GoalActivityTimeline';
import StatCard from '../shared/StatCard';
import Button from '../ui/Button';
import Select from '../ui/Select';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

export default function MentorGoalDashboard() {
  const { 
    currentUser, sessions, goals, goalTasks, goalActivities, 
    pauseGoal, resumeGoal, deleteGoal, createGoal, updateGoalDetails 
  } = useStore();

  const currentMentorId = currentUser?.id || 'm1';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMenteeFilter, setSelectedMenteeFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');
  
  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoalId, setDeletingGoalId] = useState(null);

  // Fetch connected mentees (mentees who have sessions with this mentor)
  const connectedMentees = useMemo(() => {
    // Import mentees mock data just in case
    const mockMentees = [
      { id: "u1", name: "Ravi Kumar", avatar: "https://ui-avatars.com/api/?name=Ravi+Kumar&background=111118&color=fff" },
      { id: "u2", name: "Sita Mahalakshmi", avatar: "https://ui-avatars.com/api/?name=Sita+Mahalakshmi&background=111118&color=fff" },
      { id: "u3", name: "Aryan Bose", avatar: "https://ui-avatars.com/api/?name=Aryan+Bose&background=111118&color=fff" },
      { id: "u4", name: "Meera Rajput", avatar: "https://ui-avatars.com/api/?name=Meera+Rajput&background=111118&color=fff" },
      { id: "u5", name: "Kabir Singh", avatar: "https://ui-avatars.com/api/?name=Kabir+Singh&background=111118&color=fff" }
    ];
    
    const mySessions = sessions.filter(s => s.mentorId === currentMentorId || s.mentor_id === currentMentorId);
    const menteeIds = new Set(mySessions.map(s => s.menteeId || s.mentee_id));
    return mockMentees.filter(m => menteeIds.has(m.id));
  }, [sessions, currentMentorId]);

  // Filter goals belonging to this mentor
  const mentorGoals = useMemo(() => {
    return goals.filter(g => g.mentorId === currentMentorId) || [];
  }, [goals, currentMentorId]);

  // Filter tasks waiting review (Submitted) for goals created by this mentor
  const reviewTasksCount = useMemo(() => {
    const mentorGoalIds = new Set(mentorGoals.map(g => g.id));
    return goalTasks.filter(t => mentorGoalIds.has(t.goalId) && t.status === 'Submitted').length;
  }, [goalTasks, mentorGoals]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mentorGoals.length;
    const active = mentorGoals.filter(g => ['Not Started', 'In Progress', 'Under Review'].includes(g.status)).length;
    const completed = mentorGoals.filter(g => g.status === 'Completed').length;
    const overdue = mentorGoals.filter(g => g.status === 'Overdue').length;
    
    return { total, active, completed, overdue };
  }, [mentorGoals]);

  // Apply filters, search, and sort
  const filteredGoals = useMemo(() => {
    const mockMentees = [
      { id: "u1", name: "Ravi Kumar" },
      { id: "u2", name: "Sita Mahalakshmi" },
      { id: "u3", name: "Aryan Bose" },
      { id: "u4", name: "Meera Rajput" },
      { id: "u5", name: "Kabir Singh" }
    ];

    return mentorGoals.filter(goal => {
      // Search matches
      const mentee = mockMentees.find(m => m.id === goal.menteeId);
      const menteeName = mentee ? mentee.name.toLowerCase() : '';
      const matchesSearch = 
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menteeName.includes(searchQuery.toLowerCase());
      
      // Filter matches
      const matchesMentee = selectedMenteeFilter === 'all' || goal.menteeId === selectedMenteeFilter;
      const matchesStatus = selectedStatusFilter === 'all' || goal.status === selectedStatusFilter;
      const matchesPriority = selectedPriorityFilter === 'all' || goal.priority === selectedPriorityFilter;

      return matchesSearch && matchesMentee && matchesStatus && matchesPriority;
    });
  }, [mentorGoals, searchQuery, selectedMenteeFilter, selectedStatusFilter, selectedPriorityFilter]);

  // Activity feed for mentor
  const recentActivities = useMemo(() => {
    const mentorGoalIds = new Set(mentorGoals.map(g => g.id));
    return goalActivities.filter(a => mentorGoalIds.has(a.goalId));
  }, [goalActivities, mentorGoals]);

  // Pause / Resume / Delete Handlers
  const handlePause = (id) => {
    try {
      pauseGoal(id);
      toast.success('Goal paused successfully.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleResume = (id) => {
    try {
      resumeGoal(id);
      toast.success('Goal resumed successfully.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = () => {
    if (!deletingGoalId) return;
    try {
      deleteGoal(deletingGoalId);
      toast.success('Goal deleted successfully.');
      setDeletingGoalId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMenteeFilter('all');
    setSelectedStatusFilter('all');
    setSelectedPriorityFilter('all');
  };

  return (
    <div className="space-y-8 animate-fadeUp flex-1">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <StatCard label="Total Tasks" value={stats.total} icon={Layers} accentColor="#7c6ff7" iconBg="rgba(124,111,247,0.12)" iconColor="#a78bfa" progress={100} />
        <StatCard label="Active Tasks" value={stats.active} icon={PlayCircle} accentColor="#378ADD" iconBg="rgba(55,138,221,0.12)" iconColor="#60a5fa" progress={stats.total > 0 ? (stats.active / stats.total) * 100 : 0} />
        <StatCard label="Completed Tasks" value={stats.completed} icon={CheckCircle2} accentColor="#22c55e" iconBg="rgba(34,197,94,0.12)" iconColor="#4ade80" progress={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} />
        <StatCard label="Overdue Tasks" value={stats.overdue} icon={AlertTriangle} accentColor="#ef4444" iconBg="rgba(239,68,68,0.12)" iconColor="#f87171" progress={stats.total > 0 ? (stats.overdue / stats.total) * 100 : 0} />
        <StatCard label="Needs Review" value={reviewTasksCount} icon={Clock} accentColor="#f59e0b" iconBg="rgba(245,158,11,0.12)" iconColor="#fbbf24" progress={100} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Goals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Task Management
              <span className="text-xs bg-panel border border-border text-text-muted px-2 py-0.5 rounded-full font-normal">
                {filteredGoals.length} task{filteredGoals.length !== 1 && 's'}
              </span>
            </h2>
            <Button size="sm" onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-1.5" /> Create Task
            </Button>
          </div>

          {/* Filters & Search Panel */}
          <div className="bg-surface border border-border rounded-3xl p-5 space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search tasks or mentees..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                icon={Search}
                className="h-10 sm:text-xs rounded-xl"
              />
              
              <Select
                value={selectedMenteeFilter}
                onChange={setSelectedMenteeFilter}
                size="sm"
                className="h-10 text-xs"
                placeholder="All Mentees"
                options={[
                  { value: 'all', label: 'All Mentees' },
                  ...connectedMentees.map(m => ({ value: m.id, label: m.name }))
                ]}
              />

              <Select
                value={selectedStatusFilter}
                onChange={setSelectedStatusFilter}
                size="sm"
                className="h-10 text-xs"
                placeholder="All Statuses"
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

              <Select
                value={selectedPriorityFilter}
                onChange={setSelectedPriorityFilter}
                size="sm"
                className="h-10 text-xs"
                placeholder="All Priorities"
                options={[
                  { value: 'all', label: 'All Priorities' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' }
                ]}
              />
            </div>
            
            {(searchQuery || selectedMenteeFilter !== 'all' || selectedStatusFilter !== 'all' || selectedPriorityFilter !== 'all') && (
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

          {/* Goals Grid */}
          {filteredGoals.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredGoals.map(goal => (
                <GoalCard 
                  key={goal.id} 
                  goal={goal} 
                  tasks={goalTasks.filter(t => t.goalId === goal.id)}
                  onPauseClick={handlePause}
                  onResumeClick={handleResume}
                  onDeleteClick={setDeletingGoalId}
                />
              ))}
            </div>
          ) : (
            <EmptyGoalsState role="mentor" onCreateClick={() => setIsCreateOpen(true)} />
          )}
        </div>

        {/* Right Sidebar: Recent Activity */}
        <div className="space-y-6">
          <section className="bg-surface border border-border rounded-3xl p-6 h-full flex flex-col">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
              Recent Mentee Activity
            </h3>
            <div className="flex-1 overflow-y-auto max-h-[550px] pr-2 custom-scrollbar">
              <GoalActivityTimeline activities={recentActivities} />
            </div>
          </section>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreateOpen && (
        <CreateGoalForm 
          isOpen={isCreateOpen} 
          onClose={() => setIsCreateOpen(false)} 
          connectedMentees={connectedMentees}
        />
      )}

      {/* Editing Modal */}
      {editingGoal && (
        <EditGoalForm 
          isOpen={Boolean(editingGoal)} 
          onClose={() => setEditingGoal(null)} 
          goal={editingGoal}
        />
      )}

      {/* Delete Confirmation */}
      {deletingGoalId && (
        <DeleteGoalDialog
          isOpen={Boolean(deletingGoalId)}
          goalTitle={goals.find(g => g.id === deletingGoalId)?.title || ''}
          onConfirm={handleDelete}
          onClose={() => setDeletingGoalId(null)}
        />
      )}
    </div>
  );
}
