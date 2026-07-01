/**
 * Utility helper functions
 */

/** Format currency */
export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format date to readable string */
export function formatDate(dateStr, options = {}) {
  const defaults = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", {
    ...defaults,
    ...options,
  });
}

/** Format relative time (e.g. "2 hours ago") */
export function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

/** Truncate text */
export function truncate(str, length = 50) {
  if (!str) return "";
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

/** Debounce function */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/** Generate initials from name */
export function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Calculate distance between two lat/lng points (Haversine) */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Estimate fare based on distance */
export function estimateFare(
  distanceKm,
  vehicleMultiplier = 1,
  baseFare = 2.5,
  perKm = 1.2,
) {
  return (baseFare + distanceKm * perKm) * vehicleMultiplier;
}

/** Validate email */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Validate phone */
export function isValidPhone(phone) {
  return /^\+?[\d\s-]{8,}$/.test(phone);
}
