import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../utils/cn";
import Logo from "./Logo";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  Plus,
  X
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: MessageSquare, label: "AI Chat", path: "/dashboard/chat" },
  { icon: FileText, label: "Explanations", path: "/dashboard/explanations" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

function Tooltip({ children, label, show }) {
  if (!show) return children;
  return (
    <div className="relative group/tooltip">
      {children}
      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  );
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar();
  const { logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadHistory = () => {
      const saved = localStorage.getItem("decisionlens_chat_history");
      if (saved) {
        try { setHistory(JSON.parse(saved)); } catch (e) {}
      }
    };
    loadHistory();
    window.addEventListener("storage", loadHistory);
    window.addEventListener("chat_history_updated", loadHistory);
    return () => {
      window.removeEventListener("storage", loadHistory);
      window.removeEventListener("chat_history_updated", loadHistory);
    };
  }, []);

  const handleNewChat = () => {
    window.dispatchEvent(new CustomEvent("new_chat_requested"));
    navigate("/dashboard/chat");
    if (isMobileOpen) closeMobile();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    if (isMobileOpen) closeMobile();
  };

  const sidebarVariants = {
    expanded: { width: 256, x: 0 },
    collapsed: { width: 80, x: 0 },
    mobileOpen: { width: 256, x: 0 },
    mobileClosed: { width: 256, x: -256 },
  };

  const currentVariant = () => {
    if (windowWidth < 768) return isMobileOpen ? "mobileOpen" : "mobileClosed";
    return isCollapsed ? "collapsed" : "expanded";
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        variants={sidebarVariants}
        animate={currentVariant()}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 bottom-0 border-r border-[#D6E4FF] flex flex-col bg-[#E0EAFF] transition-colors duration-300 z-50 overflow-hidden"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <Logo />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-xl text-[#1E293B] whitespace-nowrap"
              >
                DecisionLens
              </motion.span>
            )}
          </Link>
          {isMobileOpen && (
            <button onClick={closeMobile} className="md:hidden text-[#475569]">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="px-4 mb-4">
          <Tooltip label="New Chat" show={isCollapsed}>
            <button
              onClick={handleNewChat}
              className={cn(
                "w-full flex items-center gap-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-all shadow-sm overflow-hidden",
                isCollapsed ? "justify-center p-3" : "px-4 py-2.5"
              )}
            >
              <Plus size={16} className="flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">New Chat</span>}
            </button>
          </Tooltip>
        </div>

        <nav className="px-4 space-y-1 mb-6">
          {menuItems.map((item) => (
            <Tooltip key={item.path} label={item.label} show={isCollapsed}>
              <Link
                to={item.path}
                onClick={isMobileOpen ? closeMobile : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden",
                  location.pathname === item.path
                    ? "bg-[#D6E4FF] text-primary shadow-sm"
                    : "text-[#475569] hover:bg-[#D6E4FF]/50 hover:text-primary",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </Link>
            </Tooltip>
          ))}
        </nav>

        <div className="flex-1 px-4 overflow-y-auto overflow-x-hidden">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-3 mb-2">
              <h4 className="text-[10px] font-bold text-[#475569] uppercase tracking-widest whitespace-nowrap">Recent Chats</h4>
            </div>
          )}
          <div className="space-y-1">
            {history.length === 0 ? (
              !isCollapsed && <p className="px-3 py-4 text-[10px] text-[#475569] italic">No recent chats</p>
            ) : (
              history.slice(0, 10).map((chat) => (
                <Tooltip key={chat.id} label={chat.title} show={isCollapsed}>
                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent("load_chat_requested", { detail: chat }));
                      navigate("/dashboard/chat");
                      if (isMobileOpen) closeMobile();
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#475569] hover:bg-[#D6E4FF]/50 hover:text-primary transition-all text-left truncate group overflow-hidden",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <MessageSquare size={14} className="flex-shrink-0 opacity-50" />
                    {!isCollapsed && <span className="truncate flex-1">{chat.title}</span>}
                  </button>
                </Tooltip>
              ))
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#D6E4FF]">
          <Tooltip label="Sign out" show={isCollapsed}>
            <button
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-[#475569] hover:bg-red-50 hover:text-red-600 transition-all duration-200 overflow-hidden",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut size={20} className="flex-shrink-0" />
              {!isCollapsed && <span className="whitespace-nowrap">Sign out</span>}
            </button>
          </Tooltip>
        </div>
      </motion.aside>
    </>
  );
}
