import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16 z-10">
        {/* Left Column: Text content */}
        <div className="text-center md:text-left space-y-10">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold text-[#1E293B] leading-tight tracking-tight"
          >
            Explain Decisions <br />
            <span className="text-primary">
              with AI
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-xl mx-auto md:mx-0 text-lg text-[#475569] leading-relaxed"
          >
            Unlock clarity in complex decisions with RAG-powered AI document analysis. Transform massive datasets into actionable intelligence instantly.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 pt-4"
          >
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all duration-300"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 bg-[#F0F5FF] text-[#1E293B] rounded-full font-bold text-lg border border-[#D6E4FF] shadow-sm hover:bg-[#E6EEFF] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Sign In
            </button>
          </motion.div>
        </div>

        {/* Right Column: Futuristic AI Crystal Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative group"
        >
          {/* Soft Glow Effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 to-teal-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          
          <div className="relative bg-[#D6E4FF]/40 backdrop-blur-md p-4 rounded-[2rem] shadow-2xl border border-[#D6E4FF]/20 overflow-hidden">
            <div className="w-full max-w-sm md:max-w-md mx-auto">
              <img 
                className="rounded-2xl w-full object-cover aspect-square transition-transform duration-1000 group-hover:scale-110" 
                alt="DecisionLens Futuristic AI Crystal Core" 
                src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating UI Elements (Simulated with Overlays) */}
              <div className="absolute top-8 right-8 bg-[#D6E4FF]/60 backdrop-blur-md p-3 rounded-xl border border-[#D6E4FF]/20 shadow-lg animate-bounce-slow">
                <div className="w-12 h-2 bg-sky-400/50 rounded-full mb-2" />
                <div className="w-8 h-2 bg-teal-400/50 rounded-full" />
              </div>
              
              <div className="absolute bottom-12 left-8 bg-[#D6E4FF]/60 backdrop-blur-md p-3 rounded-xl border border-[#D6E4FF]/20 shadow-lg animate-pulse">
                <div className="flex gap-1 items-end h-8">
                  <div className="w-2 h-4 bg-sky-400/50 rounded-t-sm" />
                  <div className="w-2 h-6 bg-teal-400/50 rounded-t-sm" />
                  <div className="w-2 h-3 bg-sky-400/50 rounded-t-sm" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
