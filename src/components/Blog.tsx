import React from 'react';
import { Calendar, Tag } from 'lucide-react';

const blogPosts = [
  {
    id: '1',
    title: 'Building Scalable APIs with Node.js and Express',
    content: 'Learn how to build production-ready REST APIs using Node.js and Express...',
    date: '2024-03-15',
    tags: ['Node.js', 'Express', 'API'],
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
  },
  {
    id: '2',
    title: 'React Performance Optimization Techniques',
    content: 'Discover advanced techniques to optimize your React applications...',
    date: '2024-03-10',
    tags: ['React', 'Performance', 'JavaScript'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
  },
  {
    id: '3',
    title: 'MongoDB Best Practices for MERN Stack',
    content: 'Essential MongoDB patterns and practices for MERN stack applications...',
    date: '2024-03-05',
    tags: ['MongoDB', 'Database', 'MERN'],
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
  },
];

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Latest Blog Posts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar size={16} className="mr-2" />
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;