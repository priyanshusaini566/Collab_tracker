export type Role = 'Admin' | 'Member' | 'Viewer';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskStatus = 'Backlog' | 'In Progress' | 'Review' | 'Done';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
  badgeColor: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: Role;
  content: string;
  createdAt: string;
}

export interface TaskActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
}

export interface Task {
  id: string;
  workspaceId: string;
  boardId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar: string;
  dueDate: string;
  tags: string[];
  checklist: ChecklistItem[];
  comments: TaskComment[];
  activities: TaskActivity[];
  estimatedHours: number;
  createdAt: string;
}

export interface WorkspaceMember {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  joinedAt: string;
}

export interface Board {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  sprintGoal: string;
  startDate: string;
  targetDeadline: string;
}

export interface Workspace {
  id: string;
  name: string;
  tagline: string;
  category: 'Hackathon' | 'Course Project' | 'Startup MVP' | 'Open Source';
  members: WorkspaceMember[];
  activeBoardId: string;
  boards: Board[];
}
