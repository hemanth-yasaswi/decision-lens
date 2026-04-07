import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon, User } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Placeholder for auth state
  const user = null; // Set to { photoURL: '...' } to test Google profile image

  return (
    <header className="fixed top-0 w-full z-50 bg-[#E6EEFF]/80 backdrop-blur-md border-b border-[#D6E4FF] shadow-sm flex justify-between items-center px-8 h-16 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
          <span className="font-bold text-xl text-[#1E293B] transition-colors duration-300">DecisionLens</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link className="text-primary font-bold border-b-2 border-primary py-1" to="/dashboard">
            Dashboard
          </Link>
          <Link className="text-[#475569] hover:text-primary font-bold py-1 transition-all duration-300" to="/dashboard/chat">
            AI Workspace
          </Link>
          <Link className="text-[#475569] hover:text-primary font-bold py-1 transition-all duration-300" to="/dashboard/chat">
            Features
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div 
          className="w-9 h-9 rounded-xl overflow-hidden bg-[#D6E4FF] border border-[#D6E4FF] cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all flex items-center justify-center"
          onClick={() => navigate(user ? '/dashboard' : '/login')}
        >
          {user?.photoURL ? (
            <img 
              className="w-full h-full object-cover" 
              alt="User profile" 
              src={user.photoURL}
            />
          ) : (
            <User size={20} className="text-[#475569]" />
          )}
        </div>
      </div>
    </header>
  );
}
