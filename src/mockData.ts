import { User, Workspace, Task } from './types';

export const CURRENT_USERS: User[] = [
  {
    id: 'u-alex',
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Admin',
    title: 'Project Lead & Full Stack',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
  },
  {
    id: 'u-maya',
    name: 'Maya Chen',
    email: 'maya.chen@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    title: 'Frontend & UI/UX Design',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
  },
  {
    id: 'u-liam',
    name: 'Liam Thorne',
    email: 'liam.thorne@campus.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Member',
    title: 'Backend & ML Engineer',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
  },
  {
    id: 'u-sarah',
    name: 'Prof. Sarah Jenkins',
    email: 'sjenkins@faculty.edu',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Viewer',
    title: 'Faculty Mentor / Reviewer',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
  }
];

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-hackathon-2026',
    name: '🚀 NeuroCampus - AI Hackathon',
    tagline: '36-Hour Hackathon: Student AI Assistant with Real-time Schedule Sync',
    category: 'Hackathon',
    activeBoardId: 'board-sprint1',
    members: [
      { userId: 'u-alex', name: 'Alex Rivera', email: 'alex.rivera@campus.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Admin', joinedAt: '2026-10-15' },
      { userId: 'u-maya', name: 'Maya Chen', email: 'maya.chen@campus.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Member', joinedAt: '2026-10-15' },
      { userId: 'u-liam', name: 'Liam Thorne', email: 'liam.thorne@campus.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Member', joinedAt: '2026-10-15' },
      { userId: 'u-sarah', name: 'Prof. Sarah Jenkins', email: 'sjenkins@faculty.edu', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', role: 'Viewer', joinedAt: '2026-10-16' },
    ],
    boards: [
      {
        id: 'board-sprint1',
        workspaceId: 'ws-hackathon-2026',
        name: 'Sprint 1: Core MVP & Live Demo',
        description: 'Complete the conversational task manager core loop and visual progress tracker.',
        sprintGoal: 'Deliver interactive MVP for judging panel presentation with zero critical bugs.',
        startDate: '2026-10-16',
        targetDeadline: '2026-10-17 18:00'
      },
      {
        id: 'board-sprint2',
        workspaceId: 'ws-hackathon-2026',
        name: 'Pitch Deck & Video Polish',
        description: 'Finalize slides, rehearse 3-minute pitch, and capture high-res walkthrough clips.',
        sprintGoal: 'Create compelling presentation narrative highlighting problem & market gap.',
        startDate: '2026-10-17',
        targetDeadline: '2026-10-18 12:00'
      }
    ]
  },
  {
    id: 'ws-capstone',
    name: '🎓 CS490 Senior Capstone - Smart Logistics',
    tagline: 'Automated fleet dispatch and fuel routing system for regional deliveries',
    category: 'Course Project',
    activeBoardId: 'board-capstone-main',
    members: [
      { userId: 'u-alex', name: 'Alex Rivera', email: 'alex.rivera@campus.edu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Admin', joinedAt: '2026-09-01' },
      { userId: 'u-liam', name: 'Liam Thorne', email: 'liam.thorne@campus.edu', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Member', joinedAt: '2026-09-01' },
    ],
    boards: [
      {
        id: 'board-capstone-main',
        workspaceId: 'ws-capstone',
        name: 'Phase 2: Route Optimization Algorithm',
        description: 'Implement Dijkstra and A* graph algorithms for truck fleet routes.',
        sprintGoal: 'Reduce average transit simulation latency under 250ms.',
        startDate: '2026-10-01',
        targetDeadline: '2026-11-15'
      }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-101',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Setup Workspace & Role-Based Access (Admin/Member/Viewer)',
    description: 'Build role hierarchy and guard mutating actions based on user permissions to ensure strict team integrity.',
    status: 'Done',
    priority: 'High',
    assigneeId: 'u-alex',
    assigneeName: 'Alex Rivera',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-16',
    tags: ['Architecture', 'Security', 'Auth'],
    estimatedHours: 6,
    checklist: [
      { id: 'c1', title: 'Define Role types (Admin, Member, Viewer)', completed: true },
      { id: 'c2', title: 'Disable task drag-and-drop for Viewers', completed: true },
      { id: 'c3', title: 'Add permission banner and role simulation dropdown', completed: true }
    ],
    comments: [
      {
        id: 'cm-1',
        userId: 'u-alex',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        userRole: 'Admin',
        content: 'RBAC system is complete! Viewers now get a friendly read-only badge and cannot accidentally wipe columns.',
        createdAt: 'Yesterday, 8:45 PM'
      },
      {
        id: 'cm-2',
        userId: 'u-sarah',
        userName: 'Prof. Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        userRole: 'Viewer',
        content: 'Tested the viewer permission from my end. Clean implementation. Good defense against accidental edits during high-pressure student presentations.',
        createdAt: 'Yesterday, 9:20 PM'
      }
    ],
    activities: [
      { id: 'act-1', userId: 'u-alex', userName: 'Alex Rivera', action: 'moved card to Done', timestamp: 'Yesterday at 9:00 PM' }
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'task-102',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Interactive Kanban Board with Drag & Drop Columns',
    description: 'Implement four agile stages: Backlog, In Progress, Review, and Done. Add quick status movers and smooth drag feedback.',
    status: 'In Progress',
    priority: 'Urgent',
    assigneeId: 'u-maya',
    assigneeName: 'Maya Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-17',
    tags: ['Frontend', 'Kanban', 'UI/UX'],
    estimatedHours: 8,
    checklist: [
      { id: 'c4', title: 'Build column containers with stage counters', completed: true },
      { id: 'c5', title: 'Add HTML5 drag and drop listeners', completed: true },
      { id: 'c6', title: 'One-click "Quick Move" fallback for touch screens', completed: true },
      { id: 'c7', title: 'Celebrate with confetti on moving cards to Done', completed: false }
    ],
    comments: [
      {
        id: 'cm-3',
        userId: 'u-maya',
        userName: 'Maya Chen',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        userRole: 'Member',
        content: 'Working on column drop visual states now. Looks super fluid in both dark and light modes!',
        createdAt: 'Today, 10:15 AM'
      }
    ],
    activities: [
      { id: 'act-2', userId: 'u-maya', userName: 'Maya Chen', action: 'moved card to In Progress', timestamp: 'Today at 9:30 AM' }
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'task-103',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Gemini AI API Task Assistant & Fast Auto-Tagging',
    description: 'Connect REST API endpoint to auto-categorize tasks, estimate effort, and propose quick subtask checklists.',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'u-liam',
    assigneeName: 'Liam Thorne',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-17',
    tags: ['Backend', 'AI/ML', 'API'],
    estimatedHours: 7,
    checklist: [
      { id: 'c8', title: 'API Key env configuration & fallback handling', completed: true },
      { id: 'c9', title: 'Subtask auto-breakdown generator', completed: false },
      { id: 'c10', title: 'Response latency benchmark (<350ms)', completed: false }
    ],
    comments: [
      {
        id: 'cm-4',
        userId: 'u-liam',
        userName: 'Liam Thorne',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        userRole: 'Member',
        content: 'Tested the model responses on sample software tasks. Auto-tagging accuracy is over 95%.',
        createdAt: 'Today, 11:30 AM'
      }
    ],
    activities: [
      { id: 'act-3', userId: 'u-liam', userName: 'Liam Thorne', action: 'checked checklist item #1', timestamp: 'Today at 10:00 AM' }
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'task-104',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Progress Overview & Workload Distribution Dashboard',
    description: 'Create visual charts showing completed work percentage, sprint burndown, and member workload to prevent team burnout.',
    status: 'Review',
    priority: 'Urgent',
    assigneeId: 'u-alex',
    assigneeName: 'Alex Rivera',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-17',
    tags: ['Analytics', 'Charts', 'Progress'],
    estimatedHours: 5,
    checklist: [
      { id: 'c11', title: 'Calculate overall % completion based on task status', completed: true },
      { id: 'c12', title: 'Build Member Workload meter with overload warnings', completed: true },
      { id: 'c13', title: 'Add Priority Distribution breakdown bar', completed: true },
      { id: 'c14', title: 'Live presentation countdown clock', completed: true }
    ],
    comments: [
      {
        id: 'cm-5',
        userId: 'u-alex',
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        userRole: 'Admin',
        content: 'Ready for peer review! Notice how Liam and Maya are nicely balanced at 4 tasks each.',
        createdAt: 'Today, 1:40 PM'
      }
    ],
    activities: [
      { id: 'act-4', userId: 'u-alex', userName: 'Alex Rivera', action: 'moved card from In Progress to Review', timestamp: 'Today at 1:40 PM' }
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'task-105',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Task Modal: Subtask Checklist & Rich Discussion Thread',
    description: 'Enable in-depth card details modal: dynamic checklist with instant progress bar, comment feed, and audit history.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'u-maya',
    assigneeName: 'Maya Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-16',
    tags: ['Modal', 'Comments', 'Checklist'],
    estimatedHours: 4,
    checklist: [
      { id: 'c15', title: 'Modal overlay with keyboard ESC close', completed: true },
      { id: 'c16', title: 'Checklist subtask toggle with live percentage', completed: true },
      { id: 'c17', title: 'Comment input with enter key submission', completed: true }
    ],
    comments: [],
    activities: [
      { id: 'act-5', userId: 'u-maya', userName: 'Maya Chen', action: 'completed all checklist items', timestamp: 'Yesterday at 11:15 PM' }
    ],
    createdAt: '2026-10-15'
  },
  {
    id: 'task-106',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Slide Deck & 3-Minute Live Demo Pitch Rehearsal',
    description: 'Prepare pitch slide deck covering problem statement, target audience, core agile differentiators, and roadmap.',
    status: 'Backlog',
    priority: 'High',
    assigneeId: 'u-sarah',
    assigneeName: 'Prof. Sarah Jenkins',
    assigneeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-17',
    tags: ['Pitch', 'Presentation', 'Slides'],
    estimatedHours: 3,
    checklist: [
      { id: 'c18', title: 'Slide 1: Problem statement in student hackathons', completed: true },
      { id: 'c19', title: 'Slide 2: Live interactive prototype walkthrough', completed: false },
      { id: 'c20', title: 'Slide 3: Agile metrics & workload transparency', completed: false }
    ],
    comments: [
      {
        id: 'cm-6',
        userId: 'u-sarah',
        userName: 'Prof. Sarah Jenkins',
        userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        userRole: 'Viewer',
        content: 'Be sure to emphasize how lightweight this is compared to Jira or ClickUp, which students abandon after day one.',
        createdAt: 'Today, 2:10 PM'
      }
    ],
    activities: [],
    createdAt: '2026-10-16'
  },
  {
    id: 'task-107',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Offline LocalStorage Cache & Instant Demo Reset',
    description: 'Ensure all changes persist locally without external database downtime, with a one-click reset for seamless rehearsals.',
    status: 'Done',
    priority: 'Medium',
    assigneeId: 'u-alex',
    assigneeName: 'Alex Rivera',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-16',
    tags: ['Storage', 'Reliability'],
    estimatedHours: 2,
    checklist: [
      { id: 'c21', title: 'Hook up state hydration from localStorage', completed: true },
      { id: 'c22', title: 'Add "Reset Demo Data" confirmation dialog', completed: true }
    ],
    comments: [],
    activities: [],
    createdAt: '2026-10-15'
  },
  {
    id: 'task-108',
    workspaceId: 'ws-hackathon-2026',
    boardId: 'board-sprint1',
    title: 'Multi-Filter & Real-Time Card Search System',
    description: 'Fast filtering by assignee avatar, priority badge, category tags, and fuzzy text search across titles & descriptions.',
    status: 'Backlog',
    priority: 'Low',
    assigneeId: 'u-liam',
    assigneeName: 'Liam Thorne',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    dueDate: '2026-10-18',
    tags: ['Search', 'Filters', 'Frontend'],
    estimatedHours: 3,
    checklist: [
      { id: 'c23', title: 'Assignee single-click filtering', completed: false },
      { id: 'c24', title: 'Priority multi-select pill filters', completed: false }
    ],
    comments: [],
    activities: [],
    createdAt: '2026-10-16'
  }
];
