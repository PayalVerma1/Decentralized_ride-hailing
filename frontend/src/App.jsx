import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";

// Auth guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";

// Layouts (loaded immediately)
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Lazy-loaded pages
const LandingPage = lazy(() => import("./pages/landing/LandingPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPassengerPage = lazy(
  () => import("./pages/auth/RegisterPassengerPage"),
);
const RegisterDriverPage = lazy(
  () => import("./pages/auth/RegisterDriverPage"),
);

const PassengerDashboard = lazy(
  () => import("./pages/passenger/PassengerDashboard"),
);
const BookRidePage = lazy(() => import("./pages/booking/BookRidePage"));
const RideHistoryPage = lazy(() => import("./pages/passenger/RideHistoryPage"));
const WalletPage = lazy(() => import("./pages/passenger/WalletPage"));
const RewardsPage = lazy(() => import("./pages/passenger/RewardsPage"));

const DriverDashboard = lazy(() => import("./pages/driver/DriverDashboard"));
const DriverRidesPage = lazy(() => import("./pages/driver/DriverRidesPage"));
const DriverEarningsPage = lazy(
  () => import("./pages/driver/DriverEarningsPage"),
);
const DriverDocumentsPage = lazy(
  () => import("./pages/driver/DriverDocumentsPage"),
);

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminDriversPage = lazy(() => import("./pages/admin/AdminDriversPage"));
const AdminRidesPage = lazy(() => import("./pages/admin/AdminRidesPage"));
const AdminAnalyticsPage = lazy(
  () => import("./pages/admin/AdminAnalyticsPage"),
);

const ProfilePage = lazy(() => import("./pages/profile/ProfilePage"));
const NotificationsPage = lazy(
  () => import("./pages/common/NotificationsPage"),
);
const ContactPage = lazy(() => import("./pages/common/ContactPage"));
const NotFoundPage = lazy(() => import("./pages/common/NotFoundPage"));

/** Page transition variants */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
    </motion.div>
  );
}

function PageSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-muted/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PageWrapper>
                <LandingPage />
              </PageWrapper>
            }
          />
          <Route
            path="/contact"
            element={
              <PageWrapper>
                <ContactPage />
              </PageWrapper>
            }
          />
        </Route>

        {/* Auth Routes – redirect to dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <PageWrapper>
                <LoginPage />
              </PageWrapper>
            </GuestRoute>
          }
        />
        <Route
          path="/register/passenger"
          element={
            <GuestRoute>
              <PageWrapper>
                <RegisterPassengerPage />
              </PageWrapper>
            </GuestRoute>
          }
        />
        <Route
          path="/register/driver"
          element={
            <GuestRoute>
              <PageWrapper>
                <RegisterDriverPage />
              </PageWrapper>
            </GuestRoute>
          }
        />

        {/* Passenger Dashboard – requires passenger role */}
        <Route
          path="/passenger"
          element={
            <ProtectedRoute roles={["passenger"]}>
              <DashboardLayout role="passenger" />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageWrapper>
                <PassengerDashboard />
              </PageWrapper>
            }
          />
          <Route
            path="book"
            element={
              <PageWrapper>
                <BookRidePage />
              </PageWrapper>
            }
          />
          <Route
            path="history"
            element={
              <PageWrapper>
                <RideHistoryPage />
              </PageWrapper>
            }
          />
          <Route
            path="wallet"
            element={
              <PageWrapper>
                <WalletPage />
              </PageWrapper>
            }
          />
          <Route
            path="rewards"
            element={
              <PageWrapper>
                <RewardsPage />
              </PageWrapper>
            }
          />
          <Route
            path="notifications"
            element={
              <PageWrapper>
                <NotificationsPage />
              </PageWrapper>
            }
          />
          <Route
            path="profile"
            element={
              <PageWrapper>
                <ProfilePage />
              </PageWrapper>
            }
          />
        </Route>

        {/* Driver Dashboard – requires driver role */}
        <Route
          path="/driver"
          element={
            <ProtectedRoute roles={["driver"]}>
              <DashboardLayout role="driver" />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageWrapper>
                <DriverDashboard />
              </PageWrapper>
            }
          />
          <Route
            path="rides"
            element={
              <PageWrapper>
                <DriverRidesPage />
              </PageWrapper>
            }
          />
          <Route
            path="earnings"
            element={
              <PageWrapper>
                <DriverEarningsPage />
              </PageWrapper>
            }
          />
          <Route
            path="documents"
            element={
              <PageWrapper>
                <DriverDocumentsPage />
              </PageWrapper>
            }
          />
          <Route
            path="notifications"
            element={
              <PageWrapper>
                <NotificationsPage />
              </PageWrapper>
            }
          />
          <Route
            path="profile"
            element={
              <PageWrapper>
                <ProfilePage />
              </PageWrapper>
            }
          />
        </Route>

        {/* Admin Dashboard – requires admin role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <DashboardLayout role="admin" />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            }
          />
          <Route
            path="users"
            element={
              <PageWrapper>
                <AdminUsersPage />
              </PageWrapper>
            }
          />
          <Route
            path="drivers"
            element={
              <PageWrapper>
                <AdminDriversPage />
              </PageWrapper>
            }
          />
          <Route
            path="rides"
            element={
              <PageWrapper>
                <AdminRidesPage />
              </PageWrapper>
            }
          />
          <Route
            path="analytics"
            element={
              <PageWrapper>
                <AdminAnalyticsPage />
              </PageWrapper>
            }
          />
          <Route
            path="notifications"
            element={
              <PageWrapper>
                <NotificationsPage />
              </PageWrapper>
            }
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFoundPage />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
