import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
    </div>
  );
}