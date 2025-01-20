import React from 'react';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Tag } from 'lucide-react';
import BlogTagContent from './blog/BlogTagContent';
import BlogContent from './blog/BlogContent';

const Blog = () => {
  const { data: blogs, isLoading, isError } = useQuery({
    queryKey: ['blog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Blogs')
        .select(`*`)
        .eq('publish', true)
        .limit(3);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong. Please try again later.</p>;
  }

  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Latest Blog Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs?.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={16} className="mr-2" />
                  {/* {post.created_at} */}
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  <a href={`/blog/${post.id}`} className="hover:text-blue-600">
                    {post.title}
                  </a>
                </h2>
                <BlogContent content={post.content.substring(0,150)}/>
                <BlogTagContent post={post}/>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
