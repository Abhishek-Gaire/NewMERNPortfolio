import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogContent from '../components/blog/BlogContent';
import ShareButtons from '../components/blog/ShareButtons';
// import CommentSection from '../components/blog/CommentSection';
import RelatedPosts from '../components/blog/RelatedPosts';
import PostNavigation from '../components/blog/PostNavigation';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { estimateReadingTime } from '../utils/textUtils';
import { formatDate } from '../utils/dateUtils';
import type { BlogPost } from '../types/index';
import BlogTagContent from '../components/blog/BlogTagContent';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Blogs')
        .select(`*`)
        .eq('id', slug)
        .single();

      if (error) throw error;
      return data as BlogPost;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Post not found</div>;
  if (!post) return <div>No post found</div>;

  const readingTime = estimateReadingTime(post.content);

  return (
      <ErrorBoundary>
        <Header/>
        <article className="max-w-4xl mx-auto px-4 py-12">
          <Helmet>
            <title>{post.title}</title>
            <meta property="og:title" content={post.title} />
            {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
          </Helmet>

          {/* Header */}
          <header className="mb-8">
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-[400px] object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-gray-600 mb-4">
              <div className="flex items-center">
                {/* {post.author?.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-2" />
                )} */}
                <span>Abhishek Gaire</span>
              </div>
              <span>•</span>
              <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <BlogTagContent post={post}/>
            </div>
          </header>

          {/* Content */}
          <BlogContent content={post.content} />

          {/* Share Buttons */}
          <ShareButtons
            url={window.location.href}
            title={post.title}
            description={''}
          />

          {/* Navigation */}
          <PostNavigation postId={post.created_at} />

          {/* Comments */}
          {/* <CommentSection postId={post.id} /> */}

          {/* Related Posts */}
          <RelatedPosts
            currentPostId={post.id}
            tags={post.tags?.map(tag => tag.id) || []}
          />
        </article>
      <Footer/>
    </ErrorBoundary>    
  );
}