import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, ExternalLink, Github, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Project {
  id: string;
  title: string;
  description: string;
  completionDate: string;
  image: string;
  technologies: string[];
  role: string;
  challenges: string;
  solutions: string;
  liveUrl?: string;
  githubUrl?: string;
  category: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform built with React and Node.js, supporting multiple vendors, real-time inventory management, and secure payment processing.',
    completionDate: '2024-02',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c',
    technologies: ['React', 'Node.js', 'MongoDB', 'Redux', 'Stripe'],
    role: 'Lead Full Stack Developer',
    challenges: 'Implementing real-time inventory sync across multiple vendors while maintaining system performance.',
    solutions: 'Utilized WebSocket connections and implemented an efficient caching strategy to handle real-time updates.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    category: 'Full Stack',
  },
  {
    id: '2',
    title: 'AI-Powered Analytics Dashboard',
    description: 'An analytics dashboard that uses machine learning to provide predictive insights and data visualization for business metrics.',
    completionDate: '2024-01',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
    technologies: ['Python', 'React', 'TensorFlow', 'D3.js'],
    role: 'Frontend Developer & ML Engineer',
    challenges: 'Creating intuitive visualizations for complex ML predictions.',
    solutions: 'Developed custom D3.js components and implemented progressive loading for large datasets.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    category: 'Machine Learning',
  },
  {
    id: '3',
    title: 'Real-time Collaboration Tool',
    description: 'A collaborative workspace application supporting real-time document editing, video conferencing, and team chat.',
    completionDate: '2023-12',
    image: 'https://images.unsplash.com/photo-1600267175161-cfaa711b4a81',
    technologies: ['WebRTC', 'Socket.io', 'React', 'Node.js'],
    role: 'Full Stack Developer',
    challenges: 'Maintaining consistency across multiple concurrent users.',
    solutions: 'Implemented Operational Transformation algorithm for conflict resolution.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    category: 'Collaboration',
  },
];

const categories = ['All', 'Full Stack', 'Machine Learning', 'Collaboration'];

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Projects Portfolio | John Doe</title>
        <meta name="description" content="Explore my portfolio of web development and software engineering projects." />
        <meta property="og:title" content="Projects Portfolio | John Doe" />
        <meta property="og:description" content="Explore my portfolio of web development and software engineering projects." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-gray-500 text-sm">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Projects</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
            <p className="text-xl text-gray-600">
              Explore my latest work and personal projects
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Projects Grid/List */}
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`${viewMode === 'list' ? 'w-1/3' : ''}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className={`p-6 ${viewMode === 'list' ? 'w-2/3' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {project.title}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {project.completionDate}
                    </span>
                  </div>
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
                  <div className="flex justify-between items-center">
                    <div className="space-x-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink size={16} className="mr-1" />
                          Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-gray-600 hover:text-gray-700"
                        >
                          <Github size={16} className="mr-1" />
                          Code
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Project Details Modal */}
          {selectedProject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Description</h3>
                      <p className="text-gray-600">{selectedProject.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Role</h3>
                      <p className="text-gray-600">{selectedProject.role}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Challenges</h3>
                      <p className="text-gray-600">{selectedProject.challenges}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Solutions</h3>
                      <p className="text-gray-600">{selectedProject.solutions}</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Demo
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}