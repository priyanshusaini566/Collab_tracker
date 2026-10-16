import React, { useState, useEffect } from 'react';
import { Task, User, Workspace, Board } from '../types';
import { 
  CheckCircle2, Clock, AlertTriangle, Users, TrendingUp, 
  Flame, Award, CheckSquare, BarChart3, PieChart, Activity
} from 'lucide-react';

interface ProgressDashboardProps {
  tasks: Task[];
  users: User[];
  currentWorkspace: Workspace;
  currentBoard: Board;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  tasks,
  users,
  currentWorkspace,
  currentBoard
}) => {
  // Real-time countdown timer to deadline
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 28,
    minutes: 45,
    seconds: 12
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Metrics calculation
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'Review').length;
  const backlogTasks = tasks.filter(t => t.status === 'Backlog').length;

  const completionPercentage = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // Subtask overall progress
  const allSubtasks = tasks.flatMap(t => t.checklist);
  const totalSubtasks = allSubtasks.length;
  const completedSubtasks = allSubtasks.filter(s => s.completed).length;
  const subtasksPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Priority counts
  const urgentCount = tasks.filter(t => t.priority === 'Urgent').length;
  const highCount = tasks.filter(t => t.priority === 'High').length;
  const mediumCount = tasks.filter(t => t.priority === 'Medium').length;
  const lowCount = tasks.filter(t => t.priority === 'Low').length;

  // Member Workloads
  const memberWorkload = users.map(user => {
    const userTasks = tasks.filter(t => t.assigneeId === user.id);
    const userDone = userTasks.filter(t => t.status === 'Done').length;
    const userActive = userTasks.filter(t => t.status === 'In Progress' || t.status === 'Review').length;
    const percent = userTasks.length > 0 ? Math.round((userDone / userTasks.length) * 100) : 0;
    
    // Status warning if active tasks >= 2 and due date close
    const needsHelp = userActive >= 2 && userDone < userActive;

    return {
      user,
      total: userTasks.length,
      done: userDone,
      active: userActive,
      percent,
      needsHelp
    };
  });

  // Recent team activity stream
  const recentActivities = tasks
    .flatMap(t => t.activities.map(a => ({ ...a, taskTitle: t.title })))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Top Banner / Sprint Goal & Countdown */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-6 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
                Active Sprint
              </span>
              <span className="text-indigo-200 text-xs font-medium">
                {currentWorkspace.name} • {currentBoard.name}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentBoard.sprintGoal}
            </h2>
            <p className="text-indigo-100 text-xs sm:text-sm">
              Keep everyone aligned, track bottlenecks early, and finish strong before tomorrow's presentation.
            </p>
          </div>

          {/* Hackathon / Presentation Countdown Timer */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
            <Clock className="w-8 h-8 text-amber-300 animate-pulse" />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                Presentation Deadline In
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white flex items-center gap-1.5">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-indigo-300">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-indigo-300">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Completion */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sprint Completion
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {completionPercentage}%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({doneTasks}/{totalTasks} tasks)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Subtask Delivery */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Subtasks Done
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {subtasksPercent}%
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({completedSubtasks}/{totalSubtasks} items)
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${subtasksPercent}%` }}
            />
          </div>
        </div>

        {/* Active In-Flight */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active In-Flight
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {inProgressTasks + reviewTasks}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {inProgressTasks} dev • {reviewTasks} review
            </span>
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Moving through sprint stages
          </div>
        </div>

        {/* Urgent High-Risk */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Urgent Deliverables
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950 flex items-center justify-center text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">
              {urgentCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              + {highCount} High priority
            </span>
          </div>
          <div className="text-xs text-red-500 font-medium">
            Requires team focus
          </div>
        </div>
      </div>

      {/* Main Grid: Workload Distribution + Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Workload Distribution (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Team Member Workload & Health Overview
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifies who is overloaded and ensures responsibilities are evenly shared across the group
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              {users.length} Active Teammates
            </span>
          </div>

          <div className="space-y-4">
            {memberWorkload.map(item => (
              <div
                key={item.user.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.user.avatar}
                      alt={item.user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {item.user.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {item.user.role}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{item.user.title}</span>
                    </div>
                  </div>

                  {/* Workload Status Pill */}
                  <div className="flex items-center gap-2">
                    {item.needsHelp ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1 border border-amber-300 dark:border-amber-800">
                        <AlertTriangle className="w-3.5 h-3.5" /> High Active Load
                      </span>
                    ) : item.total === 0 ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                        Available for tasks
                      </span>
                    ) : item.percent === 100 ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> All Delivered
                      </span>
                    ) : (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        Healthy Progress
                      </span>
                    )}
                  </div>
                </div>

                {/* Task workload bar */}
                <div>
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>
                      {item.done} completed • {item.active} in-flight • {item.total} total
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.percent}% done</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${item.total > 0 ? (item.done / item.total) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-indigo-500 h-full transition-all duration-300"
                      style={{ width: `${item.total > 0 ? (item.active / item.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stage Distribution & Priorities Breakdown */}
        <div className="space-y-6">
          {/* Stage Status Distribution */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Stage Distribution
            </h3>

            {/* Segmented Bar */}
            <div className="w-full h-4 rounded-xl overflow-hidden flex bg-slate-200 dark:bg-slate-800 shadow-inner">
              <div
                title={`Done: ${doneTasks}`}
                style={{ width: `${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0}%` }}
                className="bg-emerald-500 h-full transition-all"
              />
              <div
                title={`Review: ${reviewTasks}`}
                style={{ width: `${totalTasks > 0 ? (reviewTasks / totalTasks) * 100 : 0}%` }}
                className="bg-purple-500 h-full transition-all"
              />
              <div
                title={`In Progress: ${inProgressTasks}`}
                style={{ width: `${totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0}%` }}
                className="bg-blue-500 h-full transition-all"
              />
              <div
                title={`Backlog: ${backlogTasks}`}
                style={{ width: `${totalTasks > 0 ? (backlogTasks / totalTasks) * 100 : 0}%` }}
                className="bg-slate-400 h-full transition-all"
              />
            </div>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Completed (Done)</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{doneTasks} cards</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50/70 dark:bg-purple-950/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">In Review / Testing</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{reviewTasks} cards</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">In Active Progress</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{inProgressTasks} cards</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Backlog Queue</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{backlogTasks} cards</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Audit */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Live Team Activity Stream
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {recentActivities.map(act => (
                <div
                  key={act.id}
                  className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{act.userName}</span>
                    <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">
                    {act.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
