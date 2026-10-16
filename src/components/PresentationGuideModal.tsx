import React, { useState } from 'react';
import { 
  X, Presentation, CheckCircle, Lightbulb, Users, 
  HelpCircle, Sparkles, ArrowRight, ShieldCheck, BarChart3, CheckSquare
} from 'lucide-react';

interface PresentationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'board' | 'list' | 'analytics' | 'team') => void;
}

export const PresentationGuideModal: React.FC<PresentationGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  if (!isOpen) return null;

  const [activeSlide, setActiveSlide] = useState<'problem' | 'solution' | 'demo' | 'qa'>('problem');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Presentation className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
                Tomorrow's Presentation Companion
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Collaborative Task & Agile Project Tracker Pitch
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveSlide('problem')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSlide === 'problem'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Problem Statement
          </button>
          <button
            onClick={() => setActiveSlide('solution')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSlide === 'solution'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Core Value Proposition
          </button>
          <button
            onClick={() => setActiveSlide('demo')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSlide === 'demo'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Live Demo Script (5 Steps)
          </button>
          <button
            onClick={() => setActiveSlide('qa')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeSlide === 'qa'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Evaluator Q&A
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeSlide === 'problem' && (
            <div className="space-y-4 animate-fade-in text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 text-base mb-1">
                  The Problem Facing Student & Hackathon Teams:
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed">
                  "When student teams work on projects or hackathons, keeping track of who is doing what often gets messy. Heavy enterprise software like Jira takes too long to configure and requires excessive overhead, while informal chat apps leave teammates confused about responsibilities and approaching deadlines."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Why the Problem Matters
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    A clean task organizer keeps team members aligned, prevents duplicated effort, and immediately signals if someone is bottlenecked or needs assistance.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Target Users
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Student project teams, hackathon participants, software development groups, and team leads who need rapid zero-friction coordination.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSlide === 'solution' && (
            <div className="space-y-4 animate-fade-in text-sm text-slate-700 dark:text-slate-300">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-base mb-1">
                  The SyncPulse Solution:
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed">
                  A high-velocity, responsive collaborative workspace designed specifically for agile student workflows. Combines drag-and-drop Kanban flow, clear role-based access control, subtask execution meters, real-time discussions, and automated workload distribution analytics.
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'Workspace & Team Roles', desc: 'Create spaces, invite members, enforce Admin / Member / Viewer permissions, and run multiple sprint boards.' },
                  { title: 'Interactive Task Board', desc: 'Fluid drag-and-drop Kanban columns (Backlog, In Progress, Review, Done) with quick move fallbacks.' },
                  { title: 'Granular Task Details', desc: 'Priorities (Urgent to Low), due dates, assignees, tags, and subtasks with live percentage progress.' },
                  { title: 'Discussion Thread & Audit', desc: 'In-card comment stream and automatic timeline logging every status change and checklist completion.' },
                  { title: 'Workload & Health Analytics', desc: 'Completed work %, sprint countdown timer, and member workload meters that flag team bottlenecks.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-bold">{item.title}: </strong>
                      <span className="text-slate-600 dark:text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSlide === 'demo' && (
            <div className="space-y-3 animate-fade-in text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-medium">
                💡 Follow these 5 steps in order during your live demo to cover 100% of the rubric:
              </div>

              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Step 1: Kanban Board & Drag-Drop</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Drag a card from In Progress to Done to show confetti and instant column count updates.</p>
                  </div>
                  <button
                    onClick={() => { onNavigateTab('board'); onClose(); }}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 shrink-0"
                  >
                    Go to Board <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Step 2: Task Modal & Subtasks</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Click any card to show priority, due date, subtask checklist with progress bar, and comment history.</p>
                  </div>
                  <button
                    onClick={() => { onNavigateTab('board'); onClose(); }}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 shrink-0"
                  >
                    View Tasks <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Step 3: RBAC & Role Switching</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Use top bar dropdown to switch role to "Viewer". Show that editing is blocked with a read-only warning!</p>
                  </div>
                  <button
                    onClick={() => { onNavigateTab('team'); onClose(); }}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 shrink-0"
                  >
                    Team & Roles <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Step 4: Workload & Health Analytics</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Show sprint completion rate, countdown timer, and Member Workload Distribution to detect bottlenecks.</p>
                  </div>
                  <button
                    onClick={() => { onNavigateTab('analytics'); onClose(); }}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 shrink-0"
                  >
                    Analytics <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Step 5 */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">Step 5: Workspaces & Multi-Boards</span>
                    <p className="text-slate-500 text-[11px] mt-0.5">Switch workspaces or boards in header, or click "+ Workspace" to demonstrate multi-project agility.</p>
                  </div>
                  <button
                    onClick={() => { onNavigateTab('team'); onClose(); }}
                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-lg font-bold hover:bg-indigo-100 flex items-center gap-1 shrink-0"
                  >
                    Manage Boards <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSlide === 'qa' && (
            <div className="space-y-3 animate-fade-in text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Q: Why choose this over Jira or Trello?
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">
                  <strong>A:</strong> Jira has immense configuration overhead and steep learning curves that student teams abandon. Trello lacks integrated workload balancing and sprint countdowns. SyncPulse strikes the sweet spot: zero-friction setup, built-in student roles, and instant workload transparency.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Q: How does this prevent repeated work or missed deadlines?
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">
                  <strong>A:</strong> Through clear card assignments, visual status columns, subtask completion percentages, and the Workload Health indicator which automatically highlights when a teammate has too many in-flight tasks.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  Q: How is data persisted during the presentation?
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-5 leading-relaxed">
                  <strong>A:</strong> Everything saves to browser localStorage in real time. We also included a "Reset Demo Data" button so we can reset and repeat the presentation flawlessly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Press any tab to rehearse • SyncPulse Agile Tracker Prototype
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Start Interactive Demo
          </button>
        </div>
      </div>
    </div>
  );
};
