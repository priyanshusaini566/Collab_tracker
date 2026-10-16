import React, { useState } from 'react';
import { Task, TaskStatus, Priority, User, Role } from '../types';
import { 
  X, Calendar, AlertCircle, CheckSquare, MessageSquare, 
  Trash2, Send, Tag, Clock, ArrowRight, ShieldAlert, Check
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  users: User[];
  currentUser: User;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onUpdateTask,
  onDeleteTask,
  users,
  currentUser
}) => {
  if (!isOpen || !task) return null;

  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const isViewer = currentUser.role === 'Viewer';

  // Checklist calculations
  const totalSubtasks = task.checklist.length;
  const completedSubtasks = task.checklist.filter(item => item.completed).length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Toggle subtask
  const handleToggleSubtask = (itemId: string) => {
    if (isViewer) return;
    const updatedChecklist = task.checklist.map(item => {
      if (item.id === itemId) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });

    const isNowAllDone = updatedChecklist.length > 0 && updatedChecklist.every(i => i.completed);
    if (isNowAllDone && !task.checklist.every(i => i.completed)) {
      triggerConfetti();
    }

    onUpdateTask({
      ...task,
      checklist: updatedChecklist,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `updated checklist on "${task.title}"`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  // Add subtask
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || isViewer) return;

    const newItem = {
      id: `c-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    onUpdateTask({
      ...task,
      checklist: [...task.checklist, newItem],
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `added subtask "${newSubtaskTitle.trim()}"`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
    setNewSubtaskTitle('');
  };

  // Delete subtask
  const handleDeleteSubtask = (itemId: string) => {
    if (isViewer) return;
    onUpdateTask({
      ...task,
      checklist: task.checklist.filter(i => i.id !== itemId)
    });
  };

  // Change status
  const handleStatusChange = (newStatus: TaskStatus) => {
    if (isViewer) return;
    if (newStatus === 'Done' && task.status !== 'Done') {
      triggerConfetti();
    }
    onUpdateTask({
      ...task,
      status: newStatus,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `changed status from ${task.status} to ${newStatus}`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  // Change priority
  const handlePriorityChange = (newPriority: Priority) => {
    if (isViewer) return;
    onUpdateTask({
      ...task,
      priority: newPriority,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `updated priority to ${newPriority}`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  // Change assignee
  const handleAssigneeChange = (userId: string) => {
    if (isViewer) return;
    const assignedUser = users.find(u => u.id === userId);
    if (!assignedUser) return;

    onUpdateTask({
      ...task,
      assigneeId: assignedUser.id,
      assigneeName: assignedUser.name,
      assigneeAvatar: assignedUser.avatar,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `assigned task to ${assignedUser.name}`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  // Add comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: `cm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: commentText.trim(),
      createdAt: 'Just now'
    };

    onUpdateTask({
      ...task,
      comments: [...task.comments, newComment],
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `commented on this task`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
    setCommentText('');
  };

  // Add tag
  const handleAddTag = () => {
    if (!newTagInput.trim() || isViewer) return;
    if (!task.tags.includes(newTagInput.trim())) {
      onUpdateTask({
        ...task,
        tags: [...task.tags, newTagInput.trim()]
      });
    }
    setNewTagInput('');
    setShowTagInput(false);
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    if (isViewer) return;
    onUpdateTask({
      ...task,
      tags: task.tags.filter(t => t !== tagToRemove)
    });
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'Urgent':
        return 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-300 dark:border-red-800';
      case 'High':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300 dark:border-amber-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-300 dark:border-blue-800';
      case 'Low':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Viewer mode notification banner */}
        {isViewer && (
          <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>You are viewing as a <strong>Viewer</strong>. Changes to tasks, checklists, and assignments are read-only. Switch role in the top bar to edit.</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {task.id.toUpperCase()}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                {task.priority} Priority
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Stage: {task.status}
              </span>
            </div>

            {/* Title */}
            {isViewer ? (
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {task.title}
              </h2>
            ) : (
              <input
                type="text"
                value={task.title}
                onChange={e => onUpdateTask({ ...task, title: e.target.value })}
                className="w-full text-xl sm:text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none transition-colors"
                placeholder="Task title..."
              />
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 spans): Description, Checklist, Discussion */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Description & Scope
              </label>
              {isViewer ? (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                  {task.description || 'No description provided.'}
                </p>
              ) : (
                <textarea
                  value={task.description}
                  onChange={e => onUpdateTask({ ...task, description: e.target.value })}
                  rows={3}
                  className="w-full text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 resize-none transition-all"
                  placeholder="Describe the deliverable, acceptance criteria, or relevant technical context..."
                />
              )}
            </div>

            {/* Checklist Section (Subtasks) */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Subtask Checklist
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {completedSubtasks} of {totalSubtasks} completed ({progressPercent}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Checklist items list */}
              <div className="space-y-1.5 mb-3">
                {task.checklist.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1">No checklist items added yet.</p>
                ) : (
                  task.checklist.map(item => (
                    <div
                      key={item.id}
                      className="group flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                    >
                      <label className="flex items-center gap-3 cursor-pointer select-none flex-1">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          disabled={isViewer}
                          onChange={() => handleToggleSubtask(item.id)}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                        />
                        <span
                          className={`text-sm ${
                            item.completed
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {item.title}
                        </span>
                      </label>
                      {!isViewer && (
                        <button
                          onClick={() => handleDeleteSubtask(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Subtask form */}
              {!isViewer && (
                <form onSubmit={handleAddSubtask} className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add an actionable subtask (press Enter)..."
                    className="flex-1 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newSubtaskTitle.trim()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>

            {/* Comments & Updates Section */}
            <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                      activeTab === 'details'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Discussion & Comments ({task.comments.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
                      activeTab === 'activity'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Activity History ({task.activities.length})
                  </button>
                </div>
              </div>

              {activeTab === 'details' ? (
                <div>
                  {/* Comments Feed */}
                  <div className="space-y-3 max-h-56 overflow-y-auto mb-4 pr-1">
                    {task.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2 text-center">
                        No comments yet. Start the team discussion below!
                      </p>
                    ) : (
                      task.comments.map(c => (
                        <div key={c.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/60">
                          <img
                            src={c.userAvatar}
                            alt={c.userName}
                            className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div className="flex-1 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-slate-100">{c.userName}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                  {c.userRole}
                                </span>
                              </div>
                              <span className="text-slate-400 text-[11px]">{c.createdAt}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                              {c.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Comment input */}
                  <form onSubmit={handleAddComment} className="flex gap-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        placeholder={`Post update as ${currentUser.name} (${currentUser.role})...`}
                        className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-10 py-2 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={!commentText.trim()}
                        className="absolute right-1.5 top-1.5 p-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* Activity Stream */
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {task.activities.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center">No logged activity yet.</p>
                  ) : (
                    task.activities.map(act => (
                      <div key={act.id} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-none">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{act.userName}</span>
                          <span className="text-slate-500">{act.action}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{act.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (1 span): Metadata & Actions */}
          <div className="space-y-5 bg-slate-50/70 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800 h-fit">
            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Stage / Status
              </label>
              <select
                value={task.status}
                disabled={isViewer}
                onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-60 cursor-pointer"
              >
                <option value="Backlog">📥 Backlog</option>
                <option value="In Progress">⏳ In Progress</option>
                <option value="Review">🔍 Review & Testing</option>
                <option value="Done">✅ Done</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Low', 'Medium', 'High', 'Urgent'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    disabled={isViewer}
                    onClick={() => handlePriorityChange(p)}
                    className={`text-xs py-1.5 px-2 rounded-lg font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                      task.priority === p
                        ? `${getPriorityBadge(p)} ring-2 ring-indigo-500/20 shadow-sm`
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    } disabled:opacity-50`}
                  >
                    {task.priority === p && <Check className="w-3 h-3" />}
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Assigned Teammate
              </label>
              <select
                value={task.assigneeId}
                disabled={isViewer}
                onChange={e => handleAssigneeChange(e.target.value)}
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-60 cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role} - {u.title})
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <img
                  src={task.assigneeAvatar}
                  alt={task.assigneeName}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {task.assigneeName}
                </span>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Due Date
              </label>
              <input
                type="date"
                value={task.dueDate}
                disabled={isViewer}
                onChange={e => onUpdateTask({ ...task, dueDate: e.target.value })}
                className="w-full text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-60 cursor-pointer"
              />
            </div>

            {/* Tags / Labels */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Labels & Tags
                </label>
                {!isViewer && (
                  <button
                    type="button"
                    onClick={() => setShowTagInput(!showTagInput)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    + Add Tag
                  </button>
                )}
              </div>

              {showTagInput && !isViewer && (
                <div className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    placeholder="e.g. Frontend"
                    className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="text-xs bg-indigo-600 text-white px-2 py-1 rounded font-semibold"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {task.tags.map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    #{t}
                    {!isViewer && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Delete Task Button */}
            {!isViewer && currentUser.role === 'Admin' && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-900/60 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task (Admin Only)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Created on {task.createdAt} • ID: {task.id}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
};
