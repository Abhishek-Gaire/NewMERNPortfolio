import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with real-time inventory, payment processing, and admin dashboard.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.IO'],
    imageUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    id: '2',
    title: 'Real-time Chat Application',
    description: 'Scalable chat application with private messaging, group chats, and file sharing capabilities.',
    technologies: ['React', 'Socket.IO', 'Express', 'MongoDB'],
    imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
  {
    id: '3',
    title: 'Task Management System',
    description: 'Project management tool with Kanban boards, task assignments, and progress tracking.',
    technologies: ['React', 'TypeScript', 'NestJS', 'PostgreSQL'],
    imageUrl: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-2"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <a
                    href={project.liveUrl}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} className="mr-1" />
                    Live Demo
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex items-center text-gray-600 hover:text-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} className="mr-1" />
                    Source Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;