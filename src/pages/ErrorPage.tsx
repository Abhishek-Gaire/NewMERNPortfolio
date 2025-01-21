import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


// Error Page Component
export default function ErrorPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">Something went wrong. Please try again later.</p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
