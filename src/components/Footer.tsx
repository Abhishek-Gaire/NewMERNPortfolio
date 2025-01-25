import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Abhishek Gaire</h3>
            <p className="text-gray-400">
              Full Stack Developer specializing in MERN stack development.
              Building scalable web applications with modern technologies.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Abhishek-Gaire"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://x.com/GaireAbhishek44"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Abhishek. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;