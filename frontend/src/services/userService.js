import api from "./api";

const userService = {
  /** Get current user profile */
  getProfile: () => api.get("/users/profile"),

  /** Update profile */
  updateProfile: (data) => api.put("/users/profile", data),

  /** Upload profile picture */
  uploadAvatar: (formData) =>
    api.put("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  /** Get saved locations */
  getSavedLocations: () => api.get("/users/locations"),

  /** Add a saved location */
  addSavedLocation: (data) => api.post("/users/locations", data),

  /** Remove a saved location */
  removeSavedLocation: (locationId) =>
    api.delete(`/users/locations/${locationId}`),

  /** Get emergency contacts */
  getEmergencyContacts: () => api.get("/users/emergency-contacts"),

  /** Add emergency contact */
  addEmergencyContact: (data) => api.post("/users/emergency-contacts", data),

  /** Update preferences */
  updatePreferences: (data) => api.put("/users/preferences", data),

  /** Admin: Get all users */
  getAllUsers: (params) => api.get("/users", { params }),

  /** Admin: Get all drivers */
  getAllDrivers: (params) => api.get("/users/drivers", { params }),

  /** Admin: Verify driver */
  verifyDriver: (driverId) => api.put(`/users/drivers/${driverId}/verify`),

  /** Admin: Suspend user */
  suspendUser: (userId, reason) =>
    api.put(`/users/${userId}/suspend`, { reason }),
};

export default userService;
