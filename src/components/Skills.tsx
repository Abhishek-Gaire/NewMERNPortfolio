import React from 'react';
import {
  Database,
  Server,
  Layout,
  Wrench,
  CheckCircle
} from 'lucide-react';

const Skills = () => {
  const skills = {
    frontend: ['ReactJS', 'TypeScript', 'Javascript', 'EJS', 'Tailwind CSS','Context API'],
    backend: ['Node.js', 'Express.js', 'NestJS', 'WebSocket', 'REST APIs','GraphQL APIs'],
    database: ['MongoDB', 'PostgreSQL', 'Sequelize', 'Mongoose', 'MySQL','Supabase'],
    tools: ['Git', 'Docker', 'NGinx', 'Postman', 'CI/CD','Swagger'],
  };

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Technical Skills</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Layout className="text-blue-600 mr-2" size={24} />
              <h3 className="text-xl font-semibold">Frontend</h3>
            </div>
            <ul className="space-y-2">
              {skills.frontend.map((skill) => (
                <li key={skill} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Server className="text-blue-600 mr-2" size={24} />
              <h3 className="text-xl font-semibold">Backend</h3>
            </div>
            <ul className="space-y-2">
              {skills.backend.map((skill) => (
                <li key={skill} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Database className="text-blue-600 mr-2" size={24} />
              <h3 className="text-xl font-semibold">Database</h3>
            </div>
            <ul className="space-y-2">
              {skills.database.map((skill) => (
                <li key={skill} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  {skill}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center mb-4">
              <Wrench className="text-blue-600 mr-2" size={24} />
              <h3 className="text-xl font-semibold">Tools</h3>
            </div>
            <ul className="space-y-2">
              {skills.tools.map((skill) => (
                <li key={skill} className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={16} />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;