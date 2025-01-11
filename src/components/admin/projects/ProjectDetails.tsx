import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import ProjectHeader from './ProjectHeader';
import ProjectTasks from './ProjectTasks';
import ProjectMembers from './ProjectMembers';
import ProjectComments from './ProjectComments';
import LoadingSpinner from '../../shared/LoadingSpinner';
import ErrorBoundary from '../../shared/ErrorBoundary';

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_projects')
        .select(`
          *,
          project_members (
            user_id,
            role,
            profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading project details</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        <ProjectHeader project={project} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProjectTasks projectId={projectId} />
            <ProjectComments projectId={projectId} />
          </div>
          <div>
            <ProjectMembers projectId={projectId} members={project.project_members} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}