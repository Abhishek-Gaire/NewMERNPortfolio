import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProjectList from '../../components/admin/projects/ProjectList';
import ProjectForm from '../../components/admin/projects/ProjectForm';
import { AdminProject } from '../../types/project';
import useProjectStore from '../../stores/projectStore';

export default function AdminProjects() {
  const { isEditing, setEditing } = useProjectStore();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AdminProject[];
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <ProjectForm />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Projects</h1>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
          </div>
          <ProjectList projects={projects || []} />
        </>
      )}
    </div>
  );
}