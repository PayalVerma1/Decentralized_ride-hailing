/**
 * Application-wide constants
 */

export const APP_NAME = "RideChain";
export const APP_TAGLINE = "Secure. Fast. Decentralized Mobility.";

/** Vehicle types available for booking */
export const VEHICLE_TYPES = [
  {
    id: "economy",
    name: "Economy",
    description: "Affordable everyday rides",
    icon: "Car",
    multiplier: 1,
    seats: 4,
    eta: "3-5 min",
  },
  {
    id: "comfort",
    name: "Comfort",
    description: "Newer cars with extra legroom",
    icon: "CarFront",
    multiplier: 1.4,
    seats: 4,
    eta: "4-6 min",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury vehicles, top-rated drivers",
    icon: "Sparkles",
    multiplier: 2,
    seats: 4,
    eta: "5-8 min",
  },
  {
    id: "xl",
    name: "XL",
    description: "SUVs & Vans for larger groups",
    icon: "Truck",
    multiplier: 1.8,
    seats: 6,
    eta: "6-10 min",
  },
];

/** Ride statuses */
export const RIDE_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DRIVER_ARRIVING: "driver_arriving",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

/** Payment statuses */
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
};

/** Dashboard navigation items */
export const PASSENGER_NAV = [
  { name: "Dashboard", path: "/passenger", icon: "LayoutDashboard" },
  { name: "Book Ride", path: "/passenger/book", icon: "MapPin" },
  { name: "Ride History", path: "/passenger/history", icon: "History" },
  { name: "Wallet", path: "/passenger/wallet", icon: "Wallet" },
  { name: "Rewards", path: "/passenger/rewards", icon: "Gift" },
  { name: "Notifications", path: "/passenger/notifications", icon: "Bell" },
  { name: "Profile", path: "/passenger/profile", icon: "User" },
];

export const DRIVER_NAV = [
  { name: "Dashboard", path: "/driver", icon: "LayoutDashboard" },
  { name: "My Rides", path: "/driver/rides", icon: "Car" },
  { name: "Earnings", path: "/driver/earnings", icon: "DollarSign" },
  { name: "Documents", path: "/driver/documents", icon: "FileText" },
  { name: "Notifications", path: "/driver/notifications", icon: "Bell" },
  { name: "Profile", path: "/driver/profile", icon: "User" },
];

export const ADMIN_NAV = [
  { name: "Dashboard", path: "/admin", icon: "LayoutDashboard" },
  { name: "Users", path: "/admin/users", icon: "Users" },
  { name: "Drivers", path: "/admin/drivers", icon: "Car" },
  { name: "Rides", path: "/admin/rides", icon: "MapPin" },
  { name: "Analytics", path: "/admin/analytics", icon: "BarChart3" },
  { name: "Notifications", path: "/admin/notifications", icon: "Bell" },
];
