import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

export function Footer() {
  return (
    <footer className="py-24 px-8 border-t border-[#D6E4FF] relative z-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-8">
          <Link to="/">
            <Logo />
          </Link>
          <p className="text-[#475569] text-base leading-relaxed">Next-generation decision intelligence powered by secure, private RAG models.</p>
        </div>
        
        <div>
          <h4 className="font-bold text-[#1E293B] mb-8 text-lg tracking-tight">Platform</h4>
          <ul className="space-y-4 text-[#475569] text-base">
            <li><Link className="hover:text-primary transition-colors" to="/dashboard">AI Query</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/dashboard/chat">AI Workspace</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/dashboard/explanations">Integrations</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/">Pricing</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-[#1E293B] mb-8 text-lg tracking-tight">Resources</h4>
          <ul className="space-y-4 text-[#475569] text-base">
            <li><a className="hover:text-primary transition-colors" href="#">Case Studies</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Documentation</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">API Reference</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-[#1E293B] mb-8 text-lg tracking-tight">Legal</h4>
          <ul className="space-y-4 text-[#475569] text-base">
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Security</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
