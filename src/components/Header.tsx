import React from "react";
import { Menu, X, Github, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blogs" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-xl">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            AG
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-3 text-black-600 hover:text-bblack-900 hover:font-medium transition-colors ${
                  location.pathname === item.href
                    ? "text-blue-900 font-bold"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Social Links */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/Abhishek-Gaire"
              className="text-gray-600 hover:text-gray-900"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
              className="text-gray-600 hover:text-gray-900"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://x.com/GaireAbhishek44"
              className="text-gray-600 hover:text-gray-900"
            >
              <Twitter size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 text-xl">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-600 hover:text-gray-900 ${
                    location.pathname === item.href
                      ? "text-blue-600 font-medium"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com/Abhishek-Gaire"
                className="text-gray-600 hover:text-gray-900"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/abhisek-gaire-359294219/"
                className="text-gray-600 hover:text-gray-900"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="https://x.com/GaireAbhishek44"
                className="text-gray-600 hover:text-gray-900"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
