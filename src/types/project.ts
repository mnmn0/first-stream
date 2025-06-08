export type ProjectStatus =
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type MemberRole = 'ADMIN' | 'PROJECT_MANAGER' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  imageUrl?: string | null;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator: User;
  members: ProjectMember[];
  tasks: Task[];
}

export interface ProjectMember {
  projectId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
  user: User;
  project: Project;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string | null;
  dueDate: Date | null;
  estimatedHours: number | null;
  actualHours: number | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  project: Project;
  assignee: User | null;
  creator: User;
  comments: Comment[];
  attachments: TaskAttachment[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  task: Task;
  user: User;
}

export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedBy: string;
  createdAt: Date;
  task: Task;
  user: User;
}
