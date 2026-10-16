import React, { useState } from 'react';
import { Task, TaskStatus, Priority, User } from '../types';
import { 
  Plus, Search, Filter, CheckSquare, MessageSquare, 
  Calendar, ArrowRight, Sparkles, CheckCircle2, Clock, 
  ListFilter, AlertTriangle, ChevronRight, X
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onOpenTaskModal: (task: Task) => void;
  onOpenNewTaskModal: (status: TaskStatus) => void;
  users: User[];
  currentUser: User;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; borderAccent: string; icon: string }[] = [
  { id: 'Backlog', title: 'Backlog', color: 'bg-slate-100/80 dark:bg-slate-800/60', borderAccent: 'border-slate-300 dark:border-slate-700', icon: '📥' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-blue-50/70 dark:bg-blue-950/20', borderAccent: 'border-blue-400 dark:border-blue-700', icon: '⏳' },
  { id: 'Review', title: 'Review / QA', color: 'bg-purple-50/70 dark:bg-purple-950/20', borderAccent: 'border-purple-400 dark:border-purple-700', icon: '🔍' },
  { id: 'Done', title: 'Completed', color: 'bg-emerald-50/70 dark:bg-emerald-950/20', borderAccent: 'border-emerald-400 dark:border-emerald-700', icon: '✅' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onUpdateTask,
  onOpenTaskModal,
  onOpenNewTaskModal,
  users,
  currentUser
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  const isViewer = currentUser.role === 'Viewer';

  // Extract all unique tags
  const allTags = Array.from(new Set(tasks.flatMap(t => t.tags || [])));

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesAssignee = selectedAssignee === 'all' || task.assigneeId === selectedAssignee;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesTag = selectedTag === 'all' || task.tags.includes(selectedTag);

    return matchesSearch && matchesAssignee && matchesPriority && matchesTag;
  });

  const hasActiveFilters = searchQuery !== '' || selectedAssignee !== 'all' || selectedPriority !== 'all' || selectedTag !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedAssignee('all');
    setSelectedPriority('all');
    setSelectedTag('all');
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (isViewer) {
      e.preventDefault();
      return;
    }
    setDraggingTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    if (isViewer) return;

    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === targetStatus) {
      setDraggingTaskId(null);
      return;
    }

    if (targetStatus === 'Done') {
      triggerConfetti();
    }

    onUpdateTask({
      ...task,
      status: targetStatus,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `dragged card to ${targetStatus}`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });

    setDraggingTaskId(null);
  };

  // Quick move handler (for clicks/touchpad without dragging)
  const handleQuickMove = (e: React.MouseEvent, task: Task, nextStatus: TaskStatus) => {
    e.stopPropagation();
    if (isViewer) return;

    if (nextStatus === 'Done' && task.status !== 'Done') {
      triggerConfetti();
    }

    onUpdateTask({
      ...task,
      status: nextStatus,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `moved card to ${nextStatus}`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  const getPriorityStyle = (p: Priority) => {
    switch (p) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'High':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'Backlog') return 'In Progress';
    if (current === 'In Progress') return 'Review';
    if (current === 'Review') return 'Done';
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, description, or #tag..."
              className="w-full text-xs sm:text-sm pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Assignee Filter */}
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 px-2">Assignee:</span>
              <button
                onClick={() => setSelectedAssignee('all')}
                className={`text-xs px-2 py-1 rounded-lg font-medium transition-colors ${
                  selectedAssignee === 'all'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </button>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => setSelectedAssignee(u.id)}
                  title={`${u.name} (${u.role})`}
                  className={`relative p-0.5 rounded-full transition-transform ${
                    selectedAssignee === u.id ? 'ring-2 ring-indigo-500 scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                </button>
              ))}
            </div>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">🔴 Urgent</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🔵 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>

            {/* Tag Filter */}
            {allTags.length > 0 && (
              <select
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>#{tag}</option>
                ))}
              </select>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold px-2 py-1 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Kanban Board Grid - 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);
          const totalHours = columnTasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);

          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, column.id)}
              className={`flex flex-col rounded-2xl border ${column.borderAccent} bg-slate-100/60 dark:bg-slate-900/50 p-3 min-h-[600px] transition-colors`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-base">{column.icon}</span>
                  <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                    {column.title}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
                    {columnTasks.length}
                  </span>
                </div>

                {!isViewer && (
                  <button
                    onClick={() => onOpenNewTaskModal(column.id)}
                    title={`Add task to ${column.title}`}
                    className="p-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3 kanban-column-scroll overflow-y-auto pr-0.5">
                {columnTasks.length === 0 ? (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center p-4">
                    <p className="text-xs text-slate-400 font-medium">No tasks in this stage</p>
                    {!isViewer && (
                      <button
                        onClick={() => onOpenNewTaskModal(column.id)}
                        className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                      >
                        + Create a card
                      </button>
                    )}
                  </div>
                ) : (
                  columnTasks.map(task => {
                    const totalChecks = task.checklist.length;
                    const doneChecks = task.checklist.filter(c => c.completed).length;
                    const nextStage = getNextStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        draggable={!isViewer}
                        onDragStart={e => handleDragStart(e, task.id)}
                        onClick={() => onOpenTaskModal(task)}
                        className={`group relative bg-white dark:bg-slate-800 rounded-xl p-3.5 shadow-sm hover:shadow-md border border-slate-200/90 dark:border-slate-700/80 cursor-pointer transition-all hover:border-indigo-400 dark:hover:border-indigo-500 select-none ${
                          draggingTaskId === task.id ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        {/* Top Meta: Priority + Tags */}
                        <div className="flex items-center justify-between gap-1.5 mb-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>

                          <div className="flex items-center gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 font-medium"
                              >
                                #{tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="text-[10px] text-slate-400">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 mb-1.5 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </h4>

                        {/* Description Preview */}
                        {task.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        {/* Subtasks Progress Bar (if exists) */}
                        {totalChecks > 0 && (
                          <div className="mb-3 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3 text-indigo-500" />
                                Subtasks
                              </span>
                              <span>{doneChecks}/{totalChecks}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  doneChecks === totalChecks ? 'bg-emerald-500' : 'bg-indigo-500'
                                }`}
                                style={{ width: `${(doneChecks / totalChecks) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Bottom Row: Assignee + Due Date + Comments + Quick Move */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500">
                          {/* Assignee & Comments */}
                          <div className="flex items-center gap-2">
                            <div className="relative group/avatar">
                              <img
                                src={task.assigneeAvatar}
                                alt={task.assigneeName}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                              />
                              <div className="absolute bottom-full left-0 mb-1 hidden group-hover/avatar:block z-20 whitespace-nowrap bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg">
                                {task.assigneeName}
                              </div>
                            </div>

                            {task.comments.length > 0 && (
                              <span className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600">
                                <MessageSquare className="w-3 h-3" />
                                {task.comments.length}
                              </span>
                            )}
                          </div>

                          {/* Due Date & Quick Move */}
                          <div className="flex items-center gap-1.5">
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate.slice(5)}
                              </span>
                            )}

                            {/* Quick Next Stage Move Button */}
                            {!isViewer && nextStage && (
                              <button
                                onClick={e => handleQuickMove(e, task, nextStage)}
                                title={`Quick move to ${nextStage}`}
                                className="p-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-400 hover:text-indigo-600 transition-colors"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Add Card for column */}
              {!isViewer && (
                <button
                  onClick={() => onOpenNewTaskModal(column.id)}
                  className="mt-3 py-2 px-3 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Card
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
