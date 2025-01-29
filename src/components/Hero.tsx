import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="home"
      className="pt-20 min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-col gap-3 md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Full Stack Developer
              <span className="block text-blue-600">MERN Specialist</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              Hi, I'm Abhishek Gaire. I craft robust and scalable web
              applications using modern technologies. Specialized in MongoDB,
              Express.js, React, and Node.js.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/projects"
                className="px-8 py-3 text-xl bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                View Projects
                <ArrowRight className="ml-2" size={20} />
              </Link>
              <a
                href="#contact"
                className="px-8 py-3 text-xl border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Contact Me
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="https://vzftblsjklsdaquipabd.supabase.co/storage/v1/object/public/images/ppA.png?t=2025-01-20T18%3A03%3A03.252Z"
                  alt="Abhishek Gaire"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">3+ Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
