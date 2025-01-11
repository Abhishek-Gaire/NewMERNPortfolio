import React, { useEffect, useState } from 'react';
import { Post } from '../../types';
import { supabase } from '../../lib/supabase';
import PostEditor from '../../components/admin/posts/PostEditor';
import PostList from '../../components/admin/posts/PostList';
import { Plus } from 'lucide-react';

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | undefined>();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:profiles(*),
        tags(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }

  const handleSave = async (data: any) => {
    try {
      if (selectedPost) {
        await supabase
          .from('posts')
          .update(data)
          .eq('id', selectedPost.id);
      } else {
        await supabase
          .from('posts')
          .insert([data]);
      }
      await fetchPosts();
      setIsEditing(false);
      setSelectedPost(undefined);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {selectedPost ? 'Edit Post' : 'New Post'}
            </h1>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedPost(undefined);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
          <PostEditor
            post={selectedPost}
            onSave={handleSave}
          />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Posts</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Post
            </button>
          </div>
          <PostList
            posts={posts}
            onEdit={(post) => {
              setSelectedPost(post);
              setIsEditing(true);
            }}
            onDelete={async (id) => {
              await supabase.from('posts').delete().eq('id', id);
              await fetchPosts();
            }}
          />
        </div>
      )}
    </div>
  );
}