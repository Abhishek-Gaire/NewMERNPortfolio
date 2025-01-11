import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      onChange(data.publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }, [onChange]);

  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="mx-auto h-32 w-auto"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
        )}
        <div className="flex text-sm text-gray-600">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
            <span>Upload a file</span>
            <input
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, GIF up to 10MB
        </p>
      </div>
    </div>
  );
}