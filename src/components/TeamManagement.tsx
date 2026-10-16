import React, { useState } from 'react';
import { Workspace, Board, User, Role, WorkspaceMember } from '../types';
import { 
  Users, UserPlus, Shield, ShieldCheck, Eye, Plus, 
  Trash2, Mail, Check, AlertCircle, Layers, Calendar, ArrowRight
} from 'lucide-react';

interface TeamManagementProps {
  currentWorkspace: Workspace;
  onUpdateWorkspace: (updatedWorkspace: Workspace) => void;
  users: User[];
  currentUser: User;
  onSelectBoard: (boardId: string) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  currentWorkspace,
  onUpdateWorkspace,
  users,
  currentUser,
  onSelectBoard
}) => {
  const isAdmin = currentUser.role === 'Admin';

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('Member');
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState('');

  const [isNewBoardOpen, setIsNewBoardOpen] = useState(false);
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [targetDeadline, setTargetDeadline] = useState('');

  // Handle invite
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    const newMember: WorkspaceMember = {
      userId: `u-invited-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      role: inviteRole,
      joinedAt: new Date().toISOString().split('T')[0]
    };

    onUpdateWorkspace({
      ...currentWorkspace,
      members: [...currentWorkspace.members, newMember]
    });

    setInviteSuccessMsg(`Invitation sent to ${inviteEmail} as ${inviteRole}!`);
    setTimeout(() => setInviteSuccessMsg(''), 4000);

    setInviteEmail('');
    setInviteName('');
    setInviteRole('Member');
    setIsInviteOpen(false);
  };

  // Change member role
  const handleRoleChange = (userId: string, newRole: Role) => {
    if (!isAdmin) return;
    const updatedMembers = currentWorkspace.members.map(m => {
      if (m.userId === userId) {
        return { ...m, role: newRole };
      }
      return m;
    });

    onUpdateWorkspace({
      ...currentWorkspace,
      members: updatedMembers
    });
  };

  // Create new board
  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardName.trim() || !sprintGoal.trim()) return;

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      workspaceId: currentWorkspace.id,
      name: boardName.trim(),
      description: boardDescription.trim() || 'Sprint deliverables & trackable cards',
      sprintGoal: sprintGoal.trim(),
      startDate: new Date().toISOString().split('T')[0],
      targetDeadline: targetDeadline || '2026-10-25'
    };

    onUpdateWorkspace({
      ...currentWorkspace,
      boards: [...currentWorkspace.boards, newBoard],
      activeBoardId: newBoard.id
    });

    onSelectBoard(newBoard.id);
    setIsNewBoardOpen(false);
    setBoardName('');
    setBoardDescription('');
    setSprintGoal('');
    setTargetDeadline('');
  };

  return (
    <div className="space-y-8">
      {/* Workspace Header Summary */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              {currentWorkspace.category}
            </span>
            <span className="text-xs text-slate-400">ID: {currentWorkspace.id}</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {currentWorkspace.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentWorkspace.tagline}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-md transition-colors shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            Invite Teammate
          </button>
        ) : (
          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
            Switch role to <strong>Admin</strong> in top bar to invite teammates or edit roles.
          </div>
        )}
      </div>

      {inviteSuccessMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <Check className="w-5 h-5" />
          {inviteSuccessMsg}
        </div>
      )}

      {/* Grid: Members & Role Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members List (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Workspace Teammates & Roles ({currentWorkspace.members.length})
            </h3>
            <span className="text-xs text-slate-500">
              Role permissions strictly enforced
            </span>
          </div>

          <div className="space-y-3">
            {currentWorkspace.members.map(member => (
              <div
                key={member.userId}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {member.name}
                      </span>
                      {member.userId === currentUser.id && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3" /> {member.email}
                    </span>
                  </div>
                </div>

                {/* Role Changer */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Role:</span>
                  <select
                    value={member.role}
                    disabled={!isAdmin}
                    onChange={e => handleRoleChange(member.userId, e.target.value as Role)}
                    className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-60 cursor-pointer"
                  >
                    <option value="Admin">👑 Admin (Full Control)</option>
                    <option value="Member">💻 Member (Edit & Move)</option>
                    <option value="Viewer">👁️ Viewer (Read Only)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permissions Explainer Matrix (1 col) */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Role Permissions Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Designed for clear student team governance without complex enterprise setup:
          </p>

          <div className="space-y-3 text-xs">
            {/* Admin */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/60 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-purple-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                Admin (Lead / Scrum Master)
              </div>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>Create & delete project workspaces</li>
                <li>Invite members and assign roles</li>
                <li>Add, edit, move, and delete any task</li>
                <li>Manage sprint boards and deadlines</li>
              </ul>
            </div>

            {/* Member */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/60 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400 mb-1">
                <Users className="w-4 h-4" />
                Member (Developers / Designers)
              </div>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>Create and edit tasks</li>
                <li>Drag & drop cards across Kanban stages</li>
                <li>Check off subtasks & post comments</li>
                <li>Cannot delete workspace or alter roles</li>
              </ul>
            </div>

            {/* Viewer */}
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/60 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 mb-1">
                <Eye className="w-4 h-4" />
                Viewer (Mentors / Judges / Faculty)
              </div>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1 pl-1">
                <li>Inspect all boards, subtasks & analytics</li>
                <li>Read comments & progress charts</li>
                <li>Mutating actions disabled to protect data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Multiple Boards Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Manage Multiple Sprint Boards ({currentWorkspace.boards.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Break large team projects into focused sprint cycles or specialized milestone boards
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setIsNewBoardOpen(true)}
              className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New Board
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentWorkspace.boards.map(board => {
            const isActive = currentWorkspace.activeBoardId === board.id;

            return (
              <div
                key={board.id}
                className={`p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-sm ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {board.name}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                          Active Board
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{board.description}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-700 mb-3 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Sprint Goal: </span>
                  <span className="text-slate-600 dark:text-slate-400">{board.sprintGoal}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5" /> Target: {board.targetDeadline}
                  </span>

                  {!isActive && (
                    <button
                      onClick={() => onSelectBoard(board.id)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Switch to this Board <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Invite Teammate to Workspace
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add fellow students, hackathon teammates, or professors as viewers.
            </p>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Lee"
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="jordan.lee@campus.edu"
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Permission Role *
                </label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as Role)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-semibold"
                >
                  <option value="Member">Member (Can create, edit & move cards)</option>
                  <option value="Admin">Admin (Full project control)</option>
                  <option value="Viewer">Viewer (Read-only for judges/mentors)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Board Modal */}
      {isNewBoardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Create New Board in Workspace
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a new sprint or specialized tracking board.
            </p>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Board Name *
                </label>
                <input
                  type="text"
                  required
                  value={boardName}
                  onChange={e => setBoardName(e.target.value)}
                  placeholder="e.g. Sprint 2: Pitch Deck & Video Polish"
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sprint Goal *
                </label>
                <input
                  type="text"
                  required
                  value={sprintGoal}
                  onChange={e => setSprintGoal(e.target.value)}
                  placeholder="e.g. Finalize slide deck and rehearse 3-min pitch"
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={targetDeadline}
                  onChange={e => setTargetDeadline(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewBoardOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
