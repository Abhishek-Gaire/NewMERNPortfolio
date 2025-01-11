import React from 'react';
import DOMPurify from 'dompurify';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div 
      className="prose prose-lg max-w-none mb-12"
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}