import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent font-body text-[#1E293B] relative transition-colors duration-300">
      <Navbar />
      <main className="pt-16 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
