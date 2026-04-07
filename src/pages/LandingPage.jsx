import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/Navbar";
import Logo from "../components/Logo";
import { 
  FileSearch, 
  ShieldCheck, 
  Zap, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#1E293B] mb-6 transition-colors duration-300">
              AI-Powered <span className="text-primary">Decision Analysis</span> System
            </h1>
            <p className="text-xl text-[#475569] max-w-2xl mx-auto mb-10 transition-colors duration-300">
              Transform complex documents into clear, actionable insights. DecisionLens uses advanced RAG technology to explain decisions with precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg">
                  Get Started for Free
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B] mb-4 transition-colors duration-300">Powerful Features for Modern Teams</h2>
            <p className="text-[#475569] max-w-2xl mx-auto transition-colors duration-300">Everything you need to analyze, understand, and explain complex decisions at scale.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileSearch,
                title: "Document Analysis",
                desc: "Upload PDFs, docs, or spreadsheets and let our AI extract the most relevant information instantly.",
                color: "bg-primary/10 text-primary"
              },
              {
                icon: Zap,
                title: "Instant Explanations",
                desc: "Get clear, structured explanations for any decision, backed by evidence from your own documents.",
                color: "bg-secondary/10 text-secondary"
              },
              {
                icon: ShieldCheck,
                title: "Enterprise Security",
                desc: "Your data is encrypted and private. We use isolated environments to ensure your information stays yours.",
                color: "bg-accent/10 text-accent"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#F0F5FF] p-8 rounded-2xl border border-[#D6E4FF] shadow-md hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} transition-colors duration-300`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#1E293B] mb-3 transition-colors duration-300">{feature.title}</h3>
                <p className="text-[#475569] leading-relaxed transition-colors duration-300">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1E293B] mb-8 transition-colors duration-300">How DecisionLens Works</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Upload Documents", desc: "Drag and drop your files into our secure vault." },
                  { step: "02", title: "AI Processing", desc: "Our neural engine analyzes the content and context." },
                  { step: "03", title: "Get Insights", desc: "Ask questions and receive structured explanations with evidence." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg transition-colors duration-300">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#1E293B] mb-2 transition-colors duration-300">{item.title}</h3>
                      <p className="text-[#475569] transition-colors duration-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-[#D6E4FF]/30 flex items-center justify-center p-12 transition-colors duration-300">
                <div className="w-full h-full bg-[#F0F5FF] rounded-2xl shadow-2xl border border-[#D6E4FF] p-6 transition-colors duration-300">
                   <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-[#D6E4FF] rounded transition-colors duration-300" />
                      <div className="h-4 w-1/2 bg-[#D6E4FF] rounded transition-colors duration-300" />
                      <div className="h-32 w-full bg-[#E6EEFF] rounded-xl border border-[#D6E4FF] flex items-center justify-center transition-colors duration-300">
                        <Zap className="text-primary animate-pulse" size={48} />
                      </div>
                      <div className="h-4 w-full bg-[#D6E4FF] rounded transition-colors duration-300" />
                      <div className="h-4 w-5/6 bg-[#D6E4FF] rounded transition-colors duration-300" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[#D6E4FF] transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-[#475569] hover:text-primary transition-colors duration-300">Privacy</Link>
            <Link to="/terms" className="text-sm text-[#475569] hover:text-primary transition-colors duration-300">Terms</Link>
            <Link to="/contact" className="text-sm text-[#475569] hover:text-primary transition-colors duration-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
