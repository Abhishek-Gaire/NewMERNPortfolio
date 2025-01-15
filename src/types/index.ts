export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  imageUrl?: string;
}

export interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}