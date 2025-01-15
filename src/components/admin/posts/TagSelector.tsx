import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
}

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  // Predefined list of tags
  const predefinedTags: Tag[] = [
    { id: '1', name: 'React' },
    { id: '2', name: 'JavaScript' },
    { id: '3', name: 'TypeScript' },
    { id: '4', name: 'Node.js' },
    { id: '5', name: 'CSS' },
  ];

  const [tags] = useState<Tag[]>(predefinedTags);

  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

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
