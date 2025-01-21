import { create } from 'zustand';
import { Project } from '../types';

interface ProjectStore {
  isEditing: boolean;
  selectedProject: Project | null;
  setEditing: (isEditing: boolean) => void;
  setSelectedProject: (project: Project | null) => void;
}

 const useProjectStore = create<ProjectStore>((set) => ({
  isEditing: false,
  selectedProject: null,
  setEditing: (isEditing) => set({ isEditing }),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));

export default useProjectStore;