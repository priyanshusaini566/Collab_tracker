import React, { useState, useEffect } from 'react';
import { Workspace, Task, User, TaskStatus, Role } from './types';
import { CURRENT_USERS, INITIAL_WORKSPACES, INITIAL_TASKS } from './mockData';
import { Navbar } from './components/Navbar';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { TeamManagement } from './components/TeamManagement';
import { TaskModal } from './components/TaskModal';
import { NewTaskModal } from './components/NewTaskModal';
import { NewWorkspaceModal } from './components/NewWorkspaceModal';
import { PresentationGuideModal } from './components/PresentationGuideModal';

export const App: React.FC = () => {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('syncpulse_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('syncpulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('syncpulse_theme', 'light');
    }
  }, [isDark]);

  // Workspaces state
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem('syncpulse_workspaces');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved workspaces', e);
      }
    }
    return INITIAL_WORKSPACES;
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    return workspaces[0]?.id || 'ws-hackathon-2026';
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('syncpulse_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved tasks', e);
      }
    }
    return INITIAL_TASKS;
  });

  // Current User / Role Simulation state
  const [currentUserId, setCurrentUserId] = useState<string>('u-alex');
  const currentUser = CURRENT_USERS.find(u => u.id === currentUserId) || CURRENT_USERS[0];

  // Read URL search params for deep-linking & screenshots
  const queryParams = new URLSearchParams(window.location.search);
  const initialTabParam = queryParams.get('tab') as ('board' | 'list' | 'analytics' | 'team') | null;
  const initialModalParam = queryParams.get('modal');

  // Tab navigation
  const [currentTab, setCurrentTab] = useState<'board' | 'list' | 'analytics' | 'team'>(
    initialTabParam || 'board'
  );

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(() => {
    if (initialModalParam === 'task') {
      return INITIAL_TASKS[1]; // Task 102 (In Progress with checklist and comments)
    }
    return null;
  });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(initialModalParam === 'task');

  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] = useState<TaskStatus>('Backlog');

  const [isNewWorkspaceModalOpen, setIsNewWorkspaceModalOpen] = useState(false);
  const [isPresentationGuideOpen, setIsPresentationGuideOpen] = useState(initialModalParam === 'pitch');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('syncpulse_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  useEffect(() => {
    localStorage.setItem('syncpulse_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Active workspace & active board resolution
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];
  const currentBoard = currentWorkspace?.boards.find(b => b.id === currentWorkspace.activeBoardId) || currentWorkspace?.boards[0];

  // Tasks for current workspace and active board
  const boardTasks = tasks.filter(
    t => t.workspaceId === currentWorkspace.id && t.boardId === currentBoard?.id
  );

  // Handlers
  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'comments' | 'activities'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action: `created this task in ${newTaskData.status}`,
          timestamp: 'Just now'
        }
      ]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleOpenTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTaskModal = (status: TaskStatus) => {
    setNewTaskDefaultStatus(status);
    setIsNewTaskModalOpen(true);
  };

  const handleCreateWorkspace = (newWorkspace: Workspace) => {
    setWorkspaces(prev => [...prev, newWorkspace]);
    setActiveWorkspaceId(newWorkspace.id);
  };

  const handleUpdateWorkspace = (updatedWorkspace: Workspace) => {
    setWorkspaces(prev => prev.map(w => (w.id === updatedWorkspace.id ? updatedWorkspace : w)));
  };

  const handleSelectBoard = (boardId: string) => {
    const updated = {
      ...currentWorkspace,
      activeBoardId: boardId
    };
    handleUpdateWorkspace(updated);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to the clean Hackathon presentation state?')) {
      localStorage.removeItem('syncpulse_tasks');
      localStorage.removeItem('syncpulse_workspaces');
      setWorkspaces(INITIAL_WORKSPACES);
      setActiveWorkspaceId(INITIAL_WORKSPACES[0].id);
      setTasks(INITIAL_TASKS);
      setCurrentUserId('u-alex');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={setActiveWorkspaceId}
        onOpenNewWorkspaceModal={() => setIsNewWorkspaceModalOpen(true)}
        onSelectBoard={handleSelectBoard}
        users={CURRENT_USERS}
        currentUser={currentUser}
        onSelectUser={setCurrentUserId}
        onOpenPresentationGuide={() => setIsPresentationGuideOpen(true)}
        onResetData={handleResetData}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'board' && (
          <KanbanBoard
            tasks={boardTasks}
            onUpdateTask={handleUpdateTask}
            onOpenTaskModal={handleOpenTaskModal}
            onOpenNewTaskModal={handleOpenNewTaskModal}
            users={CURRENT_USERS}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'list' && (
          <ListView
            tasks={boardTasks}
            onUpdateTask={handleUpdateTask}
            onOpenTaskModal={handleOpenTaskModal}
            users={CURRENT_USERS}
            currentUser={currentUser}
          />
        )}

        {currentTab === 'analytics' && currentBoard && (
          <ProgressDashboard
            tasks={boardTasks}
            users={CURRENT_USERS}
            currentWorkspace={currentWorkspace}
            currentBoard={currentBoard}
          />
        )}

        {currentTab === 'team' && (
          <TeamManagement
            currentWorkspace={currentWorkspace}
            onUpdateWorkspace={handleUpdateWorkspace}
            users={CURRENT_USERS}
            currentUser={currentUser}
            onSelectBoard={handleSelectBoard}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SyncPulse — Collaborative Task & Agile Project Tracker for Student & Dev Teams
          </span>
          <button
            onClick={() => setIsPresentationGuideOpen(true)}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Open Presentation Slide Script & Demo Guide →
          </button>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        users={CURRENT_USERS}
        currentUser={currentUser}
      />

      {currentBoard && (
        <NewTaskModal
          isOpen={isNewTaskModalOpen}
          onClose={() => setIsNewTaskModalOpen(false)}
          onAddTask={handleAddTask}
          users={CURRENT_USERS}
          defaultStatus={newTaskDefaultStatus}
          workspaceId={currentWorkspace.id}
          boardId={currentBoard.id}
        />
      )}

      <NewWorkspaceModal
        isOpen={isNewWorkspaceModalOpen}
        onClose={() => setIsNewWorkspaceModalOpen(false)}
        onCreateWorkspace={handleCreateWorkspace}
        currentUser={currentUser}
      />

      <PresentationGuideModal
        isOpen={isPresentationGuideOpen}
        onClose={() => setIsPresentationGuideOpen(false)}
        onNavigateTab={tab => setCurrentTab(tab)}
      />
    </div>
  );
};

export default App;
