import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TagSelector from './TagSelector';
import ImageUpload from '../shared/ImageUpload';
import { Post } from '../../../types';

const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  tags: z.array(z.string()),
  featuredImage: z.string().optional(),
  published: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

interface PostEditorProps {
  post?: Post;
  onSave: (data: PostForm) => Promise<void>;
}

export default function PostEditor({ post, onSave }: PostEditorProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      published: post?.published || false,
      tags: post?.tags?.map(tag => tag.id) || [],
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
            <Editor
              value={field.value}
              onEditorChange={field.onChange}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                  'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                  'fullscreen', 'insertdatetime', 'media', 'table', 'code',
                  'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help'
              }}
            />
          )}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            SEO Title
          </label>
          <input
            type="text"
            {...register('seoTitle')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            SEO Description
          </label>
          <textarea
            {...register('seoDescription')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
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
            {...register('published')}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Publish</span>
        </label>
      </div>
    </form>
  );
}