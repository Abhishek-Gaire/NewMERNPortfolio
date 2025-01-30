import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, ExternalLink, Github, Share2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { Project } from "../types/index";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

const categories = ["All", "Full Stack", "Backend", "Collaboration"];

export default function ProjectsPage() {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Projects").select("*");

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects?.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((tech: any) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Something went wrong. Please try again later.</p>;
  }
  return (
    <>
      <Helmet>
        <title>Projects Portfolio</title>
        <meta
          name="description"
          content="Explore my portfolio of web development and software engineering projects."
        />
        <meta property="og:title" content="Projects Portfolio" />
        <meta
          property="og:description"
          content="Explore my portfolio of web development and software engineering projects."
        />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-gray-500 text-sm">
            <Link to="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Projects</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              My Projects
            </h1>
            <p className="text-xl text-gray-600">
              Explore my latest work and personal projects
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
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
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Projects Grid/List */}
          <div
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredProjects?.map((project) => (
              <motion.div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div className={`${viewMode === "list" ? "w-1/3" : ""}`}>
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className={`p-6 ${viewMode === "list" ? "w-2/3" : ""}`}>
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
                    {project.technologies.map((tech: any) => (
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
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink size={16} className="mr-1" />
                          Demo
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
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
                    <h2 className="text-2xl font-bold">
                      {selectedProject.title}
                    </h2>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-gray-500 text-3xl hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-80 object-cover rounded-lg mb-6"
                  />
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">
                        {selectedProject.description}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Role</h3>
                      <p className="text-gray-600">{selectedProject.role}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Challenges</h3>
                      <p className="text-gray-600">
                        {selectedProject.challenges}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Solutions</h3>
                      <p className="text-gray-600">
                        {selectedProject.solutions}
                      </p>
                    </div>
                    <div className="flex justify-end space-x-4">
                      {selectedProject.live_url && (
                        <a
                          href={selectedProject.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View Demo
                        </a>
                      )}
                      {selectedProject.github_url && (
                        <a
                          href={selectedProject.github_url}
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
