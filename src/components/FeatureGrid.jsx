import React from 'react';
import { FileText, Brain, History, ShieldCheck } from 'lucide-react';

export function FeatureGrid() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        {/* Main Feature Card */}
        <div className="md:col-span-7 bg-[#F0F5FF] rounded-[2rem] p-10 flex flex-col justify-between overflow-hidden relative group border border-[#D6E4FF] shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#D6E4FF] flex items-center justify-center text-primary mb-6">
              <FileText size={28} />
            </div>
            <h3 className="text-3xl font-bold mb-4 text-[#1E293B] tracking-tight">Semantic Analysis</h3>
            <p className="text-[#475569] max-w-sm text-lg leading-relaxed">Deep dive into thousands of documents. DecisionLens understands context, not just keywords.</p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-2/3 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
            <img 
              className="w-full h-full object-contain" 
              alt="abstract artistic representation" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgBBuylgfoKNlDQ6LoKL_H2g8KYD5F9sHap7P9_eGcd2a65WLMRHj2qu_bnGpCWsJgBFxNp6BovqHMO_aPHA90itvd-HKARaCDSPrzoFRS5q0K8kfW7wRbGXLUZF1f1mex3oqJHosRRYazl507Ayq1-Mwh3yCeuhx3e7QgT1XK5BU3D8rsTS7KH4sd_DoMVHkjEWwYHIMhb6qm1ygi316yLEdayWZ-h73aIp7NdWCaNxDHz_meRnOw1KuTakgW2-YuchZWg4dkHm9l"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        
        {/* Side Top Card */}
        <div className="md:col-span-5 bg-[#F0F5FF] rounded-[2rem] p-10 flex flex-col justify-start border border-[#D6E4FF] shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#D6E4FF] flex items-center justify-center text-primary mb-6">
            <Brain size={28} />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-[#1E293B] tracking-tight">RAG Architecture</h3>
          <p className="text-[#475569] text-base leading-relaxed">Retrieval Augmented Generation ensures your AI results are grounded in your specific document facts.</p>
        </div>
        
        {/* Bottom Row Left */}
        <div className="md:col-span-4 bg-[#F0F5FF] rounded-[2rem] p-10 border border-[#D6E4FF] shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#D6E4FF] flex items-center justify-center text-primary mb-6">
            <History size={28} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-[#1E293B] tracking-tight">Decision Trail</h3>
          <p className="text-[#475569] text-sm leading-relaxed">Every insight is traceable. See the exact source document and paragraph for every AI conclusion.</p>
        </div>
        
        {/* Bottom Row Right */}
        <div className="md:col-span-8 bg-[#F0F5FF] rounded-[2rem] p-10 flex items-center justify-between gap-8 border border-[#D6E4FF] shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#1E293B] tracking-tight">Enterprise Grade Security</h3>
            <p className="text-[#475569] text-sm max-w-md leading-relaxed">Your data never trains public models. We deploy isolated instances for your private analysis needs with military-grade encryption.</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider">SOC2 Ready</span>
              <span className="px-3 py-1 bg-blue-400 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">AES-256</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <ShieldCheck size={96} className="text-primary/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
