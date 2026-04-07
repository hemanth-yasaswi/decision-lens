import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Menu, ChevronLeft } from "lucide-react";
import { cn } from "../utils/cn";
import { useAuth } from "../hooks/useAuth";

function DashboardContent() {
  const { isCollapsed, toggleSidebar, toggleMobile } = useSidebar();
  const { user } = useAuth();

  // Derive initials: prefer name, fall back to email first letter
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : user?.email
    ? user.email[0].toUpperCase()
    : "U";

  const displayName = user?.name || user?.email || "User";

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <Sidebar />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "pl-20" : "pl-64",
          "max-md:pl-0"
        )}
      >
        <header className="h-16 bg-[#E6EEFF]/80 backdrop-blur-md border-b border-[#D6E4FF] sticky top-0 z-10 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleMobile}
              className="md:hidden p-2 rounded-xl bg-[#D6E4FF] text-primary hover:bg-[#C4D8FF] transition-all"
              aria-label="Toggle mobile menu"
            >
              <Menu size={20} />
            </button>

            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-2 rounded-xl bg-[#D6E4FF] text-primary hover:bg-[#C4D8FF] transition-all"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>

            <h2 className="text-lg font-bold text-[#1E293B] truncate">Dashboard</h2>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                {initials}
              </div>
              <span className="hidden sm:inline text-sm font-semibold text-[#1E293B]">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
