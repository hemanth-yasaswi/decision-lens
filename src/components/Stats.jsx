import React from 'react';
import { Brain, Cpu, LayoutList, ShieldCheck } from 'lucide-react';

export function Stats() {
  const features = [
    {
      title: "Smart Decision Explanations",
      description: "Understand WHY decisions were made using real document evidence",
      icon: Brain,
      color: "text-primary"
    },
    {
      title: "Context-Aware AI",
      description: "Goes beyond keywords and understands meaning",
      icon: Cpu,
      color: "text-primary"
    },
    {
      title: "Timeline-Based Reasoning",
      description: "See how decisions evolved over time",
      icon: LayoutList,
      color: "text-primary"
    },
    {
      title: "Transparent AI",
      description: "Every answer is backed by real sources",
      icon: ShieldCheck,
      color: "text-primary"
    }
  ];

  return (
    <section className="py-32 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1E293B] tracking-tight">
            Why DecisionLens?
          </h2>
          <p className="text-[#475569] text-lg max-w-2xl mx-auto leading-relaxed">
            The most advanced AI engine built specifically for complex document analysis and decision transparency.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#F0F5FF] p-10 rounded-[2.5rem] border border-[#D6E4FF] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-500 group">
              <div className={`w-14 h-14 rounded-2xl bg-[#D6E4FF] shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`${feature.color}`} size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#1E293B] tracking-tight">{feature.title}</h3>
              <p className="text-[#475569] text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
