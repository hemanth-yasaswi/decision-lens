import { Outlet, Link } from "react-router-dom";
import Logo from "../components/Logo";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-300">
      {/* Left Side: Form Section */}
      <div className="w-full md:w-1/2 bg-transparent flex flex-col p-8 md:p-12 lg:p-16 transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2 mb-12">
          <Logo className="w-10 h-10" />
          <span className="text-2xl font-bold tracking-tight text-[#1E293B]">DecisionLens</span>
        </Link>
        
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <Outlet />
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-sky-600 to-teal-500 p-12 lg:p-24 items-center justify-center relative overflow-hidden transition-colors duration-300">
        <div className="relative z-10 text-white max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Analyze contracts 10x faster with Contextual AI.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Our new RAG engine understands the nuance of your specific documents, providing accurate answers instantly.
          </p>
          
        </div>
        
        {/* Abstract shapes for background */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#D6E4FF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
