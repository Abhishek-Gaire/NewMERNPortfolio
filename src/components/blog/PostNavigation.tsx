import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

interface PostNavigationProps {
  postId: string;
}

export default function PostNavigation({ postId }: PostNavigationProps) {
  const { data: navigation } = useQuery({
    queryKey: ['post-navigation', postId],
    queryFn: async () => {
      const [prevPost, nextPost] = await Promise.all([
        supabase
          .from('Blogs')
          .select('id, title')
          .lt('created_at', postId)
          .eq('publish', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('Blogs')
          .select('id, title')
          .gt('created_at', postId)
          .eq('publish', true)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle(),
      ]);
      
      return {
        prev: prevPost.data,
        next: nextPost.data,
      };
    },
  });

  if (!navigation?.prev && !navigation?.next) return null;

  return (
    <nav className="flex justify-between items-center my-8 border-gray-200 pt-8">
      {navigation?.prev ? (
        <Link
          to={`/blog/${navigation.prev.id}`}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          <div>
            <div className="text-sm text-gray-500">Previous</div>
            <div className="font-medium">{navigation.prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {navigation?.next ? (
        <Link
          to={`/blog/${navigation.next.id}`}
          className="flex items-center text-right text-gray-600 hover:text-gray-900"
        >
          <div>
            <div className="text-sm text-gray-500">Next</div>
            <div className="font-medium">{navigation.next.title}</div>
          </div>
          <ChevronRight className="w-5 h-5 ml-2" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}