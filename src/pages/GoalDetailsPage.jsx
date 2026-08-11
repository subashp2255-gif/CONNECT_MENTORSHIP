import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Shield, Play, Pause, Trash2, Edit, Plus, 
  ArrowUp, ArrowDown, ExternalLink, MessageSquare, CheckCircle, Clock, AlertTriangle, AlertCircle
} from 'lucide-react';
import { parseISO, format, differenceInDays } from 'date-fns';
import { useStore } from '../store/useStore';
import GoalStatusBadge from '../components/goals/GoalStatusBadge';
import PriorityBadge from '../components/goals/PriorityBadge';
import GoalProgressBar from '../components/goals/GoalProgressBar';
import GoalActivityTimeline from '../components/goals/GoalActivityTimeline';
import DeleteGoalDialog from '../components/goals/DeleteGoalDialog';
import EditGoalForm from '../components/goals/EditGoalForm';
import TaskSubmissionForm from '../components/goals/TaskSubmissionForm';
import MentorReviewPanel from '../components/goals/MentorReviewPanel';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function GoalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { 
    currentUser, role, goals, goalTasks, goalActivities, 
    startTask, addTask, deleteTask, updateTask, reorderTasks, 
    pauseGoal, resumeGoal, deleteGoal 
  } = useStore();

  const isMentor = role === 'mentor';

  // Modal / Form States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submissionTask, setSubmissionTask] = useState(null); // task currently being submitted
  const [reviewTask, setReviewTask] = useState(null); // task currently being reviewed
  
  // Inline Add Task States (Mentor only)
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [taskErrors, setTaskErrors] = useState({});

  // Inline Edit Task States
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [editingTaskDesc, setEditingTaskDesc] = useState('');

  // Fetch target goal
  const goal = useMemo(() => goals.find(g => g.id === id), [goals, id]);

  // Fetch tasks for this goal
  const tasks = useMemo(() => {
    return goalTasks.filter(t => t.goalId === id) || [];
  }, [goalTasks, id]);

  // Fetch activities for this goal
  const activities = useMemo(() => {
    return goalActivities.filter(a => a.goalId === id) || [];
  }, [goalActivities, id]);

  if (!goal) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Task Not Found</h2>
        <p className="text-sm text-text-muted mb-6">The learning task you are trying to view does not exist or has been deleted.</p>
        <Link to={isMentor ? '/mentor/dashboard?tab=goals' : '/dashboard?tab=goals'}>
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  // Partner Name resolution
  const mockMentees = [
    { id: "u1", name: "Ravi Kumar" },
    { id: "u2", name: "Sita Mahalakshmi" },
    { id: "u3", name: "Aryan Bose" },
    { id: "u4", name: "Meera Rajput" },
    { id: "u5", name: "Kabir Singh" }
  ];
  const mockMentors = useStore((state) => state.mentorList || []);

  const partnerName = isMentor 
    ? (mockMentees.find(m => m.id === goal.menteeId)?.name || 'Mentee')
    : (mockMentors.find(m => m.id === goal.mentorId)?.name || 'Mentor');

  // Deadline logic
  const now = new Date();
  const deadlineDate = parseISO(goal.targetDate);
  const daysRemaining = differenceInDays(deadlineDate, now);
  
  let deadlineLabel = '';
  let deadlineClass = 'text-text-muted';
  
  if (goal.status === 'Completed') {
    deadlineLabel = 'Completed';
    deadlineClass = 'text-green-400 font-medium';
  } else if (now > deadlineDate) {
    deadlineLabel = 'Overdue';
    deadlineClass = 'text-red-400 font-medium animate-pulse';
  } else if (daysRemaining <= 7 && daysRemaining >= 0) {
    deadlineLabel = `Due Soon (${daysRemaining}d)`;
    deadlineClass = 'text-orange-400 font-medium';
  } else {
    deadlineLabel = `Due in ${daysRemaining} days`;
    deadlineClass = 'text-text-muted';
  }

  // Mentor Actions
  const handlePauseToggle = () => {
    try {
      if (goal.isPaused) {
        resumeGoal(goal.id);
        toast.success('Task resumed.');
      } else {
        pauseGoal(goal.id);
        toast.success('Task paused.');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteGoal = () => {
    try {
      deleteGoal(goal.id);
      toast.success('Task deleted successfully.');
      navigate(isMentor ? '/mentor/dashboard?tab=goals' : '/dashboard?tab=goals');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Task inline CRUD actions (Mentor only)
  const handleAddTask = (e) => {
    e.preventDefault();
    setTaskErrors({});
    if (!newTaskTitle.trim()) {
      setTaskErrors({ title: 'Task title is required' });
      return;
    }

    try {
      addTask(goal.id, {
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim()
      });
      toast.success('Milestone task added!');
      setNewTaskTitle('');
      setNewTaskDesc('');
      setIsAddingTask(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStartEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    setEditingTaskDesc(task.description || '');
  };

  const handleSaveEditTask = (taskId) => {
    if (!editingTaskTitle.trim()) {
      toast.error('Task title cannot be empty.');
      return;
    }
    try {
      updateTask(taskId, {
        title: editingTaskTitle.trim(),
        description: editingTaskDesc.trim()
      });
      toast.success('Task details updated.');
      setEditingTaskId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteTask = (taskId) => {
    try {
      deleteTask(taskId);
      toast.success('Task removed from goal.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reordering handler
  const handleMoveTask = (idx, direction) => {
    const updatedTasks = [...tasks];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updatedTasks.length) return;

    // Swap
    const temp = updatedTasks[idx];
    updatedTasks[idx] = updatedTasks[targetIdx];
    updatedTasks[targetIdx] = temp;

    try {
      reorderTasks(goal.id, updatedTasks.map(t => t.id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Mentee actions
  const handleStartTask = (taskId) => {
    try {
      startTask(taskId);
      toast.success('Task status set to In Progress!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const approvedTasksCount = tasks.filter(t => t.status === 'Approved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col space-y-8 animate-fadeUp">
      
      {/* Back breadcrumb */}
      <div>
        <Link 
          to={isMentor ? '/mentor/dashboard?tab=goals' : '/dashboard?tab=goals'}
          className="text-sm text-text-muted hover:text-white flex items-center gap-1.5 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      {/* Goal Details Banner */}
      <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden shadow-2xl">
        
        {/* Banner Details */}
        <div className="space-y-4 md:max-w-2xl flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <GoalStatusBadge status={goal.status} />
            <PriorityBadge priority={goal.priority} />
            {goal.isPaused && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/25">
                Paused
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{goal.title}</h1>
            <p className="text-sm text-text-dim mt-2 font-medium">
              {isMentor ? `Assigned to mentee ${partnerName}` : `Created by mentor ${partnerName}`}
            </p>
          </div>

          <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{goal.description || 'No description provided.'}</p>
          
          {/* Target details */}
          <div className="flex flex-wrap gap-4 text-xs pt-2">
            <div className="flex items-center gap-1.5 bg-panel border border-border/50 px-3 py-1.5 rounded-xl text-text-muted">
              <Calendar className="w-3.5 h-3.5 text-text-dim" />
              <span>Started: {format(parseISO(goal.startDate), 'dd MMM yyyy')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-panel border border-border/50 px-3 py-1.5 rounded-xl text-text-muted">
              <Calendar className="w-3.5 h-3.5 text-text-dim" />
              <span className={deadlineClass}>
                Deadline: {format(deadlineDate, 'dd MMM yyyy')} ({deadlineLabel})
              </span>
            </div>
          </div>
        </div>

        {/* Banner Progress & Management Buttons */}
        <div className="md:w-72 shrink-0 flex flex-col justify-between gap-6 border-t md:border-t-0 md:border-l border-border/50 pt-6 md:pt-0 md:pl-6">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Task Completion</h3>
            <GoalProgressBar 
              progress={goal.progress} 
              totalTasks={tasks.length} 
              approvedTasks={approvedTasksCount}
            />
          </div>

          {isMentor && (
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handlePauseToggle}
                className="flex-1 p-2.5 rounded-xl bg-panel hover:bg-white/5 border border-border text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {goal.isPaused ? <Play className="w-3.5 h-3.5 text-green-400" /> : <Pause className="w-3.5 h-3.5 text-orange-400" />}
                {goal.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-2.5 rounded-xl bg-panel hover:bg-white/5 border border-border text-text-muted hover:text-white transition-colors"
                title="Edit Details"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Milestones vs Activity Log */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Milestones list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Milestones & Tasks</h2>
            {isMentor && !isAddingTask && (
              <Button size="sm" onClick={() => setIsAddingTask(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Add Task
              </Button>
            )}
          </div>

          {/* Inline Add Task Form (Mentor) */}
          {isAddingTask && (
            <form onSubmit={handleAddTask} className="p-5 bg-surface border border-border rounded-2xl space-y-4 animate-fadeUp">
              <div className="flex justify-between items-center pb-2 border-b border-border/50">
                <h4 className="font-bold text-white text-sm">Add New Milestone Task</h4>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="text-text-muted hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>
              <Input
                label="Task Title"
                placeholder="e.g. Set up local Docker database"
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                error={taskErrors.title}
                required
              />
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5">Description (optional)</label>
                <textarea
                  placeholder="Task guidelines, link to repositories, or review expectations..."
                  rows={2}
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-xs focus:outline-none transition-colors"
                />
              </div>
              <div className="flex justify-end gap-2.5">
                <Button type="button" size="sm" variant="ghost" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Add Milestone
                </Button>
              </div>
            </form>
          )}

          {/* Tasks Grid */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center p-8 bg-surface/50 border border-dashed border-border rounded-2xl text-text-muted text-sm">
                No milestone tasks defined for this goal yet.
              </div>
            ) : (
              tasks.map((task, idx) => {
                const isEditing = editingTaskId === task.id;
                
                return (
                  <div 
                    key={task.id} 
                    className={`bg-surface border border-border rounded-2xl p-5 transition-all relative ${
                      task.status === 'Approved' ? 'border-green-500/25 bg-green-500/[0.01]' : ''
                    }`}
                  >
                    
                    {/* Inline Task Edit Mode */}
                    {isEditing ? (
                      <div className="space-y-4">
                        <Input
                          label="Task Title"
                          value={editingTaskTitle}
                          onChange={e => setEditingTaskTitle(e.target.value)}
                          required
                        />
                        <div>
                          <label className="block text-xs font-medium text-text-muted mb-1.5">Task Description</label>
                          <textarea
                            rows={2}
                            value={editingTaskDesc}
                            onChange={e => setEditingTaskDesc(e.target.value)}
                            className="w-full rounded-xl border border-border bg-panel text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary py-2 px-3 text-xs focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setEditingTaskId(null)}>Cancel</Button>
                          <Button size="sm" onClick={() => handleSaveEditTask(task.id)}>Save Changes</Button>
                        </div>
                      </div>
                    ) : (
                      // Read Only Task Display
                      <div className="flex gap-4 items-start">
                        {/* Task Order / Controls */}
                        {isMentor && (
                          <div className="flex flex-col gap-1 items-center justify-center pt-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveTask(idx, 'up')}
                              className="p-1 hover:bg-white/5 rounded text-text-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-bold text-text-dim">{idx + 1}</span>
                            <button
                              disabled={idx === tasks.length - 1}
                              onClick={() => handleMoveTask(idx, 'down')}
                              className="p-1 hover:bg-white/5 rounded text-text-muted hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Task Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <h4 className="font-bold text-white text-base flex items-center gap-2">
                              {task.title}
                              {task.status === 'Approved' && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                              {task.status === 'Submitted' && <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />}
                              {task.status === 'Needs Improvement' && <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                            </h4>
                            
                            {/* Task Status Badge */}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                              task.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              task.status === 'Submitted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                              task.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              task.status === 'Needs Improvement' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}>
                              {task.status}
                            </span>
                          </div>

                          <p className="text-xs text-text-muted leading-relaxed">{task.description}</p>

                          {/* Mentee submission detail display */}
                          {(task.menteeNotes || task.proofLink) && (
                            <div className="mt-3 bg-panel border border-border/30 p-3.5 rounded-xl text-xs space-y-2.5">
                              {task.menteeNotes && (
                                <div>
                                  <span className="text-[10px] text-text-dim block mb-0.5">Mentee Submission Notes:</span>
                                  <p className="text-gray-300 italic whitespace-pre-wrap">"{task.menteeNotes}"</p>
                                </div>
                              )}
                              {task.proofLink && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-text-dim">Deliverable:</span>
                                  <a 
                                    href={task.proofLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary-light hover:text-white hover:underline font-medium inline-flex items-center gap-0.5"
                                  >
                                    View Link <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Mentor review feedback display */}
                          {task.mentorFeedback && (
                            <div className="mt-3 bg-purple-500/5 border border-purple-500/20 p-3.5 rounded-xl text-xs">
                              <span className="text-[10px] text-purple-400 block mb-0.5 font-semibold">Mentor Feedback:</span>
                              <p className="text-gray-300 italic">"{task.mentorFeedback}"</p>
                            </div>
                          )}

                          {/* Action triggers */}
                          <div className="flex gap-2 pt-2 justify-end">
                            {isMentor ? (
                              <>
                                <button
                                  onClick={() => handleStartEditTask(task)}
                                  className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 border border-transparent hover:border-border transition-all text-xs flex items-center gap-1"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all text-xs flex items-center gap-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                                {task.status === 'Submitted' && (
                                  <Button 
                                    size="sm" 
                                    variant="primary" 
                                    className="h-8 py-0 px-3 text-xs"
                                    onClick={() => setReviewTask(task)}
                                  >
                                    Review Work
                                  </Button>
                                )}
                              </>
                            ) : (
                              // Mentee Actions
                              <>
                                {task.status === 'Not Started' && (
                                  <Button 
                                    size="sm" 
                                    className="h-8 py-0 px-3 text-xs" 
                                    onClick={() => handleStartTask(task.id)}
                                  >
                                    Start Task
                                  </Button>
                                )}
                                {task.status === 'In Progress' && (
                                  <Button 
                                    size="sm" 
                                    className="h-8 py-0 px-3 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30"
                                    onClick={() => setSubmissionTask(task)}
                                  >
                                    Submit Deliverable
                                  </Button>
                                )}
                                {task.status === 'Submitted' && (
                                  <button
                                    onClick={() => setSubmissionTask(task)}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 border border-border transition-all text-xs font-semibold"
                                  >
                                    Edit Submission
                                  </button>
                                )}
                                {task.status === 'Needs Improvement' && (
                                  <Button 
                                    size="sm" 
                                    variant="danger"
                                    className="h-8 py-0 px-3 text-xs"
                                    onClick={() => setSubmissionTask(task)}
                                  >
                                    Resubmit Task
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right sidebar: Activity timeline */}
        <div className="space-y-6">
          <section className="bg-surface border border-border rounded-3xl p-6 flex flex-col shadow-2xl">
            <h3 className="font-bold text-white mb-6">Task Timeline Log</h3>
            <div className="max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
              <GoalActivityTimeline activities={activities} />
            </div>
          </section>
        </div>
      </div>

      {/* Edit Form Modal */}
      {isEditOpen && (
        <EditGoalForm
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          goal={goal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <DeleteGoalDialog
          isOpen={isDeleteOpen}
          goalTitle={goal.title}
          onConfirm={handleDeleteGoal}
          onClose={() => setIsDeleteOpen(false)}
        />
      )}

      {/* Mentee Submission Form Modal */}
      {submissionTask && (
        <TaskSubmissionForm
          isOpen={Boolean(submissionTask)}
          task={submissionTask}
          onClose={() => setSubmissionTask(null)}
        />
      )}

      {/* Mentor Review Panel Modal */}
      {reviewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
            <MentorReviewPanel
              task={reviewTask}
              onClose={() => setReviewTask(null)}
              onReviewed={() => setReviewTask(null)}
            />
          </div>
        </div>
      )}

    </div>
  );
}
