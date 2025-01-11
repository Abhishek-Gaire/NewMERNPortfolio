import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface ProjectTasksProps {
  projectId: string;
}

export default function ProjectTasks({ projectId }: ProjectTasksProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState('');

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_tasks')
        .select(`
          *,
          assignee:profiles(id, full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addTask = useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase
        .from('project_tasks')
        .insert([{
          project_id: projectId,
          title,
          status: 'todo',
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project-tasks', projectId]);
      setNewTask('');
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      const { error } = await supabase
        .from('project_tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project-tasks', projectId]);
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'blocked':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask.mutate(newTask);
  };

  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={addTask.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const newStatus = task.status === 'completed' ? 'todo' : 'completed';
                  updateTaskStatus.mutate({ taskId: task.id, status: newStatus });
                }}
              >
                {getStatusIcon(task.status)}
              </button>
              <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
            </div>
            {task.assignee && (
              <img
                src={task.assignee.avatar_url || 'https://via.placeholder.com/32'}
                alt={task.assignee.full_name}
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}