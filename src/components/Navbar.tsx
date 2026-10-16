import React from 'react';
import { Workspace, User, Role } from '../types';
import { 
  Layers, LayoutDashboard, List, BarChart3, Users, 
  Presentation, RotateCcw, Sun, Moon, Plus, ChevronDown, 
  ShieldCheck, ShieldAlert, Sparkles, FolderKanban
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'board' | 'list' | 'analytics' | 'team';
  onSelectTab: (tab: 'board' | 'list' | 'analytics' | 'team') => void;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onSelectWorkspace: (wsId: string) => void;
  onOpenNewWorkspaceModal: () => void;
  onSelectBoard: (boardId: string) => void;
  users: User[];
  currentUser: User;
  onSelectUser: (userId: string) => void;
  onOpenPresentationGuide: () => void;
  onResetData: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  onOpenNewWorkspaceModal,
  onSelectBoard,
  users,
  currentUser,
  onSelectUser,
  onOpenPresentationGuide,
  onResetData,
  isDark,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Top Banner Bar: Workspace, Board, Role Simulation & Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Logo & Workspaces Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  SyncPulse
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  Agile Tracker
                </span>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* Workspace Selector */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <select
                  value={currentWorkspace.id}
                  onChange={e => onSelectWorkspace(e.target.value)}
                  className="text-xs sm:text-sm font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-slate-800 dark:text-slate-100 transition-colors"
                >
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>
                      {ws.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={onOpenNewWorkspaceModal}
                title="Create new workspace"
                className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Board Selector */}
            {currentWorkspace.boards.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-400 px-1 font-medium">Board:</span>
                <select
                  value={currentWorkspace.activeBoardId}
                  onChange={e => onSelectBoard(e.target.value)}
                  className="text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                >
                  {currentWorkspace.boards.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Right Controls: Role Simulator + Presentation Helpers */}
          <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end">
            {/* Live Role Switcher (Essential for presentation!) */}
            <div className="flex items-center gap-1.5 bg-indigo-50/70 dark:bg-indigo-950/40 p-1 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 pl-2 hidden lg:inline">
                Role Simulation:
              </span>
              <div className="relative flex items-center">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover ml-1 shrink-0 ring-1 ring-indigo-400"
                />
                <select
                  value={currentUser.id}
                  onChange={e => onSelectUser(e.target.value)}
                  className="text-xs font-bold bg-transparent border-none pl-1.5 pr-2 py-1 text-indigo-900 dark:text-indigo-200 focus:outline-none cursor-pointer"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id} className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Presentation Pitch Guide Button */}
            <button
              onClick={onOpenPresentationGuide}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              title="Open presentation pitch guide & demo checklist"
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Pitch Script</span>
            </button>

            {/* Reset Demo Data Button */}
            <button
              onClick={onResetData}
              title="Reset data back to initial hackathon state for rehearsing"
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 rounded-xl transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <div className="flex items-center gap-1 pt-1 pb-3 overflow-x-auto no-scrollbar border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => onSelectTab('board')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              currentTab === 'board'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Kanban Board
          </button>

          <button
            onClick={() => onSelectTab('list')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              currentTab === 'list'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            List & Table View
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              currentTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Progress Overview & Workload
          </button>

          <button
            onClick={() => onSelectTab('team')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
              currentTab === 'team'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Workspace & Team Roles
          </button>
        </div>
      </div>
    </header>
  );
};
