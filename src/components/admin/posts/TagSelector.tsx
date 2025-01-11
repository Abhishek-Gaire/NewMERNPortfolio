import React, { useEffect, useState } from 'react';
import { Tag } from '../../../types';
import { supabase } from '../../../lib/supabase';
import { X } from 'lucide-react';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        setTags(data || []);
      }
      setLoading(false);
    }

    fetchTags();
  }, []);

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  if (loading) {
    return <div>Loading tags...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <button
          key={tag.id}
          type="button"
          onClick={() => handleTagClick(tag.id)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            selectedTags.includes(tag.id)
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {tag.name}
          {selectedTags.includes(tag.id) && (
            <X className="ml-1 h-4 w-4" />
          )}
        </button>
      ))}
    </div>
  );
}