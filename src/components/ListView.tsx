import React, { useState } from 'react';
import { Task, TaskStatus, Priority, User } from '../types';
import { 
  CheckSquare, MessageSquare, Calendar, ChevronRight, 
  ArrowUpDown, Search, Filter, ShieldAlert 
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface ListViewProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onOpenTaskModal: (task: Task) => void;
  users: User[];
  currentUser: User;
}

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  onUpdateTask,
  onOpenTaskModal,
  users,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'title' | 'status' | 'priority' | 'dueDate'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const isViewer = currentUser.role === 'Viewer';

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
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
          action: `updated status to ${newStatus} via List View`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  const handlePriorityChange = (task: Task, newPriority: Priority) => {
    if (isViewer) return;
    onUpdateTask({
      ...task,
      priority: newPriority,
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `changed priority to ${newPriority}`,
          timestamp: 'Just now'
        },
        ...task.activities
      ]
    });
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.assigneeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortField === 'dueDate') {
      return sortOrder === 'asc' 
        ? a.dueDate.localeCompare(b.dueDate)
        : b.dueDate.localeCompare(a.dueDate);
    }
    if (sortField === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sortField === 'priority') {
      const order = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      return sortOrder === 'asc' 
        ? order[a.priority] - order[b.priority] 
        : order[b.priority] - order[a.priority];
    }
    return 0;
  });

  const toggleSort = (field: 'title' | 'status' | 'priority' | 'dueDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getPriorityBadge = (p: Priority) => {
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

  return (
    <div className="space-y-4">
      {/* List Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search list deliverables..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium"
          >
            <option value="all">All Stages</option>
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>

          <span className="text-xs font-semibold text-slate-500">
            {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">
                  <button 
                    onClick={() => toggleSort('title')}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white"
                  >
                    Task / Deliverable <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button 
                    onClick={() => toggleSort('status')}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white"
                  >
                    Stage Status <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">
                  <button 
                    onClick={() => toggleSort('priority')}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white"
                  >
                    Priority <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Assignee</th>
                <th className="py-3.5 px-4">
                  <button 
                    onClick={() => toggleSort('dueDate')}
                    className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white"
                  >
                    Due Date <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4">Subtasks</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
              {sortedTasks.map(task => {
                const totalSubs = task.checklist.length;
                const completedSubs = task.checklist.filter(c => c.completed).length;

                return (
                  <tr
                    key={task.id}
                    onClick={() => onOpenTaskModal(task)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    {/* Title & Tags */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          {task.tags.map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={task.status}
                        disabled={isViewer}
                        onChange={e => handleStatusChange(task, e.target.value as TaskStatus)}
                        className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 font-semibold text-slate-800 dark:text-slate-200 disabled:opacity-50"
                      >
                        <option value="Backlog">📥 Backlog</option>
                        <option value="In Progress">⏳ In Progress</option>
                        <option value="Review">🔍 Review</option>
                        <option value="Done">✅ Done</option>
                      </select>
                    </td>

                    {/* Priority Dropdown */}
                    <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={task.priority}
                        disabled={isViewer}
                        onChange={e => handlePriorityChange(task, e.target.value as Priority)}
                        className={`text-xs border rounded-lg px-2.5 py-1 font-bold ${getPriorityBadge(task.priority)} disabled:opacity-50`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </td>

                    {/* Assignee */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assigneeAvatar}
                          alt={task.assigneeName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                          {task.assigneeName}
                        </span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-600 dark:text-slate-400">
                      {task.dueDate}
                    </td>

                    {/* Subtasks */}
                    <td className="py-3.5 px-4">
                      {totalSubs > 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                completedSubs === totalSubs ? 'bg-emerald-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${(completedSubs / totalSubs) * 100}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-slate-500">
                            {completedSubs}/{totalSubs}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onOpenTaskModal(task)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
