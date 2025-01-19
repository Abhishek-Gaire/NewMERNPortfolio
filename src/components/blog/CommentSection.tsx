import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../utils/dateUtils';
import { MessageSquare, ThumbsUp, Flag } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  likes_count: number;
  user_has_liked: boolean;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          likes_count:comment_likes(count),
          user_has_liked:comment_likes!inner(user_id)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Comment[];
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, content, author_id: user?.id }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
      setComment('');
    },
  });

  const toggleLike = useMutation({
    mutationFn: async (commentId: string) => {
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select()
        .eq('comment_id', commentId)
        .eq('user_id', user?.id)
        .single();

      if (existingLike) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user?.id);
      } else {
        await supabase
          .from('comment_likes')
          .insert([{ comment_id: commentId, user_id: user?.id }]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment.mutate(comment);
  };

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageSquare className="w-6 h-6 mr-2" />
        Comments ({comments?.length || 0})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
          <button
            type="submit"
            disabled={addComment.isLoading}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {addComment.isLoading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-gray-600">
          Please <a href="/login" className="text-indigo-600 hover:underline">sign in</a> to leave a comment.
        </p>
      )}

      {isLoading ? (
        <div>Loading comments...</div>
      ) : (
        <div className="space-y-6">
          {comments?.map((comment) => (
            <div key={comment.id} className="flex space-x-4">
              <img
                src={comment.author.avatar_url || 'https://via.placeholder.com/40'}
                alt={comment.author.full_name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{comment.author.full_name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(comment.created_at)}
                      </p>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Report comment"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-800">{comment.content}</p>
                </div>
                <div className="mt-2 flex items-center space-x-4">
                  <button
                    onClick={() => toggleLike.mutate(comment.id)}
                    disabled={!user}
                    className={`flex items-center space-x-1 text-sm ${
                      comment.user_has_liked
                        ? 'text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{comment.likes_count}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}