import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { AdminProject, PriorityLevel } from '../../../types/project';
import  useProjectStore  from '../../../stores/projectStore';
import ImageUpload from '../shared/ImageUpload';
import { generateProjectId } from '../../../utils/projectUtils';
import { createAuditLog } from '../../../utils/auditUtils';
import { notify } from '../../../utils/notificationUtils';

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  startDate: z.string().min(1),
  expectedCompletionDate: z.string().min(1),
  priorityLevel: z.enum(['High', 'Medium', 'Low']),
  teamMembers: z.array(z.string()).optional(),
  clientInfo: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    company: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  departments: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const { setEditing, selectedProject } = useProjectStore();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: selectedProject || {
      priorityLevel: 'Medium',
      teamMembers: [],
      departments: [],
      documents: [],
    },
  });

  const createProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const projectId = generateProjectId();
      const { error } = await supabase
        .from('admin_projects')
        .insert([{ id: projectId, ...data }]);

      if (error) throw error;

      await createAuditLog({
        action: 'create_project',
        resourceId: projectId,
        details: data,
      });

      await notify({
        type: 'project_created',
        projectId,
        stakeholders: data.teamMembers || [],
      });

      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects']);
      setEditing(false);
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await createProject.mutateAsync(data);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {selectedProject ? 'Edit Project' : 'New Project'}
        </h2>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Priority Level
          </label>
          <select
            {...register('priorityLevel')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            {...register('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Completion Date
          </label>
          <input
            type="date"
            {...register('expectedCompletionDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Documents
          </label>
          <Controller
            name="documents"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                maxSize={5242880} // 5MB
                acceptedTypes={['.pdf', '.doc', '.docx', '.xls', '.xlsx']}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isSubmitting ? 'Saving...' : 'Save Project'}
        </button>
      </div>
    </form>
  );
}