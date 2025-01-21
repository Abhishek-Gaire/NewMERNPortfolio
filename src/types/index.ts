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
  completionDate: string;
  image_url: string;
  technologies: string[];
  role: string;
  challenges: string;
  solutions: string;
  live_url?: string;
  github_url?: string;
  category: string;
}
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  tags: Tag[];
  imageUrl: string;
  publish:boolean;
}

export interface Skill {
  name: string;
  icon: string;
  category: 'frontend' | 'backend' | 'database' | 'tools';
}

export interface Tag{
  id:string;
  name:string;
}