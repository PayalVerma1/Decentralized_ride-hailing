import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth.jsx";
import App from "./App";
import ScrollToTop from "./components/common/ScrollToTop";
import LoadingScreen from "./components/common/LoadingScreen";
import "./index.css";

/**
 * Root component – renders App with auth provider, loading screen,
 * scroll restoration, and browser router.
 */
function Root() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Brief branded loading screen
    const timer = setTimeout(() => setInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <LoadingScreen visible={initialLoading} />
          <ScrollToTop />
          <App />
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
