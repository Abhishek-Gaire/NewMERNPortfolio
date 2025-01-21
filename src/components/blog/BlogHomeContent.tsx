import React from 'react';
import DOMPurify from 'dompurify';

interface BlogContentProps {
  content: string;
}

export default function BlogHomeContent({ content }: BlogContentProps) {
  const sanitizedContent = DOMPurify.sanitize(content);
  const textContent = sanitizedContent.replace(/<\/?p>/g, '');

  const addedContent = textContent + "...";
  return (
    <div 
      className="prose prose-lg max-w-none mb-12"
      dangerouslySetInnerHTML={{ __html: addedContent }}
    />
  );
}