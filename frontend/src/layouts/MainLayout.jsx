import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

/**
 * MainLayout
 * Used for public-facing pages (Landing, Contact, etc.)
 * Includes scroll-to-top on route change.
 */
export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
