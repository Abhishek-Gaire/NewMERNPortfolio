import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TagSelector from './TagSelector';
import ImageUpload from '../shared/ImageUpload';
import { BlogPost } from '../../../types';

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
const TINY_MCE_API_KEY = import.meta.env.TINYMCE_API_KEY;
const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().min(1, 'Image is required'),
  tags: z.array(tagSchema), // Updated to validate an array of objects
  publish: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

interface PostEditorProps {
  post?: BlogPost;
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
      publish: post?.publish || false,
      tags: post?.tags || [],
      imageUrl:post?.imageUrl || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 px-3 py-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <Controller
          name="content"
          defaultValue='Write Your Blog Post Here'
          control={control}
          render={({ field }) => (
            <Editor
              apiKey={TINY_MCE_API_KEY}
              onEditorChange={(content) => field.onChange(content)}
              init={{
                plugins: [
                  // Core editing features
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 
                  'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                  // Optional features: Remove these if not used
                  'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 
                  'a11ychecker', 'tinymcespellchecker', 'mentions', 'tinycomments', 
                  'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'markdown',
                ],
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                branding: false, // Removes "Powered by TinyMCE" branding
                tinycomments_author: 'Author name',
              }}
              // initialValue={field.value}
            />
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
          name="imageUrl"
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