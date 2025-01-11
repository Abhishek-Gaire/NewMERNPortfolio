import { create } from 'zustand';
import { AdminProject } from '../types/project';

interface ProjectStore {
  isEditing: boolean;
  selectedProject: AdminProject | null;
  setEditing: (isEditing: boolean) => void;
  setSelectedProject: (project: AdminProject | null) => void;
}

 const useProjectStore = create<ProjectStore>((set) => ({
  isEditing: false,
  selectedProject: null,
  setEditing: (isEditing) => set({ isEditing }),
  setSelectedProject: (project) => set({ selectedProject: project }),
}));

export default useProjectStore;