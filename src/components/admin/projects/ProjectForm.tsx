import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Project } from '../../../types/index';
import useProjectStore from '../../../stores/projectStore';
import { generateProjectId } from '../../../utils/projectUtils';
import { createAuditLog } from '../../../utils/auditUtils';
import { notify } from '../../../utils/notificationUtils';

const projectSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  role: z.string().min(1),
  completionDate: z.string().min(1),
  category: z.string().min(1),
  image_url: z.string().min(1),
  github_url: z.string().optional(),
  live_url: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  technologies: z.array(z.string()),
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
      technologies: [],
    },
  });

  const createProject = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const projectId = generateProjectId();
      const { error } = await supabase
        .from('Projects')
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
        stakeholders: [],
      });

      return projectId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['Projects']);
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
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Project Title
          </label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            {...register('role')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        {/* Completion Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Completion Date
          </label>
          <input
            type="date"
            {...register('completionDate')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.completionDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.completionDate.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            {...register('category')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            {...register('image_url')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.image_url && (
            <p className="mt-1 text-sm text-red-600">{errors.image_url.message}</p>
          )}
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            GitHub URL
          </label>
          <input
            type="text"
            {...register('github_url')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Live URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Live URL
          </label>
          <input
            type="text"
            {...register('live_url')}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Challenges */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Challenges
          </label>
          <textarea
            {...register('challenges')}
            rows={4}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Solutions */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Solutions
          </label>
          <textarea
            {...register('solutions')}
            rows={4}
            className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Technologies */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Technologies
          </label>
          <Controller
            name="technologies"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={field.value.join(', ')} // Display technologies as a comma-separated list
                onChange={(e) =>
                  field.onChange(e.target.value.split(',').map((t) => t.trim()))
                }
                className="mt-1 px-2 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
