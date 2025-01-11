import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/dateUtils';

interface ProjectCommentsProps {
  projectId: string;
}

export default function ProjectComments({ projectId }: ProjectCommentsProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: comments, isLoading } = useQuery({
    queryKey: ['project-comments', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_comments')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url)
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('project_comments')
        .insert([{
          project_id: projectId,
          author_id: user?.id,
          content,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project-comments', projectId]);
      setComment('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment.mutate(comment);
  };

  if (isLoading) return <div>Loading comments...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={addComment.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img
              src={comment.author.avatar_url || 'https://via.placeholder.com/32'}
              alt={comment.author.full_name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{comment.author.full_name}</span>
                  <span className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}