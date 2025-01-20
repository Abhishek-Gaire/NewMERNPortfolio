import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types';

interface RelatedPostsProps {
  currentPostId: string;
  tags: string[];
}

export default function RelatedPosts({ currentPostId, tags }: RelatedPostsProps) {
  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', currentPostId, tags],
    queryFn: async () => {
      const { data } = await supabase
        .from('Blogs')
        .select(`
          id,
          title,
          imageUrl,
          created_at,
          tags
        `)
        .neq('id', currentPostId)
        .eq('publish', true)
        .limit(3);
      return data as BlogPost[];
    },
    
    enabled: tags.length > 0,
  });
  
  if (!relatedPosts?.length) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group"
          >
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}