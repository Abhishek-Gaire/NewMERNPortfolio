import React, { useMemo } from 'react';
import { createEditor  } from 'slate';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, useSlate } from 'slate-react';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TagSelector from './TagSelector';
import ImageUpload from '../shared/ImageUpload';
import { BlogPost } from '../../../types/index';
import { initialEditorValue } from '../../../types/slate';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()),
  featuredImage: z.string().optional(),
  date: z.string(),
  publish: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

interface PostEditorProps {
  post?: BlogPost;
  onSave: (data: PostForm) => Promise<void>;
}

// Custom editor toolbar button for bold, italic, heading, alignment, etc.
const CustomEditor = () => {
  const editor = useSlate();

  // Toggle mark (bold, italic)
  const toggleMark = (mark: "bold" | "italic" | "underline") => {
    const isActive = isMarkActive(mark);
    if (isActive) {
      Editor.removeMark(editor, mark);
    } else {
      Editor.addMark(editor, mark, true);
    }
  };

  const isMarkActive = (mark: 'bold' | 'italic' | 'underline') => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Text.isText(n) && n[mark as keyof typeof n] === true,
    });
    return !!match;
  };
  

  const toggleBlock = (blockType: string) => {
    const isActive = isBlockActive(blockType);
    const isList = blockType === 'list-item';
  
    // Unwrap the current list items if the block type is not a list.
    Transforms.unwrapNodes(editor, {
      match: (n) => Editor.isBlock(editor, n) && SlateElement.isElement(n) && n.type === 'list-item',
    });
  
    // Set the new block type, defaulting to 'paragraph' when inactive.
  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : (blockType as 'paragraph' | 'heading' | 'list-item'),
  });
  };
  
  // Helper function to check if the block is active.
  const isBlockActive = (blockType: string) => {
    const [match] = Editor.nodes(editor, {
      match: (n) => Editor.isBlock(editor, n) && SlateElement.isElement(n) && n.type === blockType,
    });
    return !!match;
  };

  // Handle alignment change
  const toggleAlignment = (alignment: 'left' | 'center' | 'right') => {
    Transforms.setNodes(editor, { align: alignment });
  };

  return (
    <div className="toolbar">
      <button onClick={() => toggleMark('bold')}>Bold</button>
      <button onClick={() => toggleMark('italic')}>Italic</button>
      <button onClick={() => toggleBlock('heading')}>Heading</button>
      <button onClick={() => toggleBlock('paragraph')}>Paragraph</button>
      <button onClick={() => toggleAlignment('left')}>Align Left</button>
      <button onClick={() => toggleAlignment('center')}>Align Center</button>
      <button onClick={() => toggleAlignment('right')}>Align Right</button>
    </div>
  );
};

export default function PostEditor({ post, onSave }: PostEditorProps) {
  const editor = useMemo(() => withReact(createEditor()), []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || JSON.stringify(initialEditorValue),
      date: post?.date,
      tags: post?.tags || [],
      publish: post?.publish || false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
          <Slate editor={editor} initialValue={initialEditorValue} onChange={() => {}}>
            <CustomEditor />
            <Editable
              renderElement={(props) => <div {...props.attributes}>{props.children}</div>}
              renderLeaf={(props) => {
                if (props.leaf.bold) {
                  return <strong>{props.children}</strong>;
                }
                if (props.leaf.italic) {
                  return <em>{props.children}</em>;
                }
                return <span>{props.children}</span>;
              }}
            />
          </Slate>
          )}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagSelector
              selectedTags={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Featured Image
        </label>
        <Controller
          name="featuredImage"
          control={control}
          render={({ field }) => (
            <ImageUpload
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('publish')}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Publish</span>
        </label>
      </div>
    </form>
  );
}
