import React from 'react';
import { Helmet } from 'react-helmet-async';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Blog from '../components/Blog';
import Contact from '../components/Contact/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Home</title>
        <meta name="description" content="Explore my portfolio of web development and software engineering projects." />
        <meta property="og:title" content="Home Page Abhishek Gaire" /> 
      </Helmet>
      <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
    </>
  );
}