import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import type { Post } from '../../types';

interface RelatedPostsProps {
  currentPostId: string;
  tags: string[];
}

export default function RelatedPosts({ currentPostId, tags }: RelatedPostsProps) {
  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', currentPostId, tags],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          slug,
          featuredImage,
          created_at,
          tags!inner(id)
        `)
        .neq('id', currentPostId)
        .eq('published', true)
        .in('tags.id', tags)
        .limit(3);

      return data as Post[];
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
            to={`/blog/${post.slug}`}
            className="group"
          >
            {post.featuredImage && (
              <img
                src={post.featuredImage}
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