import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import Sidebar from "../components/common/Sidebar";
import DashboardHeader from "../components/common/DashboardHeader";

/**
 * SidebarContext – lets child pages toggle mobile sidebar.
 */
const SidebarContext = createContext({ toggleMobile: () => {} });
export const useSidebar = () => useContext(SidebarContext);

/**
 * DashboardLayout
 * Shared layout for Passenger, Driver, and Admin dashboards.
 * The `role` prop determines sidebar navigation items.
 */
export default function DashboardLayout({ role = "passenger" }) {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Scroll main content to top on route change
  useEffect(() => {
    const main = document.getElementById("dashboard-main");
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <SidebarContext.Provider
      value={{ toggleMobile: () => setMobileOpen((v) => !v) }}
    >
      <div className="flex h-screen bg-bg overflow-hidden">
        <Sidebar
          role={role}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <DashboardHeader
            role={role}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main
            id="dashboard-main"
            className="flex-1 overflow-y-auto scroll-smooth"
          >
            <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
