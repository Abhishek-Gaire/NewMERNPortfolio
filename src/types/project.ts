export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export interface ClientInfo {
  name: string;
  email: string;
  company: string;
  phone?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface AdminProject {
  id: string;
  title: string;
  description: string;
  startDate: string;
  expectedCompletionDate: string;
  priorityLevel: PriorityLevel;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  teamMembers?: TeamMember[];
  milestones?: ProjectMilestone[];
  clientInfo?: ClientInfo;
  departments?: Department[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}