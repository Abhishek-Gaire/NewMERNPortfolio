import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

interface ProjectMembersProps {
  projectId: string;
  members: any[];
}

export default function ProjectMembers({ projectId, members }: ProjectMembersProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: availableUsers } = useQuery({
    queryKey: ['available-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .not('id', 'in', `(${members.map(m => m.user_id).join(',')})`);

      if (error) throw error;
      return data;
    },
  });

  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('project_members')
        .insert([{
          project_id: projectId,
          user_id: userId,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
    },
  });

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Team Members</h2>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.user_id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={member.profiles.avatar_url || 'https://via.placeholder.com/32'}
                alt={member.profiles.full_name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="font-medium">{member.profiles.full_name}</p>
                <p className="text-sm text-gray-500 capitalize">{member.role}</p>
              </div>
            </div>
            <button
              onClick={() => removeMember.mutate(member.user_id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {availableUsers && availableUsers.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Add Member</h3>
          <select
            onChange={(e) => addMember.mutate(e.target.value)}
            className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            defaultValue=""
          >
            <option value="" disabled>Select a user</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}