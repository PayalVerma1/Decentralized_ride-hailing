import api from "./api";

const rideService = {
  /** Book a new ride */
  bookRide: (data) => api.post("/rides/book", data),

  /** Get fare estimate */
  getFareEstimate: (pickup, destination, vehicleType) =>
    api.post("/rides/fare-estimate", { pickup, destination, vehicleType }),

  /** Get ride by ID */
  getRide: (rideId) => api.get(`/rides/${rideId}`),

  /** Get current user's rides */
  getMyRides: (params) => api.get("/rides/my-rides", { params }),

  /** Cancel a ride */
  cancelRide: (rideId, reason) =>
    api.put(`/rides/${rideId}/cancel`, { reason }),

  /** Rate a completed ride */
  rateRide: (rideId, rating, review) =>
    api.post(`/rides/${rideId}/rate`, { rating, review }),

  /** Driver: Get pending ride requests */
  getRideRequests: () => api.get("/rides/requests"),

  /** Driver: Accept a ride request */
  acceptRide: (rideId) => api.put(`/rides/${rideId}/accept`),

  /** Driver: Reject a ride request */
  rejectRide: (rideId, reason) =>
    api.put(`/rides/${rideId}/reject`, { reason }),

  /** Driver: Start ride (picked up passenger) */
  startRide: (rideId) => api.put(`/rides/${rideId}/start`),

  /** Driver: Complete ride */
  completeRide: (rideId) => api.put(`/rides/${rideId}/complete`),

  /** Admin: Get all rides */
  getAllRides: (params) => api.get("/rides", { params }),

  /** Admin: Get ride analytics */
  getRideAnalytics: (params) => api.get("/rides/analytics", { params }),
};

export default rideService;
