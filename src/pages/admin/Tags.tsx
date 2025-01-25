import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2 } from 'lucide-react';

const TagComponent = () => {
  const [tagName, setTagName] = useState('');
  const [tags, setTags] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tags from the `tags` table
  const fetchTags = async () => {
    try {
      const { data, error } = await supabase.from('tags').select('id, name');
      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to fetch tags');
    }
  };

  // Fetch tags when the component mounts
  useEffect(() => {
    fetchTags();
  }, []);

  // Handle adding a new tag
  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tagName.trim()) {
      setError('Tag name cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Check if the tag already exists
      const { data: existingTags, error: fetchError } = await supabase
        .from('tags')
        .select('name')
        .eq('name', tagName);

      if (fetchError) throw fetchError;

      if (existingTags && existingTags.length > 0) {
        setError('Tag already exists');
        return;
      }

      // Insert the new tag
      const { data, error: insertError } = await supabase
        .from('tags')
        .insert([{ name: tagName }])
        .select();

      if (insertError) throw insertError;

      // Update the tags list
      setTags((prevTags) => [...prevTags, ...(data || [])]);
      setTagName(''); // Clear the input field
    } catch (err:any) {
      console.error('Error adding tag:', err);
      setError(err.message || 'Failed to add tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a tag
  const handleDeleteTag = async (id: string) => {
    try {
      const { error } = await supabase.from('tags').delete().eq('id', id);
      if (error) throw error;

      // Update the tags list
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
    } catch (err) {
      console.error('Error deleting tag:', err);
      setError('Failed to delete tag');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tags</h2>

      {/* Add Tag Form */}
      <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Enter tag name"
          disabled={isSubmitting}
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Tag'}
        </button>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* List of Tags */}
      <ul>
        {tags.map((tag) => (
          <li
            key={tag.id}
            className="flex items-center justify-between p-2 border-b border-gray-200 last:border-b-0"
          >
            <span className="text-gray-700">{tag.name}</span>
            <button
              onClick={() => handleDeleteTag(tag.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2/>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagComponent;