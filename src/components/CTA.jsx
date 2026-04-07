import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-40 px-8 relative z-10">
      <div className="max-w-6xl mx-auto bg-primary rounded-[4rem] p-20 text-center text-white relative overflow-hidden shadow-2xl transition-colors duration-300">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#EAF2FF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight leading-tight text-white">Ready to clarify <br/> your complexity?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-14 font-medium leading-relaxed text-xl">Join top analyst teams using DecisionLens to reduce blind spots and accelerate critical decision cycles.</p>
        
        <div className="flex justify-center items-center">
          <button 
            onClick={() => navigate('/register')}
            className="px-14 py-6 bg-[#F0F5FF] text-primary rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
